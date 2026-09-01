"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useSocketContext } from "@/context/SocketContext";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { chatService } from "@/services/chat.service";
import { Conversation, ChatMessage } from "@/schema/chat";
import { formatChatTime, formatSidebarTime, getDateLabel } from "@/lib/format-date";

/* ───────── Main Component ───────── */

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

  /* ───────── Fetch Messages ───────── */
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

  /* ───────── Load conversations on open ───────── */
  useEffect(() => {
    if (isOpen) fetchConversations();
  }, [isOpen, fetchConversations]);

  /* ───────── Load messages on active conversation ───────── */
  useEffect(() => {
    if (activeConversation) fetchMessages(activeConversation.id);
    else setMessages([]);
  }, [activeConversation, fetchMessages]);

  /* ───────── Auto-scroll ───────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMessages]);

  /* ───────── Socket.IO listener ───────── */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversationId: string; message: ChatMessage }) => {
      if (activeConversation && activeConversation.id === data.conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }

      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === data.conversationId);
        if (index === -1) {
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
    return () => { socket.off("chat:new_message", handleNewMessage); };
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
        if (activeConversation) setActiveConversation(null);
        else setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [activeConversation]);

  /* ───────── Send Message ───────── */
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
      setMessageInput(content);
    } finally {
      setSending(false);
    }
  };

  /* ───────── Derived state ───────── */
  const filteredChats = conversations.filter((c) =>
    c.otherUser.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const displayName = user?.profile?.fullName ?? user?.email ?? "User";
  const initials = displayName.charAt(0).toUpperCase();

  /* Group messages by date for separators */
  const messagesWithDates = useMemo(() => {
    type DateSep = { type: "date"; label: string; key: string };
    type MsgItem = { type: "message"; msg: ChatMessage; key: string };
    type Item = DateSep | MsgItem;
    const result: Item[] = [];
    let lastDate = "";
    for (const msg of messages) {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (dateKey !== lastDate) {
        result.push({ type: "date", label: getDateLabel(msg.createdAt), key: `date-${dateKey}` });
        lastDate = dateKey;
      }
      result.push({ type: "message", msg, key: msg.id });
    }
    return result;
  }, [messages]);

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <button
        id="chatbox-trigger"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-[9998] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
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
        className={`fixed bottom-[88px] right-6 z-[9999] flex h-[520px] w-[360px] max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-250 ${
          isOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-3 scale-95 pointer-events-none"
        }`}
      >
        {activeConversation ? (
          /* ════════════════════════════════════
             MESSAGE THREAD VIEW
             ════════════════════════════════════ */
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
              <button
                onClick={() => setActiveConversation(null)}
                className="flex items-center justify-center rounded-md p-1 text-primary transition-colors hover:bg-muted"
                aria-label="Back to chat list"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {activeConversation.otherUser.profilePicture ? (
                  <Image
                    src={activeConversation.otherUser.profilePicture}
                    alt={activeConversation.otherUser.fullName}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  activeConversation.otherUser.fullName.charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {activeConversation.otherUser.fullName}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {activeConversation.type === "MENTORSHIP" ? "Mentorship" : "Collaboration"}
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto bg-muted/50 px-3 py-4">
              {loadingMessages ? (
                <div className="mt-16 text-center text-sm text-muted-foreground">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="mt-16 text-center text-sm text-muted-foreground">No messages yet. Say hello! 👋</div>
              ) : (
                <div className="flex flex-col gap-1">
                  {messagesWithDates.map((item) => {
                    if (item.type === "date") {
                      return (
                        <div key={item.key} className="my-3 flex items-center gap-3">
                          <div className="h-px flex-1 bg-border" />
                          <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground">
                            {item.label}
                          </span>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                      );
                    }

                    const msg = item.msg;
                    const isMine = msg.senderId === user?.id;

                    return (
                      <div key={item.key} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                        {/* Sender name for other users */}
                        {!isMine && (
                          <span className="mb-0.5 px-1 text-[11px] font-medium text-muted-foreground">
                            {activeConversation.otherUser.fullName}
                          </span>
                        )}
                        <div
                          className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                            isMine
                              ? "rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-bl-sm border border-border bg-card text-card-foreground shadow-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="mt-1 px-1 text-[10px] text-muted-foreground">
                          {formatChatTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={sending}
                className="flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={!messageInput.trim() || sending}
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  messageInput.trim() && !sending
                    ? "bg-primary text-primary-foreground cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-default"
                }`}
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
          /* ════════════════════════════════════
             CONVERSATIONS LIST VIEW
             ════════════════════════════════════ */
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex flex-col items-center gap-2.5 border-b border-border bg-card px-5 pb-4 pt-5">
              <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full border-[2.5px] border-primary bg-primary text-primary-foreground text-2xl font-bold">
                {user?.profile?.profilePicture ? (
                  <Image
                    src={user.profile.profilePicture}
                    alt="Profile"
                    width={60}
                    height={60}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <span className="text-[15px] font-semibold">{displayName}</span>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Last Chats Header */}
            <div className="flex items-center justify-between px-5 py-2">
              <span className="text-[13px] font-semibold text-foreground">Last chats</span>
              <button
                onClick={() => fetchConversations()}
                title="Refresh chats"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Refresh chats"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-2 pb-3">
              {loadingConversations ? (
                <p className="py-8 text-center text-[13px] text-muted-foreground">Loading chats...</p>
              ) : filteredChats.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <p className="text-[13px] font-medium">No active chats</p>
                  <p className="mt-1 text-[11px]">Chat is available once a mentorship or collaboration is accepted!</p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveConversation(chat)}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted"
                  >
                    {/* Avatar */}
                    <div className="relative h-[42px] w-[42px] flex-shrink-0 overflow-hidden rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[15px] font-bold">
                      {chat.otherUser.profilePicture ? (
                        <Image
                          src={chat.otherUser.profilePicture}
                          alt={chat.otherUser.fullName}
                          width={42}
                          height={42}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        chat.otherUser.fullName.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Chat info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-[13px] font-semibold text-foreground">
                          {chat.otherUser.fullName}
                        </span>
                        <span className="ml-2 flex-shrink-0 text-[11px] text-muted-foreground">
                          {chat.lastMessage ? formatSidebarTime(chat.lastMessage.createdAt) : ""}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                          {chat.lastMessage?.content || `Active ${chat.type.toLowerCase()}`}
                        </span>
                        <span className="flex-shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
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
