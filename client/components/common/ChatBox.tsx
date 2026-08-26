"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useSocketContext } from "@/context/SocketContext";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { chatService } from "@/services/chat.service";
import { Conversation, ChatMessage } from "@/schema/chat";

export default function ChatBox() {
  const { user } = useAuthContext();
  const { socket } = useSocketContext();

  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ───────── Fetch Conversations ───────── */
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingConversations(true);
      const res = await chatService.getConversations();
      if (res?.data?.conversations) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  /* ───────── Fetch Messages for Active Conversation ───────── */
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const res = await chatService.getMessages(conversationId);
      if (res?.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  /* ───────── Load conversations on mount & when opened ───────── */
  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, fetchConversations]);

  /* ───────── Load messages when active conversation changes ───────── */
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation, fetchMessages]);

  /* ───────── Auto-scroll to bottom of message feed ───────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMessages]);

  /* ───────── Socket.IO Real-time Messages Listener ───────── */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversationId: string; message: ChatMessage }) => {
      // If the message is for the currently open conversation, append it
      if (activeConversation && activeConversation.id === data.conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }

      // Update the last message in the conversations list and re-sort
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === data.conversationId);
        if (index === -1) {
          // If conversation is new, refetch all
          fetchConversations();
          return prev;
        }

        const updated = [...prev];
        const target = { ...updated[index] };
        target.lastMessage = {
          id: data.message.id,
          content: data.message.content,
          senderId: data.message.senderId,
          createdAt: data.message.createdAt,
        };
        target.updatedAt = data.message.createdAt;

        updated.splice(index, 1);
        return [target, ...updated];
      });
    };

    socket.on("chat:new_message", handleNewMessage);

    return () => {
      socket.off("chat:new_message", handleNewMessage);
    };
  }, [socket, activeConversation, fetchConversations]);

  /* ───────── Close on outside click ───────── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const trigger = document.getElementById("chatbox-trigger");
        if (trigger && trigger.contains(e.target as Node)) return;
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  /* ───────── Close on Escape ───────── */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (activeConversation) {
          setActiveConversation(null);
        } else {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [activeConversation]);

  /* ───────── Send Message Handler ───────── */
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConversation || !messageInput.trim() || sending) return;

    const content = messageInput.trim();
    setMessageInput("");
    setSending(true);

    try {
      const res = await chatService.sendMessage({
        conversationId: activeConversation.id,
        content,
      });

      if (res?.data?.message) {
        const newMsg = res.data.message;
        setMessages((prev) => [...prev, newMsg]);

        // Update conversation in list
        setConversations((prev) => {
          const index = prev.findIndex((c) => c.id === activeConversation.id);
          if (index === -1) return prev;
          const updated = [...prev];
          const target = { ...updated[index] };
          target.lastMessage = {
            id: newMsg.id,
            content: newMsg.content,
            senderId: newMsg.senderId,
            createdAt: newMsg.createdAt,
          };
          target.updatedAt = newMsg.createdAt;
          updated.splice(index, 1);
          return [target, ...updated];
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // restore unsent message text on failure
      setMessageInput(content);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const filteredChats = conversations.filter((c) =>
    c.otherUser.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const displayName = user?.profile?.fullName ?? user?.email ?? "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <button
        id="chatbox-trigger"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open chat"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9998,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)";
        }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          bottom: 88,
          right: 24,
          zIndex: 9999,
          width: 360,
          height: 520,
          maxHeight: "calc(100vh - 120px)",
          borderRadius: 16,
          background: "var(--card)",
          color: "var(--card-foreground)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.16), 0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {activeConversation ? (
          /* ══════════════════════════════════════════════
             ACTIVE CHAT THREAD VIEW
             ══════════════════════════════════════════════ */
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header with Back button */}
            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: "1px solid var(--border)",
                background: "var(--card)",
              }}
            >
              <button
                onClick={() => setActiveConversation(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 6px",
                  borderRadius: 6,
                }}
                aria-label="Back to chat list"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {activeConversation.otherUser.profilePicture ? (
                  <Image
                    src={activeConversation.otherUser.profilePicture}
                    alt={activeConversation.otherUser.fullName}
                    width={36}
                    height={36}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  activeConversation.otherUser.fullName.charAt(0).toUpperCase()
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--foreground)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {activeConversation.otherUser.fullName}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                  {activeConversation.type === "MENTORSHIP" ? "Mentorship" : "Collaboration"}
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "var(--muted)",
              }}
            >
              {loadingMessages ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 13, marginTop: 40 }}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 13, marginTop: 40 }}>
                  No messages yet. Say hello! 👋
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMine ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "80%",
                          padding: "8px 12px",
                          borderRadius: isMine ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                          background: isMine ? "var(--primary)" : "var(--card)",
                          color: isMine ? "var(--primary-foreground)" : "var(--card-foreground)",
                          fontSize: 13,
                          lineHeight: 1.4,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                          border: isMine ? "none" : "1px solid var(--border)",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.content}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--muted-foreground)",
                          marginTop: 3,
                          padding: "0 4px",
                        }}
                      >
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderTop: "1px solid var(--border)",
                background: "var(--card)",
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={sending}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 20,
                  border: "1px solid var(--border)",
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={!messageInput.trim() || sending}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: messageInput.trim() && !sending ? "var(--primary)" : "var(--muted)",
                  color: messageInput.trim() && !sending ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  border: "none",
                  cursor: messageInput.trim() && !sending ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s ease",
                }}
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          /* ══════════════════════════════════════════════
             CONVERSATIONS LIST VIEW (FIGMA DESIGN)
             ══════════════════════════════════════════════ */
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* ─── Header ─── */}
            <div
              style={{
                padding: "20px 20px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                borderBottom: "1px solid var(--border)",
                background: "var(--card)",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2.5px solid var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  fontWeight: 700,
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {user?.profile?.profilePicture ? (
                  <Image
                    src={user.profile.profilePicture}
                    alt="Profile"
                    width={60}
                    height={60}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  initials
                )}
              </div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{displayName}</span>
            </div>

            {/* ─── Search ─── */}
            <div style={{ padding: "12px 16px 8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--muted)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* ─── Last Chats Header ─── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 20px 4px",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 13, color: "var(--foreground)" }}>
                Last chats
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => fetchConversations()}
                  title="Refresh chats"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    color: "var(--muted-foreground)",
                  }}
                  aria-label="Refresh chats"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ─── Chat List ─── */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "4px 8px 12px",
              }}
            >
              {loadingConversations ? (
                <p style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 13, padding: "32px 0" }}>
                  Loading chats...
                </p>
              ) : filteredChats.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 13, padding: "32px 16px" }}>
                  <p style={{ fontWeight: 500, marginBottom: 4 }}>No active chats</p>
                  <p style={{ fontSize: 11 }}>
                    Chat is available once a mentorship or collaboration is accepted!
                  </p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveConversation(chat)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Chat avatar */}
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      {chat.otherUser.profilePicture ? (
                        <Image
                          src={chat.otherUser.profilePicture}
                          alt={chat.otherUser.fullName}
                          width={42}
                          height={42}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                        />
                      ) : (
                        chat.otherUser.fullName.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Chat info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--foreground)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chat.otherUser.fullName}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--muted-foreground)",
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ""}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--muted-foreground)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {chat.lastMessage?.content || `Active ${chat.type.toLowerCase()}`}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 6,
                            background: "var(--muted)",
                            color: "var(--muted-foreground)",
                            fontWeight: 500,
                          }}
                        >
                          {chat.type === "MENTORSHIP" ? "Mentor" : "Collab"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
