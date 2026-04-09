'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  Send,
  Paperclip,
  ArrowLeft,
  User,
  Bot,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatRelativeTime, formatDateTime } from '@/lib/utils';

interface Ticket {
  id: string;
  number: string;
  subject: string;
  category: 'order_issue' | 'payment' | 'delivery' | 'rental' | 'account' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'awaiting_customer' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: { id: string; from: 'customer' | 'agent' | 'system'; author: string; text: string; timestamp: string }[];
}

const tickets: Ticket[] = [
  {
    id: 't_1',
    number: 'TKT-00142',
    subject: 'Order DRM-LK82F arrived with damaged drill',
    category: 'order_issue',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-04-01T09:30:00Z',
    updatedAt: '2026-04-01T14:00:00Z',
    assignedTo: 'Maria Santos',
    messages: [
      { id: 'm1', from: 'customer', author: 'You', text: 'My DeWalt hammer drill arrived with a cracked housing. I cannot use it on the job site. Need a replacement ASAP.', timestamp: '2026-04-01T09:30:00Z' },
      { id: 'm2', from: 'system', author: 'System', text: 'Ticket assigned to Maria Santos', timestamp: '2026-04-01T09:32:00Z' },
      { id: 'm3', from: 'agent', author: 'Maria Santos', text: 'Hi Alex, I am very sorry about that. I am pulling up your order now and will arrange a replacement immediately. Can you confirm the delivery address is still 742 Evergreen Terrace?', timestamp: '2026-04-01T09:45:00Z' },
      { id: 'm4', from: 'customer', author: 'You', text: 'Yes, same address. Thank you for the quick response.', timestamp: '2026-04-01T10:00:00Z' },
      { id: 'm5', from: 'agent', author: 'Maria Santos', text: 'Replacement is being dispatched now from Pro Tool Supply. ETA 45 minutes. We will refund the original order automatically. The damaged unit will be picked up at the same time.', timestamp: '2026-04-01T14:00:00Z' },
    ],
  },
  {
    id: 't_2',
    number: 'TKT-00141',
    subject: 'Payment was charged twice for order DRM-MN47K',
    category: 'payment',
    priority: 'urgent',
    status: 'open',
    createdAt: '2026-03-31T16:00:00Z',
    updatedAt: '2026-03-31T16:00:00Z',
    messages: [
      { id: 'm1', from: 'customer', author: 'You', text: 'I see two charges on my card for the same order. Please refund the duplicate.', timestamp: '2026-03-31T16:00:00Z' },
    ],
  },
  {
    id: 't_3',
    number: 'TKT-00140',
    subject: 'How do I add a team member?',
    category: 'account',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-03-30T11:00:00Z',
    updatedAt: '2026-03-30T11:30:00Z',
    assignedTo: 'Bot Assistant',
    messages: [
      { id: 'm1', from: 'customer', author: 'You', text: 'How do I add a new technician to my team account?', timestamp: '2026-03-30T11:00:00Z' },
      { id: 'm2', from: 'agent', author: 'Bot Assistant', text: 'You can invite team members from Settings > Team. Click "Invite Member", enter their email, choose a role, and they will receive an invitation.', timestamp: '2026-03-30T11:05:00Z' },
      { id: 'm3', from: 'customer', author: 'You', text: 'Got it, thanks!', timestamp: '2026-03-30T11:30:00Z' },
    ],
  },
];

