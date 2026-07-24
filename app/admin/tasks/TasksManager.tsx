"use client";

import React, { useState } from "react";
import {
  saveStaffMember,
  deleteStaffMember,
  saveTask,
  deleteTask,
  updateTaskStatus,
} from "../../actions/dbActions";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Save,
  X,
  Printer,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  CheckCircle,
  UserPlus,
  Shield,
  Crown,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Info,
} from "lucide-react";

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: "ceo" | "manager" | "staff";
  created_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to: string; // email
  status: "Pending" | "In Progress" | "Completed";
  start_date: string; // yyyy-mm-dd
  due_date: string; // yyyy-mm-dd
  priority: "Low" | "Medium" | "High";
  created_at?: string;
  updated_at?: string;
}

interface TasksManagerProps {
  currentUser: any;
  currentStaff: { email: string; name: string; role: "ceo" | "manager" | "staff" };
  initialStaff: StaffMember[];
  initialTasks: Task[];
}

export default function TasksManager({
  currentUser,
  currentStaff,
  initialStaff,
  initialTasks,
}: TasksManagerProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "timeline" | "staff" | "reports">("tasks");
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff || []);
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);

  // Determine user permissions
  const userEmailLower = (currentStaff?.email || currentUser?.email || "").toLowerCase();
  const isCeo =
    currentStaff?.role === "ceo" ||
    userEmailLower === "ceo@arunakarsa.my.id" ||
    userEmailLower === "it@arunakarsa.my.id";
  const isManager = isCeo || currentStaff?.role === "manager";

  // Form & Modal states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  // Filter/Search states
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");
  const [taskStaffFilter, setTaskStaffFilter] = useState<string>("all");

  // General Loading & Notification states
  const [saving, setSaving] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Timeline Navigation state
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleTodayMonth = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatDateString = (date: Date) => {
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  // ── Action Handlers ──

  // Staff Save/Update
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await saveStaffMember(editingStaff);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan staf: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Data staf berhasil diperbarui!" });
      setShowStaffForm(false);
      setEditingStaff(null);
      window.location.reload();
    }
  };

  // Staff Delete
  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus staf ini? Semua tugasnya akan dibiarkan tidak terisi.")) return;
    setDeletingId(id);
    setMessage(null);

    const res = await deleteStaffMember(id);
    setDeletingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus staf: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Staf berhasil dihapus!" });
      window.location.reload();
    }
  };

  // Task Save/Update
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await saveTask(editingTask);
    setSaving(false);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menyimpan tugas: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Tugas berhasil disimpan!" });
      setShowTaskForm(false);
      setEditingTask(null);
      window.location.reload();
    }
  };

  // Task Delete
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    setDeletingId(id);
    setMessage(null);

    const res = await deleteTask(id);
    setDeletingId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal menghapus tugas: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Tugas berhasil dihapus!" });
      if (selectedTaskDetail?.id === id) setSelectedTaskDetail(null);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Task Status Update (Direct status change from Card, Table, or Timeline Modal)
  const handleStatusChange = async (id: string, newStatus: "Pending" | "In Progress" | "Completed") => {
    setUpdatingTaskId(id);
    setMessage(null);
    const res = await updateTaskStatus(id, newStatus);
    setUpdatingTaskId(null);

    if (res.error) {
      setMessage({ type: "error", text: `Gagal memperbarui status: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Status tugas berhasil diperbarui!" });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
      );
      if (selectedTaskDetail?.id === id) {
        setSelectedTaskDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  // ── Filter Logics ──
  const filteredTasks = tasks.filter((t) => {
    // If staff (not manager or CEO), only see assigned tasks
    const matchesUser = isManager ? true : t.assigned_to.toLowerCase() === userEmailLower;

    const matchesSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase()));

    const matchesStatus = taskStatusFilter === "all" || t.status === taskStatusFilter;

    const matchesStaff = taskStaffFilter === "all" || t.assigned_to.toLowerCase() === taskStaffFilter.toLowerCase();

    return matchesUser && matchesSearch && matchesStatus && matchesStaff;
  });

  // ── Reports & Summary Calculations ──
  const totalTasksCount = filteredTasks.length;
  const completedTasksCount = filteredTasks.filter((t) => t.status === "Completed").length;
  const inProgressTasksCount = filteredTasks.filter((t) => t.status === "In Progress").length;
  const pendingTasksCount = filteredTasks.filter((t) => t.status === "Pending").length;
  
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const todayObj = new Date();
  const todayStr = todayObj.toISOString().split("T")[0];
  const overdueTasksCount = filteredTasks.filter((t) => t.status !== "Completed" && t.due_date < todayStr).length;

  const staffStats = staff.map((s) => {
    const staffTasks = tasks.filter((t) => t.assigned_to.toLowerCase() === s.email.toLowerCase());
    const completed = staffTasks.filter((t) => t.status === "Completed").length;
    return {
      name: s.name,
      email: s.email,
      role: s.role,
      total: staffTasks.length,
      completed,
      rate: staffTasks.length > 0 ? Math.round((completed / staffTasks.length) * 100) : 0,
    };
  });

  const getRoleLabel = (role: string, email: string) => {
    const emailLower = email.toLowerCase();
    if (role === "ceo" || emailLower === "ceo@arunakarsa.my.id") return "CEO";
    if (emailLower === "it@arunakarsa.my.id") return "IT Lead / CEO";
    if (role === "manager") return "Studio Manager";
    return "Staff";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-500 shrink-0">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight">
                Tugas & Timeline Studio
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isCeo
                  ? "Panel CEO & IT: Kelola seluruh tugas, alokasikan staf & manajer, pantau timeline, serta perbarui status pengerjaan."
                  : isManager
                  ? "Kelola tugas staf studio, alokasikan pengerjaan proyek, pantau timeline, dan buat laporan operasional."
                  : "Lihat daftar tugas Anda, perbarui status pengerjaan, dan pantau jadwal kerja Anda."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/50 px-3.5 py-2 rounded-2xl text-xs font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
            {isCeo ? (
              <Crown className="w-4 h-4 text-amber-500" />
            ) : (
              <Shield className="w-4 h-4 text-brand-amber-500" />
            )}
            Role: {getRoleLabel(currentStaff.role, currentStaff.email)}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <button
          onClick={() => { setActiveTab("tasks"); setMessage(null); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-2 ${
            activeTab === "tasks"
              ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
          }`}
        >
          <ListTodo className="w-4 h-4" />
          Daftar Tugas ({filteredTasks.length})
        </button>
        <button
          onClick={() => { setActiveTab("timeline"); setMessage(null); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-2 ${
            activeTab === "timeline"
              ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Timeline Gantt Chart
        </button>
        {isManager && (
          <>
            <button
              onClick={() => { setActiveTab("staff"); setMessage(null); }}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-2 ${
                activeTab === "staff"
                  ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
              }`}
            >
              <Users className="w-4 h-4" />
              Kelola Staf & Tim ({staff.length})
            </button>
            <button
              onClick={() => { setActiveTab("reports"); setMessage(null); }}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap -mb-px flex items-center gap-2 ${
                activeTab === "reports"
                  ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Laporan Kerja
            </button>
          </>
        )}
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border text-sm font-semibold transition-all animate-fadeIn ${
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
          <span className="flex-1">{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── TAB 1: Tasks List ── */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  placeholder="Cari nama tugas / deskripsi..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                />
              </div>

              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="Pending">Pending (Tertunda)</option>
                <option value="In Progress">In Progress (Berjalan)</option>
                <option value="Completed">Completed (Selesai)</option>
              </select>

              {isManager && (
                <select
                  value={taskStaffFilter}
                  onChange={(e) => setTaskStaffFilter(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 font-medium"
                >
                  <option value="all">Semua Penanggung Jawab</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.email}>
                      {s.name} ({getRoleLabel(s.role, s.email)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {isManager && !showTaskForm && (
              <button
                onClick={() => {
                  setEditingTask({
                    title: "",
                    description: "",
                    assigned_to: staff[0]?.email || currentStaff.email,
                    status: "Pending",
                    start_date: new Date().toISOString().split("T")[0],
                    due_date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
                    priority: "Medium",
                  });
                  setShowTaskForm(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                Buat Tugas Baru
              </button>
            )}
          </div>

          {/* Task Form Editor */}
          {showTaskForm && editingTask && (
            <form
              onSubmit={handleSaveTask}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
                <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-brand-amber-500" />
                  {editingTask.id ? "Edit Detail Tugas" : "Buat Tugas Studio Baru"}
                </h2>
                <button
                  type="button"
                  onClick={() => { setShowTaskForm(false); setEditingTask(null); }}
                  className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Judul Tugas / Proyek
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder="Contoh: Penyusunan DED & RAB Villa Canggu"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Penanggung Jawab (Assigned To)
                  </label>
                  <select
                    value={editingTask.assigned_to}
                    onChange={(e) => setEditingTask({ ...editingTask, assigned_to: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 font-medium"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.email}>
                        {s.name} ({s.email}) - {getRoleLabel(s.role, s.email)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Tingkat Prioritas
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 font-medium"
                  >
                    <option value="Low">Rendah (Low)</option>
                    <option value="Medium">Sedang (Medium)</option>
                    <option value="High">Tinggi (High / Urgent)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={editingTask.start_date}
                    onChange={(e) => setEditingTask({ ...editingTask, start_date: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Batas Waktu (Due Date)
                  </label>
                  <input
                    type="date"
                    required
                    value={editingTask.due_date}
                    onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Instruksi & Catatan Pengerjaan
                  </label>
                  <textarea
                    rows={3}
                    value={editingTask.description || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder="Tuliskan spesifikasi detail, tautan file kerja, atau catatan penting..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setShowTaskForm(false); setEditingTask(null); }}
                  className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Tugas
                </button>
              </div>
            </form>
          )}

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.length === 0 ? (
              <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-16 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-zinc-400">
                  <ListTodo className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Tidak Ada Tugas Ditemukan</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                    Tidak ada tugas yang sesuai dengan pencarian atau filter yang Anda pilih.
                  </p>
                </div>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const assignedStaff = staff.find((s) => s.email.toLowerCase() === task.assigned_to.toLowerCase());
                const isOverdue = task.status !== "Completed" && task.due_date < todayStr;
                const isUpdatingThis = updatingTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`p-6 rounded-3xl bg-white dark:bg-zinc-900 border shadow-sm flex flex-col justify-between hover:shadow-md transition-all ${
                      isOverdue
                        ? "border-red-500/30 dark:border-red-500/20"
                        : task.status === "Completed"
                        ? "border-emerald-500/30 dark:border-emerald-500/20"
                        : "border-zinc-200/60 dark:border-zinc-800/60"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Priority and Status Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              task.priority === "High"
                                ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                : task.priority === "Medium"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            }`}
                          >
                            Prioritas {task.priority}
                          </span>
                          {isOverdue && (
                            <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 text-[10px] font-extrabold uppercase tracking-wider border border-red-500/20">
                              Terlambat
                            </span>
                          )}
                        </div>

                        {/* Interactive Status Selector */}
                        <div className="relative flex items-center gap-1">
                          {isUpdatingThis && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />}
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                            disabled={isUpdatingThis}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide border focus:outline-none cursor-pointer transition-colors ${
                              task.status === "Completed"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                : task.status === "In Progress"
                                ? "bg-brand-amber-500/10 border-brand-amber-500/30 text-brand-amber-600 dark:text-brand-amber-400"
                                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Selesai</option>
                          </select>
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1.5">
                        <h3
                          onClick={() => setSelectedTaskDetail(task)}
                          className="font-display font-bold text-base text-zinc-900 dark:text-white leading-snug cursor-pointer hover:text-brand-amber-600 dark:hover:text-brand-amber-400 transition-colors"
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Assigned Staf Details */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 truncate">
                          <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">
                            Tugas ke: <strong className="text-zinc-800 dark:text-zinc-200">{assignedStaff?.name || task.assigned_to}</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedTaskDetail(task)}
                          className="text-[11px] font-bold text-brand-amber-600 dark:text-brand-amber-400 hover:underline flex items-center gap-1 shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detail
                        </button>
                      </div>
                    </div>

                    {/* Timeline row & management action buttons */}
                    <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-3 text-xs text-zinc-450">
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>
                          {task.start_date} s/d {task.due_date}
                        </span>
                      </div>
                      {isManager && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => { setEditingTask(task); setShowTaskForm(true); }}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-850 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            aria-label="Edit task"
                            title="Edit Tugas"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={deletingId === task.id}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            aria-label="Delete task"
                            title="Hapus Tugas"
                          >
                            {deletingId === task.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Gantt Chart Timeline ── */}
      {activeTab === "timeline" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm space-y-6 overflow-hidden">
          {/* Timeline Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-150 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-amber-500/10 flex items-center justify-center text-brand-amber-500 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
                  {formatDateString(currentDate)}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Visualisasi jadwal pengerjaan tugas & timeline studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Quick Filters */}
              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Selesai</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleTodayMonth}
                  className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Bulan Ini
                </button>
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Bulan sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Bulan berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sleek Modern Gantt Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
            <div className="min-w-[900px] text-xs">
              {/* Header Days Row */}
              <div className="flex bg-zinc-100/80 dark:bg-zinc-950 font-bold border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <div className="w-64 p-3.5 shrink-0 border-r border-zinc-200 dark:border-zinc-800 font-display sticky left-0 z-20 bg-zinc-100 dark:bg-zinc-950 shadow-sm">
                  Tugas & Penanggung Jawab
                </div>
                <div className="flex-1 flex">
                  {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map(
                    (_, index) => {
                      const dayNum = index + 1;
                      const isTodayCol =
                        todayObj.getDate() === dayNum &&
                        todayObj.getMonth() === currentDate.getMonth() &&
                        todayObj.getFullYear() === currentDate.getFullYear();

                      return (
                        <div
                          key={index}
                          className={`flex-1 text-center py-2.5 border-r border-zinc-200/60 dark:border-zinc-800/60 select-none ${
                            isTodayCol
                              ? "bg-brand-amber-500/20 text-brand-amber-600 dark:text-brand-amber-400 font-extrabold"
                              : ""
                          }`}
                        >
                          {dayNum}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Tasks Gantt Rows */}
              <div className="divide-y divide-zinc-150 dark:divide-zinc-850">
                {filteredTasks.length === 0 ? (
                  <div className="p-12 text-center text-zinc-400">
                    Tidak ada jadwal tugas yang cocok di bulan ini.
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
                    const startObj = new Date(task.start_date);
                    const dueObj = new Date(task.due_date);

                    const curMonth = currentDate.getMonth();
                    const curYear = currentDate.getFullYear();

                    // Check if task falls within current view month
                    const monthStart = new Date(curYear, curMonth, 1);
                    const monthEnd = new Date(curYear, curMonth, daysInMonth);

                    if (dueObj < monthStart || startObj > monthEnd) {
                      return null; // Skip if out of active month window
                    }

                    let startDayIndex = 1;
                    if (startObj.getMonth() === curMonth && startObj.getFullYear() === curYear) {
                      startDayIndex = startObj.getDate();
                    }

                    let endDayIndex = daysInMonth;
                    if (dueObj.getMonth() === curMonth && dueObj.getFullYear() === curYear) {
                      endDayIndex = dueObj.getDate();
                    }

                    const widthPercentage = ((endDayIndex - startDayIndex + 1) / daysInMonth) * 100;
                    const leftPercentage = ((startDayIndex - 1) / daysInMonth) * 100;

                    const assignedStaff = staff.find((s) => s.email.toLowerCase() === task.assigned_to.toLowerCase());

                    return (
                      <div
                        key={task.id}
                        className="flex hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 items-center transition-colors group"
                      >
                        {/* Sticky Task Label Column */}
                        <div className="w-64 p-3.5 shrink-0 border-r border-zinc-200 dark:border-zinc-800 sticky left-0 z-10 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50/90 dark:group-hover:bg-zinc-850 transition-colors">
                          <p
                            onClick={() => setSelectedTaskDetail(task)}
                            className="font-bold text-zinc-900 dark:text-zinc-100 truncate cursor-pointer hover:text-brand-amber-600 dark:hover:text-brand-amber-400 transition-colors"
                            title={task.title}
                          >
                            {task.title}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {assignedStaff?.name || task.assigned_to}
                          </p>
                        </div>

                        {/* Timeline Track */}
                        <div className="flex-1 py-3 relative h-12 flex items-center px-1">
                          {/* Render Today Highlight Line if in active month */}
                          {todayObj.getMonth() === curMonth && todayObj.getFullYear() === curYear && (
                            <div
                              style={{ left: `${((todayObj.getDate() - 1) / daysInMonth) * 100}%` }}
                              className="absolute top-0 bottom-0 w-0.5 bg-brand-amber-500/40 z-0 pointer-events-none"
                            />
                          )}

                          {/* Gantt Bar Pill */}
                          <div
                            onClick={() => setSelectedTaskDetail(task)}
                            style={{
                              left: `${leftPercentage}%`,
                              width: `${Math.max(widthPercentage, 3)}%`,
                            }}
                            className={`absolute h-7 rounded-xl flex items-center px-3 font-semibold text-[11px] shadow-sm cursor-pointer border text-white transition-transform hover:scale-[1.01] z-10 select-none ${
                              task.status === "Completed"
                                ? "bg-emerald-600 border-emerald-500 dark:bg-emerald-600/90"
                                : task.status === "In Progress"
                                ? "bg-brand-amber-600 border-brand-amber-500 dark:bg-brand-amber-600/90"
                                : "bg-zinc-600 border-zinc-500 dark:bg-zinc-700"
                            }`}
                            title={`${task.title} (${task.start_date} - ${task.due_date})`}
                          >
                            <span className="truncate">{task.title}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Staff Management (Manager & CEO) ── */}
      {activeTab === "staff" && isManager && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-amber-500" />
                Daftar Staf & Manajer Studio
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Kelola anggota staf, tentukan role/jabatan, dan beri hak akses tugas studio.
              </p>
            </div>
            {!showStaffForm && (
              <button
                onClick={() => {
                  setEditingStaff({ name: "", email: "", role: "staff" });
                  setShowStaffForm(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                Tambah Staf Baru
              </button>
            )}
          </div>

          {/* Staff Form */}
          {showStaffForm && editingStaff && (
            <form
              onSubmit={handleSaveStaff}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
                <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                  {editingStaff.id ? "Edit Data Staf" : "Tambah Staf Baru"}
                </h2>
                <button
                  type="button"
                  onClick={() => { setShowStaffForm(false); setEditingStaff(null); }}
                  className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    placeholder="Contoh: Hermawan S.T."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Email Staf
                  </label>
                  <input
                    type="email"
                    required
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    placeholder="hermawan@arunakarsa.co.id"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Role / Jabatan
                  </label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 font-medium"
                  >
                    <option value="staff">Studio Staff</option>
                    <option value="manager">Studio Manager</option>
                    {isCeo && <option value="ceo">CEO / Executive</option>}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setShowStaffForm(false); setEditingStaff(null); }}
                  className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Staf
                </button>
              </div>
            </form>
          )}

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((member) => {
              const roleLabel = getRoleLabel(member.role, member.email);
              const isMemberCeo = member.role === "ceo" || member.email.toLowerCase() === "ceo@arunakarsa.my.id" || member.email.toLowerCase() === "it@arunakarsa.my.id";

              return (
                <div
                  key={member.id}
                  className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-400 flex items-center justify-center font-bold">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider ${
                          isMemberCeo
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : member.role === "manager"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        {roleLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{member.email}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-end gap-1">
                    <button
                      onClick={() => { setEditingStaff(member); setShowStaffForm(true); }}
                      className="p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      aria-label="Edit staf"
                      title="Edit Staf"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      disabled={deletingId === member.id}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                      aria-label="Hapus staf"
                      title="Hapus Staf"
                    >
                      {deletingId === member.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 4: Reports (Manager & CEO) ── */}
      {activeTab === "reports" && isManager && (
        <div className="space-y-6 animate-fadeIn" id="printable-task-report">
          {/* Stat Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Total Tugas
              </span>
              <p className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white mt-1">
                {totalTasksCount}
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">
                Tugas Selesai
              </span>
              <p className="font-display font-extrabold text-3xl text-emerald-600 dark:text-emerald-400 mt-1">
                {completedTasksCount}
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-amber-500">
                Penyelesaian (%)
              </span>
              <p className="font-display font-extrabold text-3xl text-brand-amber-600 dark:text-brand-amber-400 mt-1">
                {completionRate}%
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500">
                Terlambat
              </span>
              <p className="font-display font-extrabold text-3xl text-red-600 dark:text-red-400 mt-1">
                {overdueTasksCount}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status breakdown */}
            <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-amber-500" />
                Distribusi Status Pekerjaan
              </h3>

              <div className="space-y-4">
                {[
                  { label: "Selesai (Completed)", count: completedTasksCount, color: "bg-emerald-500" },
                  { label: "Sedang Berjalan (In Progress)", count: inProgressTasksCount, color: "bg-brand-amber-500" },
                  { label: "Tertunda (Pending)", count: pendingTasksCount, color: "bg-zinc-400" },
                ].map((stat, idx) => {
                  const pct = totalTasksCount > 0 ? Math.round((stat.count / totalTasksCount) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                        <span>{stat.label}</span>
                        <span>
                          {stat.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                        <div style={{ width: `${pct}%` }} className={`h-full ${stat.color} rounded-full transition-all`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Staff Table */}
            <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-amber-500" />
                  Kinerja Staf & Tim
                </h3>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Laporan
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-zinc-600 dark:text-zinc-400">
                  <thead className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-800">
                    <tr>
                      <th className="py-3">Nama Staff</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Total Tugas</th>
                      <th className="py-3">Selesai</th>
                      <th className="py-3 text-right">Rasio (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {staffStats.map((st, idx) => (
                      <tr key={idx} className="font-medium">
                        <td className="py-3.5 font-bold text-zinc-800 dark:text-zinc-200">{st.name}</td>
                        <td className="py-3.5 text-zinc-400">{getRoleLabel(st.role, st.email)}</td>
                        <td className="py-3.5">{st.total}</td>
                        <td className="py-3.5">{st.completed}</td>
                        <td className="py-3.5 text-right font-extrabold text-brand-amber-600 dark:text-brand-amber-400">
                          {st.rate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Task Detail Modal Popover ── */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedTaskDetail(null)}
              className="absolute top-6 right-6 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    selectedTaskDetail.priority === "High"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                      : selectedTaskDetail.priority === "Medium"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                  }`}
                >
                  Prioritas {selectedTaskDetail.priority}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl text-zinc-900 dark:text-white">
                {selectedTaskDetail.title}
              </h2>
            </div>

            {/* Status Update Control */}
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Status Pengerjaan Tugas
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTaskDetail.status}
                  onChange={(e) => handleStatusChange(selectedTaskDetail.id, e.target.value as any)}
                  className="flex-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 font-bold"
                >
                  <option value="Pending">Pending (Tertunda)</option>
                  <option value="In Progress">In Progress (Sedang Dikerjakan)</option>
                  <option value="Completed">Completed (Selesai)</option>
                </select>
              </div>
            </div>

            {/* Metadata Info */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Penanggung Jawab:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{selectedTaskDetail.assigned_to}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-150 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Jadwal Pengerjaan:</span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {selectedTaskDetail.start_date} s/d {selectedTaskDetail.due_date}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedTaskDetail.description && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Instruksi & Deskripsi
                </label>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedTaskDetail.description}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Tutup
              </button>
              {isManager && (
                <button
                  onClick={() => {
                    setEditingTask(selectedTaskDetail);
                    setSelectedTaskDetail(null);
                    setShowTaskForm(true);
                  }}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Edit Tugas
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
