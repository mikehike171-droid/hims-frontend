"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Clock, 
  Search,
  CheckCheck
} from "lucide-react"
import { io, Socket } from "socket.io-client"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: number;
  sessionId: number;
  senderType: 'visitor' | 'admin';
  content: string;
  createdAt: string;
}

interface ChatSession {
  id: number;
  guestId: string | null;
  visitorName: string | null;
  visitorEmail?: string | null;
  status: string;
  isRead: boolean;
  updatedAt: string;
  messages: Message[];
}

// Safe helpers
function getDisplayName(session: ChatSession): string {
  return session.visitorName || session.guestId || 'Guest Visitor';
}

function getInitials(session: ChatSession): string {
  const name = session.visitorName || session.guestId || 'GU';
  return name.substring(0, 2).toUpperCase();
}

function getUnreadCount(session: ChatSession): number {
  if (session.isRead) return 0;
  const messages = session.messages || [];
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderType === 'visitor') {
      count++;
    } else {
      break;
    }
  }
  return count;
}

export default function AdminChatPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedSessionRef = useRef<ChatSession | null>(null);

  useEffect(() => {
    selectedSessionRef.current = selectedSession;
  }, [selectedSession]);

  const markAsReadApi = async (sessionId: number) => {
    try {
      const token = authService.getCurrentToken();
      await fetch(`${authService.getSettingsApiUrl()}/chat/sessions/${sessionId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      window.dispatchEvent(new CustomEvent('chatMarkedAsRead', { detail: { sessionId } }));
    } catch (error) {
      console.error("Error marking session as read:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Fetch initial active sessions
    const fetchSessions = async () => {
      try {
        const token = authService.getCurrentToken();
        const response = await fetch(`${authService.getSettingsApiUrl()}/chat/sessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSessions(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    };

    fetchSessions();

    const conn = authService.getSocketConnection();
    const socket = io(conn.url, conn.options);
    socketRef.current = socket;
    socket.emit("admin_join");

    socket.on("visitor_message", (data: any) => {
      const isCurrentActive = selectedSessionRef.current?.id === data.sessionId;

      setSessions(prev => {
        const index = prev.findIndex(s => s.id === data.sessionId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            messages: [...(updated[index].messages || []), data],
            updatedAt: data.createdAt,
            isRead: isCurrentActive
          };
          return updated;
        } else {
          const newSession: ChatSession = {
            id: data.sessionId,
            guestId: data.guestId || null,
            visitorName: data.visitorName || null,
            status: 'active',
            isRead: isCurrentActive,
            messages: [data],
            updatedAt: data.createdAt
          };
          return [newSession, ...prev];
        }
      });

      if (isCurrentActive) {
        markAsReadApi(data.sessionId);
      }

      toast({
        title: "💬 New Message",
        description: `${data.visitorName || data.guestId || 'Visitor'}: ${(data.content || '').substring(0, 40)}`,
      });
    });

    socket.on("new_message", (message: Message) => {
      setSessions(prev => {
        const index = prev.findIndex(s => s.id === message.sessionId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            messages: [...(updated[index].messages || []), message],
            updatedAt: message.createdAt
          };
          return updated;
        }
        return prev;
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, selectedSession]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !selectedSession || !socketRef.current) return;
    socketRef.current.emit("admin_send_message", {
      guestId: selectedSession.guestId,
      content: inputValue
    });
    setInputValue("");
  };

  const handleSelectSession = async (session: ChatSession) => {
    setSelectedSession(session);
    
    // Mark as read in UI
    setSessions(prev => prev.map(s => s.id === session.id ? { ...s, isRead: true } : s));

    // Mark as read in Backend and dispatch custom event
    markAsReadApi(session.id);
  };

  const filteredSessions = sessions.filter(s =>
    (s.visitorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.guestId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadSessionsCount = sessions.filter(s => !s.isRead).length;
  const activeChat = selectedSession ? sessions.find(s => s.id === selectedSession.id) : null;

  if (!isMounted) return null;

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="flex h-[calc(100vh-100px)] gap-6 p-6">

        {/* Left: Sessions List */}
        <div className="w-1/3 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Live Chats
                </CardTitle>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3">
                  {sessions.length} Active
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search visitors..."
                  className="pl-10 h-10 bg-slate-50 border-none rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-slate-50">
                {filteredSessions.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No active chats found</p>
                    <p className="text-xs mt-1 text-slate-300">Messages from visitors will appear here</p>
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`p-4 cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3 ${
                        selectedSession?.id === session.id 
                          ? 'bg-slate-50 border-r-4 border-primary' 
                          : !session.isRead 
                            ? 'bg-orange-100 hover:bg-orange-200' 
                            : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold text-xs flex-shrink-0 ${
                        !session.isRead ? 'bg-orange-300 text-orange-900' : 'bg-primary/10'
                      }`}>
                        {getInitials(session)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className={`font-bold truncate ${!session.isRead ? 'text-orange-900' : 'text-slate-900'}`}>
                            {getDisplayName(session)}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {(() => {
                              const unreadCount = getUnreadCount(session);
                              return unreadCount > 0 ? (
                                <Badge className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-2 py-0.5 text-[10px] font-bold border-none min-w-5 h-5 flex items-center justify-center animate-pulse">
                                  {unreadCount}
                                </Badge>
                              ) : null;
                            })()}
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                              <Clock className="h-3 w-3" />
                              {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 truncate italic">
                          {session.messages?.[session.messages.length - 1]?.content || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right: Chat Box */}
        <div className="flex-1">
          {activeChat ? (
            <Card className="h-full flex flex-col overflow-hidden shadow-xl border-slate-100">
              {/* Chat Header */}
              <CardHeader className="p-4 bg-primary text-white flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    {getInitials(activeChat)}
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight">{getDisplayName(activeChat)}</h3>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">{activeChat.guestId || 'Unknown ID'}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 border-none text-[10px] uppercase font-bold px-2 py-0.5 animate-pulse">
                  Live
                </Badge>
              </CardHeader>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30"
              >
                {(activeChat.messages || []).length === 0 ? (
                  <div className="text-center text-slate-400 mt-10">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  (activeChat.messages || []).map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                        msg.senderType === 'admin'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className={`flex items-center gap-1.5 mt-1.5 ${
                          msg.senderType === 'admin' ? 'justify-end text-white/50' : 'text-slate-400'
                        }`}>
                          <span className="text-[10px]">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.senderType === 'admin' && <CheckCheck className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 bg-slate-50 border-none rounded-xl h-12 focus-visible:ring-primary/20"
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="h-12 w-12 bg-primary hover:bg-primary/90 flex-shrink-0 rounded-xl"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center bg-slate-50/50 border-dashed border-2 border-slate-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Chat Selected</h3>
                <p className="text-sm text-slate-500 max-w-[250px]">
                  Select a visitor from the list to view and respond to their messages.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PrivateRoute>
  )
}
