'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  MoreVertical,
  Image,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Truck,
  Store,
  User,
  ArrowLeft,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime } from '@/lib/utils';

interface Conversation {
  id: string;
  name: string;
  role: 'driver' | 'vendor' | 'support';
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isOnline: boolean;
  orderId?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isMe: boolean;
}

const conversations: Conversation[] = [
  { id: 'c1', name: 'Marcus Johnson', role: 'driver', lastMessage: 'On my way to the pickup location now.', lastMessageTime: '2026-04-01T14:20:00Z', unread: 2, isOnline: true, orderId: 'DRM-LK82F-X9A3' },
  { id: 'c2', name: 'Pro Tool Supply', role: 'vendor', lastMessage: 'Your order is ready for pickup. Driver has been notified.', lastMessageTime: '2026-04-01T14:05:00Z', unread: 0, isOnline: true },
  { id: 'c3', name: 'Dreams Support', role: 'support', lastMessage: 'Let me know if there is anything else I can help with!', lastMessageTime: '2026-03-31T16:30:00Z', unread: 0, isOnline: true },
  { id: 'c4', name: 'Sarah Chen', role: 'driver', lastMessage: 'Delivered! Thanks for the tip.', lastMessageTime: '2026-03-30T11:15:00Z', unread: 0, isOnline: false },
  { id: 'c5', name: 'ElectroParts Direct', role: 'vendor', lastMessage: 'We have restocked the Fluke 117. Ready to ship.', lastMessageTime: '2026-03-29T09:00:00Z', unread: 1, isOnline: false },
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', senderId: 'me', text: 'Hi Marcus, how far are you from Pro Tool Supply?', timestamp: '2026-04-01T14:10:00Z', status: 'read', isMe: true },
    { id: 'm2', senderId: 'driver', text: 'Hey! About 5 minutes away. Traffic is light.', timestamp: '2026-04-01T14:12:00Z', status: 'read', isMe: false },
    { id: 'm3', senderId: 'me', text: 'Great. The delivery is at Westfield Tower, Floor 12. Ask for the site foreman at the entrance.', timestamp: '2026-04-01T14:14:00Z', status: 'read', isMe: true },
    { id: 'm4', senderId: 'driver', text: 'Got it. I will call when I am downstairs.', timestamp: '2026-04-01T14:15:00Z', status: 'read', isMe: false },
    { id: 'm5', senderId: 'driver', text: 'Picked up the order from Pro Tool Supply. Everything looks good.', timestamp: '2026-04-01T14:18:00Z', status: 'delivered', isMe: false },
    { id: 'm6', senderId: 'driver', text: 'On my way to the pickup location now.', timestamp: '2026-04-01T14:20:00Z', status: 'delivered', isMe: false },
  ],
};

const roleIcons: Record<string, React.ReactNode> = {
  driver: <Truck className="h-3 w-3" />,
  vendor: <Store className="h-3 w-3" />,
  support: <MessageSquare className="h-3 w-3" />,
};

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages.c1 || []);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
      isMe: true,
    };
    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: `m_${Date.now() + 1}`,
        senderId: 'other',
        text: 'Got it, thanks for the update!',
        timestamp: new Date().toISOString(),
        status: 'delivered',
        isMe: false,
      };
      setMessages((prev) => [...prev, reply]);
    }, 3000);
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className={cn('w-80 border-r border-gray-200 flex flex-col', activeConversation && 'hidden md:flex')}>
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
              <Input placeholder="Search conversations..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex-1 overflow-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversation(conv);
                    setMessages(mockMessages[conv.id] || []);
                  }}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50',
                    activeConversation?.id === conv.id && 'bg-orange-50 border-l-2 border-l-orange-500'
                  )}
                >
                  <Avatar name={conv.name} size="md" status={conv.isOnline ? 'online' : 'offline'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">{conv.name}</span>
                        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium',
                          conv.role === 'driver' ? 'bg-orange-100 text-orange-700' :
                          conv.role === 'vendor' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        )}>
                          {roleIcons[conv.role]} {conv.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">{formatRelativeTime(conv.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{conv.lastMessage}</p>
                    {conv.orderId && <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{conv.orderId}</p>}
                  </div>
                  {conv.unread > 0 && (
                    <span className="h-5 w-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveConversation(null)} className="md:hidden p-1 rounded-lg hover:bg-gray-100">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                  </button>
                  <Avatar name={activeConversation.name} size="sm" status={activeConversation.isOnline ? 'online' : 'offline'} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{activeConversation.name}</p>
                    <p className="text-xs text-gray-500">
                      {activeConversation.isOnline ? 'Online' : 'Last seen recently'}
                      {activeConversation.orderId && ` · Order ${activeConversation.orderId}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.isMe ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2.5',
                      msg.isMe
                        ? 'bg-orange-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    )}>
                      <p className="text-sm">{msg.text}</p>
                      <div className={cn('flex items-center justify-end gap-1 mt-1', msg.isMe ? 'text-orange-200' : 'text-gray-400')}>
                        <span className="text-[10px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.isMe && (
                          msg.status === 'read' ? <CheckCheck className="h-3 w-3" /> :
                          msg.status === 'delivered' ? <CheckCheck className="h-3 w-3 opacity-50" /> :
                          <Check className="h-3 w-3 opacity-50" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Image className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                  />
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className={cn(
                      'h-10 w-10 rounded-xl flex items-center justify-center transition-colors',
                      messageInput.trim() ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Select a conversation</h3>
                <p className="text-sm text-gray-500 mt-1">Choose a conversation to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
