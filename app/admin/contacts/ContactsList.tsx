"use client";

import React, { useState } from "react";
import { deleteContactSubmission } from "../../actions/dbActions";
import {
  Mail,
  Trash2,
  Search,
  X,
  Calendar,
  User,
  Phone,
  Inbox,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  created_at: string;
}

interface ContactsListProps {
  initialContacts: ContactSubmission[];
}

export default function ContactsList({ initialContacts }: ContactsListProps) {
  const [contacts, setContacts] = useState<ContactSubmission[]>(initialContacts || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Handle Search filtering
  const filteredContacts = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.subject && c.subject.toLowerCase().includes(term)) ||
      c.message.toLowerCase().includes(term)
    );
  });

  // Handle Delete message
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini dari database?")) return;
    setDeletingId(id);
    setMessage(null);

    const res = await deleteContactSubmission(id);
    setDeletingId(null);

    if (res.error) {
      // Very helpful error message if RLS policy blocks deletion
      const errorText = res.error.includes("new row violates row-level security") || res.error.includes("violates row-level security") 
        ? "Gagal menghapus pesan: Kebijakan (RLS Policy) DELETE belum diaktifkan di Supabase untuk tabel 'contact_submissions'."
        : `Gagal menghapus pesan: ${res.error}`;
      setMessage({ type: "error", text: errorText });
    } else {
      setMessage({ type: "success", text: "Pesan berhasil dihapus!" });
      setContacts((prev) => prev.filter((item) => item.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-brand-amber-500 shrink-0" />
            Pesan Masuk (Inbox)
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Daftar pesan konsultasi dan kontak dari pengunjung website
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-350 self-start sm:self-auto">
          Total: {contacts.length} Pesan
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border text-sm font-semibold transition-all ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nama, email, jenis proyek, atau isi pesan..."
          className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 focus:outline-none focus:border-brand-amber-500 transition-colors shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredContacts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                <Inbox className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Tidak Ada Pesan</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                  {searchTerm
                    ? "Tidak ditemukan pesan yang cocok dengan kata kunci pencarian Anda."
                    : "Belum ada pesan masuk yang terekam di database."}
                </p>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedContact?.id === contact.id
                    ? "bg-brand-amber-500/5 dark:bg-brand-amber-500/5 border-brand-amber-500/50 shadow-md"
                    : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-350 dark:hover:border-zinc-750 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-bold text-zinc-900 dark:text-white text-base truncate">
                        {contact.name}
                      </span>
                      {contact.subject && (
                        <span className="px-2 py-0.5 rounded-lg bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-400 text-[10px] font-bold uppercase tracking-wide">
                          {contact.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{contact.email}</p>
                    <p className="text-xs text-zinc-650 dark:text-zinc-300 line-clamp-2 pt-1 leading-relaxed">
                      {contact.message}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                      {formatDate(contact.created_at).split(" pukul ")[0]}
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold opacity-85 mt-0.5">
                      {formatDate(contact.created_at).split(" pukul ")[1]}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Message Panel / Detailed View */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm sticky top-6 space-y-6">
              {/* Header Details */}
              <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800/60 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-amber-500">
                    Detail Pengirim
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-zinc-900 dark:text-white truncate">
                    {selectedContact.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 rounded-xl border border-zinc-250 dark:border-zinc-750 text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sender info list */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <User className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="font-medium truncate">{selectedContact.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="font-medium hover:underline text-brand-amber-500 flex items-center gap-1.5 min-w-0"
                  >
                    <span className="truncate">{selectedContact.email}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  </a>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                    <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="font-medium">{selectedContact.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="font-medium">{formatDate(selectedContact.created_at)}</span>
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Isi Pesan
                </span>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-150 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Balasan: ${selectedContact.subject || "Kontak Aruna Karsa"}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  Balas Email
                </a>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  disabled={deletingId === selectedContact.id}
                  className="p-2.5 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors border border-transparent hover:border-red-250 dark:hover:border-red-900/40 shrink-0"
                  aria-label="Delete message"
                >
                  {deletingId === selectedContact.id ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 text-center hidden lg:flex flex-col items-center justify-center space-y-3 text-zinc-400 py-16 sticky top-6">
              <Mail className="w-10 h-10 opacity-40 text-zinc-400" />
              <div>
                <h4 className="font-bold text-sm text-zinc-650 dark:text-zinc-350">Pilih Pesan</h4>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[200px] mx-auto mt-0.5">
                  Klik salah satu pesan di daftar sebelah kiri untuk membaca detail selengkapnya.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
