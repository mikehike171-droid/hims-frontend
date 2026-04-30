"use client"

import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { io, Socket } from "socket.io-client"

export function ChatNotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [animate, setAnimate] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Connect to the same WebSocket as the chat system
    const socket = io("http://localhost:3002", {
      transports: ["websocket"],
    })
    socketRef.current = socket

    // Join as admin observer to receive visitor messages
    socket.emit("admin_join")

    // Listen for new messages from visitors
    socket.on("visitor_message", () => {
      setUnreadCount((prev) => prev + 1)
      // Trigger bell shake animation
      setAnimate(true)
      setTimeout(() => setAnimate(false), 600)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleClick = () => {
    setUnreadCount(0)
    router.push("/admin/website/chat")
  }

  return (
    <button
      onClick={handleClick}
      title="Live Chat Notifications"
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      {/* Bell icon with shake animation when new message arrives */}
      <Bell
        className={`h-5 w-5 text-gray-600 transition-transform ${
          animate ? "animate-bounce" : ""
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
