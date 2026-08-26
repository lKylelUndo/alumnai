import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export class ChatRepository {
  private static CACHE_KEYS = {
    conversations: (userId: string) => `chat:conversations-${userId}`,
    messages: (conversationId: string) => `chat:messages-${conversationId}`,
  };

  /**
   * Invalidate chat caches for given users and optional conversation
   */
  async invalidateCache(userIds: string[], conversationId?: string) {
    const keys: string[] = userIds.map((id) => ChatRepository.CACHE_KEYS.conversations(id));
    if (conversationId) {
      keys.push(ChatRepository.CACHE_KEYS.messages(conversationId));
    }
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Get or create conversations for all active mentorships & collaborations of a user
   */
  async getUserConversations(userId: string) {
    const cacheKey = ChatRepository.CACHE_KEYS.conversations(userId);

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 1. Fetch active mentorships
    const mentorships = await prisma.mentorship.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ fromStudentId: userId }, { toAlumniId: userId }],
      },
      include: {
        fromStudent: {
          select: {
            id: true,
            role: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
              },
            },
          },
        },
        toAlumni: {
          select: {
            id: true,
            role: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
              },
            },
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    // 2. Fetch active collaborations
    const collaborations = await prisma.collaboration.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ fromAlumniId: userId }, { toStudentId: userId }],
      },
      include: {
        fromAlumni: {
          select: {
            id: true,
            role: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
              },
            },
          },
        },
        toStudent: {
          select: {
            id: true,
            role: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
              },
            },
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    const conversationsList = [];

    // Ensure conversation record exists for each active mentorship
    for (const m of mentorships) {
      let conv = m.conversation;
      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            type: "MENTORSHIP",
            mentorshipId: m.id,
          },
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });
      }

      const otherUser = m.fromStudentId === userId ? m.toAlumni : m.fromStudent;
      const lastMsg = conv.messages[0] || null;

      conversationsList.push({
        id: conv.id,
        type: "MENTORSHIP",
        relationshipId: m.id,
        otherUser: {
          id: otherUser.id,
          fullName: otherUser.profile?.fullName || "User",
          profilePicture: otherUser.profile?.profilePicture || null,
          role: otherUser.role,
          workField: otherUser.profile?.work_field || null,
        },
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              senderId: lastMsg.senderId,
              createdAt: lastMsg.createdAt,
            }
          : null,
        updatedAt: lastMsg?.createdAt || conv.createdAt,
      });
    }

    // Ensure conversation record exists for each active collaboration
    for (const c of collaborations) {
      let conv = c.conversation;
      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            type: "COLLABORATION",
            collaborationId: c.id,
          },
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });
      }

      const otherUser = c.fromAlumniId === userId ? c.toStudent : c.fromAlumni;
      const lastMsg = conv.messages[0] || null;

      conversationsList.push({
        id: conv.id,
        type: "COLLABORATION",
        relationshipId: c.id,
        otherUser: {
          id: otherUser.id,
          fullName: otherUser.profile?.fullName || "User",
          profilePicture: otherUser.profile?.profilePicture || null,
          role: otherUser.role,
          workField: otherUser.profile?.work_field || null,
        },
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              senderId: lastMsg.senderId,
              createdAt: lastMsg.createdAt,
            }
          : null,
        updatedAt: lastMsg?.createdAt || conv.createdAt,
      });
    }

    // Sort by latest activity desc
    conversationsList.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    await redis.set(cacheKey, JSON.stringify(conversationsList), "PX", 1000 * 60 * 5);

    return conversationsList;
  }

  /**
   * Get all messages for a conversation if the user is a valid participant and relationship is active
   */
  async getConversationMessages(conversationId: string, userId: string) {
    const cacheKey = ChatRepository.CACHE_KEYS.messages(conversationId);

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        mentorship: true,
        collaboration: true,
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                role: true,
                profile: {
                  select: {
                    fullName: true,
                    profilePicture: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conversation) return null;

    // Verify user is authorized and relationship is ACTIVE
    let isAuthorized = false;
    if (conversation.mentorship && conversation.mentorship.status === "ACTIVE") {
      if (
        conversation.mentorship.fromStudentId === userId ||
        conversation.mentorship.toAlumniId === userId
      ) {
        isAuthorized = true;
      }
    } else if (conversation.collaboration && conversation.collaboration.status === "ACTIVE") {
      if (
        conversation.collaboration.fromAlumniId === userId ||
        conversation.collaboration.toStudentId === userId
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) return null;

    const formattedMessages = conversation.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      createdAt: m.createdAt,
      sender: {
        id: m.sender.id,
        fullName: m.sender.profile?.fullName || "User",
        profilePicture: m.sender.profile?.profilePicture || null,
        role: m.sender.role,
      },
    }));

    await redis.set(cacheKey, JSON.stringify(formattedMessages), "PX", 1000 * 60 * 5);

    return formattedMessages;
  }

  /**
   * Send a message to an active conversation
   */
  async sendMessage(conversationId: string, senderId: string, content: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        mentorship: true,
        collaboration: true,
      },
    });

    if (!conversation) return null;

    let recipientId: string | null = null;

    if (conversation.mentorship && conversation.mentorship.status === "ACTIVE") {
      if (conversation.mentorship.fromStudentId === senderId) {
        recipientId = conversation.mentorship.toAlumniId;
      } else if (conversation.mentorship.toAlumniId === senderId) {
        recipientId = conversation.mentorship.fromStudentId;
      }
    } else if (conversation.collaboration && conversation.collaboration.status === "ACTIVE") {
      if (conversation.collaboration.fromAlumniId === senderId) {
        recipientId = conversation.collaboration.toStudentId;
      } else if (conversation.collaboration.toStudentId === senderId) {
        recipientId = conversation.collaboration.fromAlumniId;
      }
    }

    if (!recipientId) return null;

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            role: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    const formattedMessage = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        fullName: message.sender.profile?.fullName || "User",
        profilePicture: message.sender.profile?.profilePicture || null,
        role: message.sender.role,
      },
    };

    // Invalidate conversation and message caches for both users
    await this.invalidateCache([senderId, recipientId], conversationId);

    return { message: formattedMessage, recipientId };
  }
}