const categoryLabels: Record<string, string> = {
  order_issue: 'Order Issue',
  payment: 'Payment',
  delivery: 'Delivery',
  rental: 'Rental',
  account: 'Account',
  technical: 'Technical',
  other: 'Other',
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700 border border-red-300',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-blue-100 text-blue-700',
};

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-100 text-orange-700',
  awaiting_customer: 'bg-purple-100 text-purple-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-700',
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [reply, setReply] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'open' && ['open', 'in_progress', 'awaiting_customer'].includes(t.status)) ||
      (activeTab === 'resolved' && ['resolved', 'closed'].includes(t.status));
    const matchesSearch = !searchQuery || t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Get help with orders, payments, accounts, and more.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          <p className="text-xs text-gray-500">Total Tickets</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-blue-600">{tickets.filter((t) => t.status === 'open').length}</p>
          <p className="text-xs text-gray-500">Open</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-orange-600">{tickets.filter((t) => t.status === 'in_progress').length}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{tickets.filter((t) => t.status === 'resolved').length}</p>
          <p className="text-xs text-gray-500">Resolved</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Tabs
          variant="pills"
          tabs={[
            { id: 'all', label: 'All', count: tickets.length },
            { id: 'open', label: 'Active', count: tickets.filter((t) => ['open', 'in_progress', 'awaiting_customer'].includes(t.status)).length },
            { id: 'resolved', label: 'Resolved', count: tickets.filter((t) => ['resolved', 'closed'].includes(t.status)).length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className="sm:ml-auto w-full sm:w-64">
          <Input placeholder="Search tickets..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-12 w-12" />}
          title="No tickets found"
          description="Create a new ticket if you need help with anything."
          action={{ label: 'Create Ticket', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} hover onClick={() => setSelectedTicket(ticket)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-mono font-semibold text-gray-900">{ticket.number}</span>
                    <Badge className={statusColors[ticket.status]} variant="custom" size="sm">
                      {ticket.status.replace(/_/g, ' ')}
                    </Badge>
                    <Badge className={priorityColors[ticket.priority]} variant="custom" size="sm">
                      {ticket.priority}
                    </Badge>
                    <Badge variant="default" size="sm">
                      <Tag className="h-3 w-3 mr-0.5" /> {categoryLabels[ticket.category]}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{ticket.subject}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ticket.messages[ticket.messages.length - 1]?.text}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {ticket.messages.length} messages</span>
                    {ticket.assignedTo && <span className="flex items-center gap-1"><User className="h-3 w-3" /> {ticket.assignedTo}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatRelativeTime(ticket.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={selectedTicket.number} size="lg">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={statusColors[selectedTicket.status]} variant="custom" size="sm">
                  {selectedTicket.status.replace(/_/g, ' ')}
                </Badge>
                <Badge className={priorityColors[selectedTicket.priority]} variant="custom" size="sm">
                  {selectedTicket.priority}
                </Badge>
                <Badge variant="default" size="sm">{categoryLabels[selectedTicket.category]}</Badge>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{selectedTicket.subject}</h3>
              <p className="text-xs text-gray-500 mt-1">Created {formatDateTime(selectedTicket.createdAt)}</p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedTicket.messages.map((msg) => (
                <div key={msg.id} className={cn(
                  'flex gap-3',
                  msg.from === 'customer' ? 'flex-row-reverse' : 'flex-row'
                )}>
                  {msg.from !== 'system' && (
                    <Avatar name={msg.author} size="sm" />
                  )}
                  {msg.from === 'system' && (
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5',
                    msg.from === 'customer' ? 'bg-orange-600 text-white' :
                    msg.from === 'system' ? 'bg-gray-100 text-gray-600 text-xs italic' :
                    'bg-gray-100 text-gray-900'
                  )}>
                    {msg.from !== 'system' && (
                      <p className={cn('text-xs font-semibold mb-1', msg.from === 'customer' ? 'text-orange-200' : 'text-gray-500')}>
                        {msg.author}
                      </p>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn('text-[10px] mt-1', msg.from === 'customer' ? 'text-orange-200' : 'text-gray-400')}>
                      {formatRelativeTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'closed' && (
              <div className="border-t border-gray-100 pt-4">
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                  />
                  <Button variant="primary" icon={<Send className="h-4 w-4" />}>Send</Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create Ticket Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Support Ticket" size="md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreate(false); }}>
          <Input label="Subject" placeholder="Brief description of your issue" required />
          <Select label="Category" options={[
            { value: 'order_issue', label: 'Order Issue' },
            { value: 'payment', label: 'Payment' },
            { value: 'delivery', label: 'Delivery' },
            { value: 'rental', label: 'Rental' },
            { value: 'account', label: 'Account' },
            { value: 'technical', label: 'Technical' },
            { value: 'other', label: 'Other' },
          ]} placeholder="Select category" />
          <Select label="Priority" options={[
            { value: 'low', label: 'Low — General question' },
            { value: 'medium', label: 'Medium — Not blocking work' },
            { value: 'high', label: 'High — Affects current job' },
            { value: 'urgent', label: 'Urgent — Cannot continue working' },
          ]} placeholder="Select priority" />
          <Input label="Related Order (optional)" placeholder="DRM-XXXXX-XXXX" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              rows={4}
              placeholder="Describe your issue in detail..."
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth icon={<MessageSquare className="h-4 w-4" />}>Create Ticket</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
