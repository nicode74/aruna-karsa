"use client";

import React, { useState } from "react";
import { saveInvoice, deleteInvoice, sendInvoiceReminderAction } from "../../actions/dbActions";
import {
  Save,
  Plus,
  Trash2,
  Edit,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Calendar,
  Receipt,
  ExternalLink,
  Send,
  PlusCircle,
  DollarSign,
  Briefcase,
  FileSpreadsheet,
} from "lucide-react";

interface PaymentItem {
  date: string;
  amount: number;
  method: string;
  note?: string;
}

interface Invoice {
  id?: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  project_name: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  issue_date: string;
  due_date: string;
  invoice_file_url?: string;
  payment_history: PaymentItem[];
  reminders_sent: number;
}

interface InvoicesFormProps {
  initialInvoices: Invoice[];
}

export default function InvoicesForm({ initialInvoices }: InvoicesFormProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoiceForPayments, setSelectedInvoiceForPayments] = useState<Invoice | null>(null);

  // Form inputs
  const [formData, setFormData] = useState<Omit<Invoice, "payment_history" | "reminders_sent">>({
    invoice_number: "",
    client_name: "",
    client_email: "",
    project_name: "",
    amount: 0,
    status: "Draft",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    invoice_file_url: "",
  });

  // Payment form input
  const [newPayment, setNewPayment] = useState<PaymentItem>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    method: "Transfer BCA",
    note: "",
  });

  // Metric computations
  const totalInvoiced = invoices.reduce((acc, inv) => acc + Number(inv.amount), 0);
  
  const totalPaid = invoices.reduce((acc, inv) => {
    return acc + inv.payment_history.reduce((pAcc, p) => pAcc + Number(p.amount), 0);
  }, 0);

  const totalPending = invoices.reduce((acc, inv) => {
    if (inv.status === "Sent") return acc + Number(inv.amount);
    return acc;
  }, 0);

  const totalOverdue = invoices.reduce((acc, inv) => {
    if (inv.status === "Overdue") return acc + Number(inv.amount);
    return acc;
  }, 0);

  const openCreateModal = () => {
    setEditingInvoice(null);
    setFormData({
      invoice_number: `INV/${new Date().getFullYear()}/${(invoices.length + 1).toString().padStart(3, "0")}`,
      client_name: "",
      client_email: "",
      project_name: "",
      amount: 0,
      status: "Draft",
      issue_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      invoice_file_url: "",
    });
    setMessage(null);
    setShowFormModal(true);
  };

  const openEditModal = (inv: Invoice) => {
    setEditingInvoice(inv);
    setFormData({
      invoice_number: inv.invoice_number,
      client_name: inv.client_name,
      client_email: inv.client_email,
      project_name: inv.project_name,
      amount: inv.amount,
      status: inv.status,
      issue_date: inv.issue_date,
      due_date: inv.due_date,
      invoice_file_url: inv.invoice_file_url || "",
    });
    setMessage(null);
    setShowFormModal(true);
  };

  const openPaymentsModal = (inv: Invoice) => {
    setSelectedInvoiceForPayments(inv);
    setNewPayment({
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      method: "Transfer BCA",
      note: "",
    });
    setMessage(null);
    setShowPaymentsModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "amount") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = editingInvoice
      ? {
          ...editingInvoice,
          ...formData,
        }
      : {
          ...formData,
          payment_history: [],
          reminders_sent: 0,
        };

    const res = await saveInvoice(payload);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan invoice: ${res.error}` });
    } else {
      setMessage({
        type: "success",
        text: `Invoice "${formData.invoice_number}" berhasil disimpan!`,
      });
      setShowFormModal(false);
      window.location.reload();
    }
  };

  const handleDeleteInvoice = async (id: string, number: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus invoice "${number}"?`)) return;

    setLoadingId(id);
    setMessage(null);

    const res = await deleteInvoice(id);
    setLoadingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus invoice: ${res.error}` });
    } else {
      setMessage({ type: "success", text: `Invoice "${number}" berhasil dihapus!` });
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleSendReminder = async (id: string, number: string) => {
    setLoadingId(id);
    setMessage(null);

    const res = await sendInvoiceReminderAction(id);
    setLoadingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal mengirim pengingat: ${res.error}` });
    } else {
      setMessage({
        type: "success",
        text: `Pengingat berhasil dikirim (simulasi) ke email client untuk invoice "${number}". Total pengingat terkirim: ${res.count}`,
      });
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, reminders_sent: res.count ?? 0 } : inv))
      );
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayments || newPayment.amount <= 0) return;

    setSaving(true);
    setMessage(null);

    const updatedHistory = [...selectedInvoiceForPayments.payment_history, newPayment];
    const paidSum = updatedHistory.reduce((acc, p) => acc + Number(p.amount), 0);
    
    // Automatically flag as Paid if total amount met or exceeded
    let newStatus = selectedInvoiceForPayments.status;
    if (paidSum >= selectedInvoiceForPayments.amount) {
      newStatus = "Paid";
    }

    const payload = {
      ...selectedInvoiceForPayments,
      payment_history: updatedHistory,
      status: newStatus,
    };

    const res = await saveInvoice(payload);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menambahkan pembayaran: ${res.error}` });
    } else {
      setMessage({
        type: "success",
        text: `Pembayaran sebesar Rp ${newPayment.amount.toLocaleString("id-ID")} berhasil ditambahkan.`,
      });
      setShowPaymentsModal(false);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white">
            Alat Pembayaran & Invoice Online
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Buat, kirim, dan pantau status penagihan serta termin pembayaran klien.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-amber-500/10 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Buat Invoice
        </button>
      </div>

      {/* Rincian Finansial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total Invoice</p>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Rp {totalInvoiced.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-emerald-500">Terbayar (Lunas)</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-500 mt-1">
            Rp {totalPaid.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-brand-amber-500">Belum Terbayar</p>
          <p className="text-xl sm:text-2xl font-extrabold text-brand-amber-500 mt-1">
            Rp {totalPending.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-red-500">Jatuh Tempo (Overdue)</p>
          <p className="text-xl sm:text-2xl font-extrabold text-red-500 mt-1">
            Rp {totalOverdue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Storage Tip Alert */}
      <div className="p-4 rounded-2xl bg-brand-amber-500/10 border border-brand-amber-500/20 text-brand-amber-800 dark:text-brand-amber-400 text-xs font-semibold flex items-start gap-2.5">
        <FileSpreadsheet className="w-5 h-5 shrink-0 text-brand-amber-500 mt-0.5" />
        <div>
          <span className="font-bold">Tips Penyimpanan Hemat Space</span>: Disarankan untuk mengunggah dokumen tagihan/invoice (.pdf) ke akun <span className="font-bold underline">Google Drive</span> atau <span className="font-bold underline">Discord</span>, kemudian masukkan tautannya ke kolom file url di bawah. Hal ini mencegah penggunaan kuota database Supabase secara berlebih.
        </div>
      </div>

      {/* Alert message display */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* List / Table Grid */}
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-amber-500/10 flex items-center justify-center">
            <Receipt className="w-7 h-7 text-brand-amber-500" />
          </div>
          <div>
            <p className="font-display font-bold text-lg text-zinc-900 dark:text-white">Belum ada invoice dibuat</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
              Klik tombol "Buat Invoice" untuk membuat laporan penagihan termin bagi klien.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <th className="p-6">No. Invoice</th>
                  <th className="p-6">Klien / Proyek</th>
                  <th className="p-6">Jumlah Tagihan</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Jatuh Tempo</th>
                  <th className="p-6 text-center">Pengingat</th>
                  <th className="p-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-sm">
                {invoices.map((inv) => {
                  const paidAmount = inv.payment_history.reduce((a, b) => a + Number(b.amount), 0);
                  return (
                    <tr key={inv.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="p-6 font-display font-bold text-zinc-900 dark:text-white">
                        {inv.invoice_number}
                      </td>
                      <td className="p-6">
                        <div className="font-semibold text-zinc-950 dark:text-zinc-100">{inv.client_name}</div>
                        <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3" /> {inv.project_name}
                        </div>
                      </td>
                      <td className="p-6 font-semibold text-zinc-900 dark:text-white">
                        Rp {Number(inv.amount).toLocaleString("id-ID")}
                        {paidAmount > 0 && (
                          <div className="text-[10px] font-medium text-emerald-500 mt-0.5">
                            Dibayar: Rp {paidAmount.toLocaleString("id-ID")}
                          </div>
                        )}
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === "Paid"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : inv.status === "Sent"
                              ? "bg-brand-amber-500/10 text-brand-amber-500"
                              : inv.status === "Overdue"
                              ? "bg-red-500/10 text-red-600 dark:text-red-400"
                              : "bg-zinc-500/10 text-zinc-500"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-6 text-zinc-500 dark:text-zinc-400 text-xs">
                        {inv.due_date}
                      </td>
                      <td className="p-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        {inv.reminders_sent}x dikirim
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPaymentsModal(inv)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="Lacak Pembayaran"
                          >
                            Pembayaran
                          </button>
                          {inv.status !== "Paid" && (
                            <button
                              onClick={() => inv.id && handleSendReminder(inv.id, inv.invoice_number)}
                              disabled={loadingId === inv.id}
                              className="p-2 rounded-lg text-zinc-400 hover:text-brand-amber-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                              title="Kirim Pengingat"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {inv.invoice_file_url && (
                            <a
                              href={inv.invoice_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                              title="Buka Dokumen"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => openEditModal(inv)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-brand-amber-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => inv.id && handleDeleteInvoice(inv.id, inv.invoice_number)}
                            disabled={loadingId === inv.id}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Editor Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
                {editingInvoice ? "Edit Data Invoice" : "Buat Data Invoice Baru"}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-500 dark:text-zinc-400 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nomor Invoice</label>
                  <input
                    type="text"
                    name="invoice_number"
                    value={formData.invoice_number}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. INV/2026/001"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Status Tagihan</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent (Unpaid)</option>
                    <option value="Paid">Paid (Lunas)</option>
                    <option value="Overdue">Overdue (Jatuh Tempo)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Proyek</label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Desain Villa Kayu Aruna"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nama Klien</label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nama Klien"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Klien</label>
                  <input
                    type="email"
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleInputChange}
                    required
                    placeholder="client@email.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Total Tagihan (Rp)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 50000000"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tanggal Terbit</label>
                  <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Jatuh Tempo</label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Link File Invoice (Google Drive / Discord)</label>
                <input
                  type="url"
                  name="invoice_file_url"
                  value={formData.invoice_file_url}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-brand-amber-500 text-white dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment History Management Modal */}
      {showPaymentsModal && selectedInvoiceForPayments && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-lg w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
                  Histori Pembayaran Klien
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Invoice: {selectedInvoiceForPayments.invoice_number}</p>
              </div>
              <button
                onClick={() => setShowPaymentsModal(false)}
                className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 text-zinc-500 dark:text-zinc-400 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats info */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-850 flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Total Tagihan</p>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white mt-0.5">
                    Rp {Number(selectedInvoiceForPayments.amount).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Sisa Pembayaran</p>
                  <p className="text-sm font-extrabold text-brand-amber-500 mt-0.5">
                    Rp {(
                      Number(selectedInvoiceForPayments.amount) -
                      selectedInvoiceForPayments.payment_history.reduce((a, b) => a + Number(b.amount), 0)
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* History list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Pembayaran Terdaftar
                </h4>
                {selectedInvoiceForPayments.payment_history.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4 italic">Belum ada histori pembayaran masuk.</p>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {selectedInvoiceForPayments.payment_history.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex justify-between items-center text-xs"
                      >
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">
                            Rp {Number(p.amount).toLocaleString("id-ID")}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            {p.date} • {p.method}
                          </div>
                        </div>
                        {p.note && <span className="text-[10px] text-zinc-400 italic font-medium">{p.note}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Payment form */}
              <form onSubmit={handleAddPayment} className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                  <PlusCircle className="w-3.5 h-3.5 text-brand-amber-500" /> Catat Pembayaran Baru
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Jumlah Bayar (Rp)</label>
                    <input
                      type="number"
                      required
                      value={newPayment.amount || ""}
                      onChange={(e) =>
                        setNewPayment((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="e.g. 5000000"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Metode Pembayaran</label>
                    <input
                      type="text"
                      required
                      value={newPayment.method}
                      onChange={(e) => setNewPayment((prev) => ({ ...prev, method: e.target.value }))}
                      placeholder="e.g. Transfer BCA"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Tanggal Bayar</label>
                    <input
                      type="date"
                      required
                      value={newPayment.date}
                      onChange={(e) => setNewPayment((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500">Catatan / Keterangan</label>
                    <input
                      type="text"
                      value={newPayment.note}
                      onChange={(e) => setNewPayment((prev) => ({ ...prev, note: e.target.value }))}
                      placeholder="e.g. Termin 1 (DP)"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentsModal(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving || newPayment.amount <= 0}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-zinc-900 hover:bg-brand-amber-500 text-white dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Simpan Transaksi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
