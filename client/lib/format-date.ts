/**
 * Smart date formatting for the chat feature.
 */

/** Thread timestamps: "10:32 AM" / "Yesterday, 10:32 AM" / "Mon, 10:32 AM" / "Sep 28, 10:32 AM" */
export function formatChatTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (isToday) return time;
    if (isYesterday) return `Yesterday, ${time}`;
    if (diffDays < 7) {
      const dayName = d.toLocaleDateString([], { weekday: "long" });
      return `${dayName}, ${time}`;
    }
    const formatted = d.toLocaleDateString([], { month: "short", day: "numeric" });
    return `${formatted}, ${time}`;
  } catch {
    return "";
  }
}

/** Sidebar timestamps: "10:32 AM" / "Yesterday" / "Mon" / "Sep 28" */
export function formatSidebarTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const isSameYear = d.getFullYear() === now.getFullYear();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (isToday) return time;
    if (isYesterday) return "Yesterday";
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    if (isSameYear) return d.toLocaleDateString([], { month: "short", day: "numeric" });
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

/** Date separator labels: "Today" / "Yesterday" / "September 28, 2026" */
export function getDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return d.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

/** Check if two date strings fall on the same calendar day. */
export function isSameDay(a: string, b: string): boolean {
  try {
    return new Date(a).toDateString() === new Date(b).toDateString();
  } catch {
    return false;
  }
}
