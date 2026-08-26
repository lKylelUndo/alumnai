"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ───────── dummy data for UI preview ───────── */
const DUMMY_CHATS = [
  {
    id: "1",
    name: "Kyle Ando",
    avatar: null,
    lastMessage: "typing...",
    time: "12:27",
    isTyping: true,
    unread: 2,
  },
  {
    id: "2",
    name: "Jameboy Escartin",
    avatar: null,
    lastMessage: "5-kamatis 10-bombay 3 s...",
    time: "12:26",
    unread: 0,
  },
  {
    id: "3",
    name: "Smith Degamo",
    avatar: null,
    lastMessage: "Hi pwede mag hello?",
    time: "10:17",
    unread: 0,
  },
];

export default function ChatBox() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  /* close on outside click */
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

  /* close on Escape */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const filteredChats = DUMMY_CHATS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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
          /* close icon */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* chat icon */
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
              aria-label="New chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button
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
              aria-label="More"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
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
          {filteredChats.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--muted-foreground)",
                fontSize: 13,
                padding: "32px 0",
              }}
            >
              No conversations found
            </p>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
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
                  }}
                >
                  {chat.avatar ? (
                    <Image
                      src={chat.avatar}
                      alt={chat.name}
                      width={42}
                      height={42}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    />
                  ) : (
                    chat.name.charAt(0)
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
                      {chat.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: chat.isTyping ? "var(--primary)" : "var(--muted-foreground)",
                        fontStyle: chat.isTyping ? "italic" : "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {chat.lastMessage}
                    </span>
                    {chat.unread && chat.unread > 0 ? (
                      <span
                        style={{
                          minWidth: 18,
                          height: 18,
                          borderRadius: 9,
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                          fontSize: 10,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 5px",
                          flexShrink: 0,
                        }}
                      >
                        {chat.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
