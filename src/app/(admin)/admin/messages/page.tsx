"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, Calendar, User, Phone, CheckCircle2, ChevronRight, X } from "lucide-react";
import toast from "react-hot-toast";
import { useConfirmStore } from "@/lib/store/confirmStore";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const { showConfirm } = useConfirmStore();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/v1/messages");
        const data = await response.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const markAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    
    // Optimistic update
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
    
    try {
      await fetch("/api/v1/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true })
      });
      window.dispatchEvent(new Event('refreshNotifications'));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleOpenMessage = (msg: any) => {
    setSelectedMessage(msg);
    markAsRead(msg.id, msg.read);
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    const confirmed = await showConfirm("Delete Message", "Are you sure you want to delete this message?");
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/v1/messages?id=${selectedMessage.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessages(messages.filter(m => m.id !== selectedMessage.id));
        setSelectedMessage(null);
        toast.success("Message deleted successfully");
        window.dispatchEvent(new Event('refreshNotifications'));
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2C4631] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-[#222]">Incoming Messages</h2>
          <div className="bg-[#D98C1F]/10 text-[#D98C1F] px-4 py-1.5 rounded-full text-sm font-semibold">
            {messages.filter(m => !m.read).length} Unread
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="p-12 text-center text-[#888]">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No messages received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF7F2] text-[#666] font-medium border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {messages.map((msg) => (
                  <tr 
                    key={msg.id} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${!msg.read ? 'bg-[#D98C1F]/5' : ''}`}
                    onClick={() => handleOpenMessage(msg)}
                  >
                    <td className="py-4 px-6">
                      {!msg.read ? (
                        <span className="flex items-center gap-1.5 text-[#D98C1F] font-semibold text-xs bg-[#D98C1F]/10 px-2.5 py-1 rounded-md w-fit">
                          <Mail className="w-3.5 h-3.5" /> Unread
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#888] font-medium text-xs bg-gray-100 px-2.5 py-1 rounded-md w-fit">
                          <MailOpen className="w-3.5 h-3.5" /> Read
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#555]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#222]">{msg.name}</div>
                      <div className="text-xs text-[#888]">{msg.email}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#444]">
                      {msg.subject || "No Subject"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-[#2C4631] hover:text-[#D98C1F] font-medium text-sm flex items-center justify-end w-full gap-1">
                        View <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up">
            <div className="bg-[#2C4631] p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl mb-1">{selectedMessage.subject || "No Subject"}</h3>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8 bg-[#FAF7F2] p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-1">From</p>
                  <p className="font-bold text-[#222] flex items-center gap-2"><User className="w-4 h-4 text-[#D98C1F]"/> {selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-[#444] flex items-center gap-2"><Mail className="w-4 h-4 text-[#D98C1F]"/> {selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div className="col-span-2 border-t border-gray-200 pt-4 mt-2">
                    <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="font-medium text-[#444] flex items-center gap-2"><Phone className="w-4 h-4 text-[#D98C1F]"/> {selectedMessage.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Message Content</p>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl text-[#444] leading-relaxed whitespace-pre-wrap text-[15px]">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={handleDeleteMessage}
                  className="text-red-600 hover:text-red-700 font-bold px-4 py-2 transition-colors"
                >
                  Delete Message
                </button>
                <div className="flex gap-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your Message"}`}
                    className="bg-[#D98C1F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#B8740F] transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" /> Reply
                  </a>
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="bg-[#2C4631] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1E3322] transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
