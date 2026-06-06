"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageCircle, Send, User, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import authService from "@/lib/authService";
import doctorAvatar from "@/assets/hero-doctor-male.png";

interface Message {
  id: number;
  senderType: 'visitor' | 'admin';
  content: string;
  createdAt: string;
}

// Base API URL - always goes through Next.js proxy (works on Vercel)
const API_BASE = '/api/settings-service/chat';

const ChatWidget = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [showTelugu, setShowTelugu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [guestId, setGuestId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error'>('connected');
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const guestIdRef = useRef<string>("");

  // Poll messages from server every 4 seconds
  const pollMessages = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/messages/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
          setConnectionStatus('connected');
        }
      }
    } catch (e) {
      // Silently fail - don't disrupt UX on polling errors
    }
  }, []);

  // Initialize guestId and start polling
  useEffect(() => {
    let savedId = localStorage.getItem("chat_guest_id");
    if (!savedId) {
      savedId = "guest_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("chat_guest_id", savedId);
    }
    setGuestId(savedId);
    guestIdRef.current = savedId;

    // Show chat widget after 2s
    const timer = setTimeout(() => {
      setIsOpen(true);
      setIsCardVisible(true);
    }, 2000);

    // Show Telugu greeting after 5s
    const teluguTimer = setTimeout(() => {
      setShowTelugu(true);
    }, 5000);

    // Load existing history immediately
    pollMessages(savedId);

    // Start polling every 4 seconds for new messages/admin replies
    pollingRef.current = setInterval(() => {
      pollMessages(guestIdRef.current);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(teluguTimer);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [pollMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isCardVisible]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const content = inputValue.trim();
    if (!content || isSending) return;

    const currentGuestId = guestIdRef.current;
    if (!currentGuestId) return;

    // Optimistic update - show message immediately
    const optimisticMsg: Message = {
      id: Date.now(),
      senderType: 'visitor',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_BASE}/visitor-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: currentGuestId,
          content,
          visitorName: 'Guest Visitor',
        }),
      });

      if (res.ok) {
        // Replace optimistic message with server response
        const serverMsg: Message = await res.json();
        setMessages(prev =>
          prev.map(m => m.id === optimisticMsg.id ? serverMsg : m)
        );
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (err) {
      setConnectionStatus('error');
      // Keep optimistic message visible even on error
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => setIsCardVisible(false);
  const toggleWidget = () => setIsCardVisible(!isCardVisible);

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
                    alt="Unicare Health Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-primary rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-yellow-400'}`} />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Unicare Health Assistant</h4>
                <p className="text-[10px] text-white/60">
                  {connectionStatus === 'connected' ? 'Online' : 'Reconnecting...'}
                </p>
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
            {/* Initial greeting when no messages from server */}
            {messages.length === 0 && (
              <div className="space-y-4">
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

            {/* Message list */}
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
              disabled={isSending}
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              }
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default ChatWidget;
