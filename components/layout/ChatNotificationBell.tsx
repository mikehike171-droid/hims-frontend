"use client"

import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { io, Socket } from "socket.io-client"
import authService from "@/lib/authService"

export function ChatNotificationBell() {
  const [unreadSessionIds, setUnreadSessionIds] = useState<number[]>([])
  const [animate, setAnimate] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch initial unread sessions
    const fetchUnreadSessions = async () => {
      try {
        const token = authService.getCurrentToken();
        if (!token) return;
        const response = await fetch(`${authService.getSettingsApiUrl()}/chat/sessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const unreadIds = data.filter((s: any) => !s.isRead).map((s: any) => s.id);
            setUnreadSessionIds(unreadIds);
          }
        }
      } catch (e) {
        console.error("Error fetching unread sessions in bell:", e);
      }
    };
    fetchUnreadSessions();

    // Connect to the same WebSocket as the chat system
    const conn = authService.getSocketConnection();
    const socket = io(conn.url, conn.options);
    socketRef.current = socket

    // Join as admin observer to receive visitor messages
    socket.emit("admin_join")

    // Listen for new messages from visitors
    socket.on("visitor_message", (data: any) => {
      if (data && data.sessionId) {
        setUnreadSessionIds((prev) => {
          if (!prev.includes(data.sessionId)) {
            const updated = [...prev, data.sessionId];
            // Trigger bell shake animation
            setAnimate(true)
            setTimeout(() => setAnimate(false), 600)
            return updated;
          }
          return prev;
        });
      }
    })

    // Listen for custom event when chat is marked as read
    const handleChatRead = (event: any) => {
      const { sessionId } = event.detail;
      if (sessionId) {
        setUnreadSessionIds((prev) => prev.filter((id) => id !== sessionId));
      }
    };
    window.addEventListener("chatMarkedAsRead", handleChatRead);

    return () => {
      socket.disconnect()
      window.removeEventListener("chatMarkedAsRead", handleChatRead);
    }
  }, [])

  const handleClick = () => {
    router.push("/admin/website/chat")
  }

  const unreadCount = unreadSessionIds.length;

  return (
    <button
      onClick={handleClick}
      title="Live Chat Notifications"
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      {/* Bell icon with shake animation when new message arrives */}
      <Bell
        className={`h-5 w-5 text-gray-600 transition-transform ${animate ? "animate-bounce" : ""
          }`}
      />

      {/* Unread count badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md animate-in zoom-in duration-200">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  )
}
