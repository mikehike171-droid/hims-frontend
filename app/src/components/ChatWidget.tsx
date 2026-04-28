"use client"

import React, { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Send, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import doctorAvatar from "@/assets/hero-doctor-male.png";

interface Message {
  id: number;
  senderType: 'visitor' | 'admin';
  content: string;
  createdAt: string;
}

const ChatWidget = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [showTelugu, setShowTelugu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [guestId, setGuestId] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize guestId and socket
  useEffect(() => {
    let savedId = localStorage.getItem("chat_guest_id");
    if (!savedId) {
      savedId = "guest_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("chat_guest_id", savedId);
    }
    setGuestId(savedId);

    // Initial greeting if no messages
    const timer = setTimeout(() => {
      setIsOpen(true);
      setIsCardVisible(true);
    }, 2000);

    const teluguTimer = setTimeout(() => {
      setShowTelugu(true);
    }, 5000);

    // Connect to WebSocket
    const socket = io("http://localhost:3002", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join_chat", { guestId: savedId });

    socket.on("chat_history", (history: Message[]) => {
      setMessages(history);
    });

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("admin_reply", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (!isCardVisible) {
        // Notification sound or visual cue could go here
      }
    });

    return () => {
      socket.disconnect();
      clearTimeout(timer);
      clearTimeout(teluguTimer);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isCardVisible]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !socketRef.current) return;

    socketRef.current.emit("visitor_send_message", {
      guestId,
      content: inputValue,
      visitorName: "Guest Visitor",
    });

    setInputValue("");
  };

  const handleClose = () => {
    setIsCardVisible(false);
  };

  const toggleWidget = () => {
    setIsCardVisible(!isCardVisible);
  };

  const isAdminPage = pathname?.startsWith('/admin');

  if (!isOpen || isAdminPage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-4 pointer-events-none">
      {/* Message Card */}
      {isCardVisible && (
        <div className="w-[320px] md:w-[380px] h-[500px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col pointer-events-auto animate-in fade-in slide-in-from-bottom-10 duration-500 overflow-hidden relative">
          
          {/* Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                  <img 
                    src={doctorAvatar.src} 
                    alt="Dr Ashraf" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-primary rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Dr Ashraf</h4>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
          >
            {/* Automatic Initial Greet if empty */}
            {messages.length === 0 && (
              <div className="space-y-4">
                {/* English Greeting */}
                <div className="flex gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Welcome to UniCare Homeopathy. How can I help you today?
                    </p>
                  </div>
                </div>

                {/* Telugu Greeting */}
                {showTelugu && (
                  <div className="flex gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        మా డాక్టర్ గారితో ఇప్పుడే మాట్లాడండి. తక్షణమే మీ ఆరోగ్య సమస్యకి పరిష్కారం పొందండి.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, idx) => (
              <div 
                key={msg.id || idx} 
                className={cn("flex gap-2 max-w-[85%]", msg.senderType === 'visitor' ? "ml-auto flex-row-reverse" : "")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold",
                  msg.senderType === 'visitor' ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                )}>
                  {msg.senderType === 'visitor' ? "ME" : "DR"}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl shadow-sm border",
                  msg.senderType === 'visitor' 
                    ? "bg-primary text-white rounded-tr-none border-primary" 
                    : "bg-white text-slate-700 rounded-tl-none border-slate-100"
                )}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className={cn(
                    "text-[9px] block mt-1",
                    msg.senderType === 'visitor' ? "text-white/60" : "text-slate-400"
                  )}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        </div>
      )}

      {/* Pulsing Bubble Icon */}
      <button
        onClick={toggleWidget}
        className="pointer-events-auto relative group"
      >
        <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/30 transition-all animate-pulse" />
        <div className="relative w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white/20">
          {isCardVisible ? (
            <img 
              src={doctorAvatar.src} 
              alt="Toggle Chat" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          ) : (
            <MessageCircle className="w-8 h-8" />
          )}
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
        </div>
      </button>
    </div>
  );
};

// Helper for conditional classes if not globally available
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default ChatWidget;
