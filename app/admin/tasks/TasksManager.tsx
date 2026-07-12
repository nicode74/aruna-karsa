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
  RefreshCw,
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
  Layers,
} from "lucide-react";

interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: "manager" | "staff";
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to: string; // email
  status: "Pending" | "In Progress" | "Completed";
  start_date: string; // yyyy-mm-dd
  due_date: string; // yyyy-mm-dd
  priority: "Low" | "Medium" | "High";
  created_at: string;
  updated_at: string;
}

interface TasksManagerProps {
  currentUser: any;
  currentStaff: { email: string; name: string; role: "manager" | "staff" };
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

  const isManager = currentStaff.role === "manager";

  // Form states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  // Filter/Search states
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");
  const [taskStaffFilter, setTaskStaffFilter] = useState<string>("all");

  // General Loading & Notification states
  const [saving, setSaving] = useState(false);
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
      setMessage({ type: "success", text: "Staf berhasil disimpan!" });
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
      window.location.reload();
    }
  };

  // Task Status Update (Used by Staff/Manager directly in list view)
  const handleStatusChange = async (id: string, newStatus: "Pending" | "In Progress" | "Completed") => {
    setMessage(null);
    const res = await updateTaskStatus(id, newStatus);
    if (res.error) {
      setMessage({ type: "error", text: `Gagal memperbarui status: ${res.error}` });
    } else {
      setMessage({ type: "success", text: "Status tugas berhasil diperbarui!" });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
      );
    }
  };

  // ── Filter Logics ──
  const filteredTasks = tasks.filter((t) => {
    // If not manager, staff can only see their own tasks
    const matchesUser = isManager ? true : t.assigned_to === currentStaff.email;

    const matchesSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase()));

    const matchesStatus = taskStatusFilter === "all" || t.status === taskStatusFilter;

    const matchesStaff = taskStaffFilter === "all" || t.assigned_to === taskStaffFilter;

    return matchesUser && matchesSearch && matchesStatus && matchesStaff;
  });

  // ── Reports Calculations ──
  const totalTasksCount = filteredTasks.length;
  const completedTasksCount = filteredTasks.filter((t) => t.status === "Completed").length;
  const inProgressTasksCount = filteredTasks.filter((t) => t.status === "In Progress").length;
  const pendingTasksCount = filteredTasks.filter((t) => t.status === "Pending").length;
  
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const overdueTasksCount = filteredTasks.filter((t) => t.status !== "Completed" && t.due_date < todayStr).length;

  const staffStats = staff.map((s) => {
    const staffTasks = tasks.filter((t) => t.assigned_to === s.email);
    const completed = staffTasks.filter((t) => t.status === "Completed").length;
    return {
      name: s.name,
      email: s.email,
      total: staffTasks.length,
      completed,
      rate: staffTasks.length > 0 ? Math.round((completed / staffTasks.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white flex items-center gap-3">
            <ListTodo className="w-8 h-8 text-brand-amber-500 shrink-0" />
            Tugas & Timeline Studio
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isManager
              ? "Kelola tugas staf studio, delegasikan proyek, pantau timeline, dan buat laporan operasional."
              : "Lihat daftar tugas Anda, perbarui status pengerjaan, dan pantau jadwal kerja Anda."}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-350 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-brand-amber-500" />
            Role: {isManager ? "Studio Manager" : "Staff"}
          </span>
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => { setActiveTab("tasks"); setMessage(null); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
            activeTab === "tasks"
              ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
          }`}
        >
          Daftar Tugas
        </button>
        <button
          onClick={() => { setActiveTab("timeline"); setMessage(null); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
            activeTab === "timeline"
              ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
          }`}
        >
          Timeline Gantt
        </button>
        {isManager && (
          <>
            <button
              onClick={() => { setActiveTab("staff"); setMessage(null); }}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                activeTab === "staff"
                  ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
              }`}
            >
              Kelola Staf
            </button>
            <button
              onClick={() => { setActiveTab("reports"); setMessage(null); }}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                activeTab === "reports"
                  ? "border-brand-amber-500 text-brand-amber-600 dark:text-brand-amber-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-300"
              }`}
            >
              Laporan Kerja
            </button>
          </>
        )}
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

      {/* ── TAB 1: Tasks List ── */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          {/* Controls & Search */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Cari tugas..."
                className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              />
              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
              >
                <option value="all">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Selesai</option>
              </select>
              {isManager && (
                <select
                  value={taskStaffFilter}
                  onChange={(e) => setTaskStaffFilter(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                >
                  <option value="all">Semua Staf</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.email}>
                      {s.name}
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
                    assigned_to: staff[0]?.email || "",
                    status: "Pending",
                    start_date: new Date().toISOString().split("T")[0],
                    due_date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
                    priority: "Medium",
                  });
                  setShowTaskForm(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:text-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tambah Tugas
              </button>
            )}
          </div>

          {/* Task Form Editor */}
          {showTaskForm && editingTask && (
            <form
              onSubmit={handleSaveTask}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-sm space-y-6 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
                  {editingTask.id ? "Edit Tugas" : "Buat Tugas Baru"}
                </h2>
                <button
                  type="button"
                  onClick={() => { setShowTaskForm(false); setEditingTask(null); }}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Judul Tugas</label>
                  <input
                    type="text"
                    required
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder="Contoh: Membuat Detail Tangga Villa Uluwatu"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tugaskan Kepada</label>
                  <select
                    value={editingTask.assigned_to}
                    onChange={(e) => setEditingTask({ ...editingTask, assigned_to: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.email}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Prioritas</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  >
                    <option value="Low">Rendah (Low)</option>
                    <option value="Medium">Sedang (Medium)</option>
                    <option value="High">Tinggi (High)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={editingTask.start_date}
                    onChange={(e) => setEditingTask({ ...editingTask, start_date: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Batas Waktu (Due Date)</label>
                  <input
                    type="date"
                    required
                    value={editingTask.due_date}
                    onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deskripsi Tugas</label>
                  <textarea
                    rows={3}
                    value={editingTask.description || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder="Instruksi pengerjaan detail tugas..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/20">
                <button
                  type="button"
                  onClick={() => { setShowTaskForm(false); setEditingTask(null); }}
                  className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-650 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
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
              <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-16 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-400">
                  <ListTodo className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Tidak Ada Tugas</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                    Belum ada pengerjaan tugas yang cocok dengan pencarian Anda.
                  </p>
                </div>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const assignedStaff = staff.find((s) => s.email === task.assigned_to);
                const isOverdue = task.status !== "Completed" && task.due_date < todayStr;
                return (
                  <div
                    key={task.id}
                    className={`p-6 rounded-3xl bg-white dark:bg-zinc-900 border shadow-sm flex flex-col justify-between transition-all ${
                      isOverdue
                        ? "border-red-500/20 dark:border-red-500/10"
                        : task.status === "Completed"
                        ? "border-green-500/20 dark:border-green-500/10"
                        : "border-zinc-200/60 dark:border-zinc-800/60"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Priority and Status Badges */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                            task.priority === "High"
                              ? "bg-red-500/10 text-red-600 dark:text-red-400"
                              : task.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {task.priority} Prioritas
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded-lg bg-red-650/10 text-red-600 text-[9px] font-bold uppercase tracking-wider">
                              TERLAMBAT
                            </span>
                          )}
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border focus:outline-none ${
                              task.status === "Completed"
                                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                : task.status === "In Progress"
                                ? "bg-brand-amber-500/10 border-brand-amber-500/20 text-brand-amber-600 dark:text-brand-amber-400"
                                : "bg-zinc-100 border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
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
                        <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white leading-snug">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed line-clamp-3">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Assigned Staf Details */}
                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/40 text-xs text-zinc-550">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-medium truncate">
                          Ditugaskan ke: <span className="font-bold text-zinc-700 dark:text-zinc-300">{assignedStaff?.name || task.assigned_to}</span>
                        </span>
                      </div>
                    </div>

                    {/* Timeline row & admin operations */}
                    <div className="mt-6 pt-4 border-t border-zinc-150 dark:border-zinc-800/40 flex items-center justify-between gap-3 text-[11px] text-zinc-450">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>
                          {task.start_date} s/d {task.due_date}
                        </span>
                      </div>
                      {isManager && (
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => { setEditingTask(task); setShowTaskForm(true); }}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-750 hover:bg-zinc-50 border border-transparent hover:border-zinc-200"
                            aria-label="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={deletingId === task.id}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-650 hover:bg-red-50/10 border border-transparent hover:border-red-200"
                            aria-label="Delete task"
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
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-6 overflow-hidden">
          {/* Timeline Navigation Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-amber-500" />
              {formatDateString(currentDate)}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gantt Wrapper */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden text-xs">
              {/* Timeline Header Days row */}
              <div className="flex bg-zinc-50 dark:bg-zinc-950 font-bold border-b border-zinc-200 dark:border-zinc-850">
                <div className="w-1/4 p-4 shrink-0 border-r border-zinc-200 dark:border-zinc-850 font-display">Tugas & Staf</div>
                <div className="w-3/4 flex divide-x divide-zinc-200 dark:divide-zinc-850">
                  {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map(
                    (_, index) => (
                      <div key={index} className="flex-1 text-center py-3 select-none">
                        {index + 1}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Timeline Tasks Rows */}
              <div className="divide-y divide-zinc-150 dark:divide-zinc-850">
                {filteredTasks.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400">Tidak ada jadwal tugas di bulan ini.</div>
                ) : (
                  filteredTasks.map((task) => {
                    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
                    const startMonth = new Date(task.start_date).getMonth();
                    const startYear = new Date(task.start_date).getFullYear();
                    const endMonth = new Date(task.due_date).getMonth();
                    const endYear = new Date(task.due_date).getFullYear();

                    const curMonth = currentDate.getMonth();
                    const curYear = currentDate.getFullYear();

                    // Calculate task span inside current view month
                    let startDayIndex = 1;
                    if (startMonth === curMonth && startYear === curYear) {
                      startDayIndex = new Date(task.start_date).getDate();
                    } else if (
                      new Date(task.start_date) > new Date(curYear, curMonth, daysInMonth) ||
                      new Date(task.due_date) < new Date(curYear, curMonth, 1)
                    ) {
                      // Out of range for current month
                      return null;
                    }

                    let endDayIndex = daysInMonth;
                    if (endMonth === curMonth && endYear === curYear) {
                      endDayIndex = new Date(task.due_date).getDate();
                    }

                    const widthPercentage = ((endDayIndex - startDayIndex + 1) / daysInMonth) * 100;
                    const leftPercentage = ((startDayIndex - 1) / daysInMonth) * 100;

                    const assignedStaff = staff.find((s) => s.email === task.assigned_to);

                    return (
                      <div key={task.id} className="flex hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 items-center">
                        <div className="w-1/4 p-4 shrink-0 border-r border-zinc-200 dark:border-zinc-850 truncate">
                          <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{task.title}</p>
                          <p className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate mt-0.5">
                            Oleh: {assignedStaff?.name || task.assigned_to}
                          </p>
                        </div>
                        <div className="w-3/4 py-4 relative h-12 flex items-center">
                          {/* Gantt Bar */}
                          <div
                            style={{
                              left: `${leftPercentage}%`,
                              width: `${widthPercentage}%`,
                            }}
                            className={`absolute h-7 rounded-xl flex items-center px-3 font-semibold text-[10px] shadow-sm select-none border text-white truncate ${
                              task.status === "Completed"
                                ? "bg-green-600 border-green-500"
                                : task.status === "In Progress"
                                ? "bg-brand-amber-600 border-brand-amber-500"
                                : "bg-zinc-400 dark:bg-zinc-700 border-zinc-500/20 text-zinc-800 dark:text-zinc-200"
                            }`}
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

      {/* ── TAB 3: Staff Management (Manager only) ── */}
      {activeTab === "staff" && isManager && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-amber-500" />
                Daftar Staf Studio
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Daftar staf resmi yang dapat diberikan delegasi tugas operasional.
              </p>
            </div>
            {!showStaffForm && (
              <button
                onClick={() => {
                  setEditingStaff({ name: "", email: "", role: "staff" });
                  setShowStaffForm(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-brand-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                Tambah Staf
              </button>
            )}
          </div>

          {/* Staff Editor Form */}
          {showStaffForm && editingStaff && (
            <form
              onSubmit={handleSaveStaff}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-sm space-y-6 animate-fadeIn"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="font-display font-extrabold text-lg text-zinc-900 dark:text-white">
                  {editingStaff.id ? "Edit Staf" : "Tambah Staf Baru"}
                </h2>
                <button
                  type="button"
                  onClick={() => { setShowStaffForm(false); setEditingStaff(null); }}
                  className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Nama Lengkap</label>
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
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Email Staff</label>
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
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Jabatan / Role</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500"
                  >
                    <option value="staff">Studio Staff</option>
                    <option value="manager">Studio Manager</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setShowStaffForm(false); setEditingStaff(null); }}
                  className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-650 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50"
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

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-brand-amber-500/10 text-brand-amber-600 dark:text-brand-amber-400 flex items-center justify-center font-bold">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                        member.role === "manager"
                          ? "bg-brand-amber-500/10 text-brand-amber-600"
                          : "bg-zinc-100 text-zinc-550 dark:bg-zinc-950 dark:text-zinc-450"
                      }`}
                    >
                      {member.role === "manager" ? "Manager" : "Staff"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-white truncate">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-zinc-450 truncate mt-0.5">{member.email}</p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-end gap-1">
                  <button
                    onClick={() => { setEditingStaff(member); setShowStaffForm(true); }}
                    className="p-2 text-zinc-400 hover:text-zinc-850 hover:bg-zinc-50 border border-transparent rounded-lg"
                    aria-label="Edit staff"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(member.id)}
                    disabled={deletingId === member.id}
                    className="p-2 text-red-500 hover:text-red-650 hover:bg-red-50/10 border border-transparent rounded-lg"
                    aria-label="Delete staff"
                  >
                    {deletingId === member.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: Reports (Manager only) ── */}
      {activeTab === "reports" && isManager && (
        <div className="space-y-8 animate-fadeIn" id="printable-task-report">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-550">
                Total Tugas
              </span>
              <p className="font-display font-extrabold text-3xl text-zinc-900 dark:text-white mt-1">
                {totalTasksCount}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-500">
                Tugas Selesai
              </span>
              <p className="font-display font-extrabold text-3xl text-green-600 dark:text-green-400 mt-1">
                {completedTasksCount}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-amber-500">
                Penyelesaian (%)
              </span>
              <p className="font-display font-extrabold text-3xl text-brand-amber-600 dark:text-brand-amber-400 mt-1">
                {completionRate}%
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-500">
                Terlambat
              </span>
              <p className="font-display font-extrabold text-3xl text-red-600 mt-1">
                {overdueTasksCount}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Task distribution count per status */}
            <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-amber-500" />
                Status Pekerjaan
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Selesai (Completed)", count: completedTasksCount, color: "bg-green-600" },
                  { label: "Sedang Berjalan (In Progress)", count: inProgressTasksCount, color: "bg-brand-amber-600" },
                  { label: "Tertunda (Pending)", count: pendingTasksCount, color: "bg-zinc-400" },
                ].map((stat, idx) => {
                  const pct = totalTasksCount > 0 ? Math.round((stat.count / totalTasksCount) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-650">
                        <span>{stat.label}</span>
                        <span>
                          {stat.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
                        <div style={{ width: `${pct}%` }} className={`h-full ${stat.color} rounded-full`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance staff table */}
            <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-amber-500" />
                  Kinerja Staf Studio
                </h3>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-zinc-500">
                  <thead className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-800">
                    <tr>
                      <th className="py-3">Nama Staff</th>
                      <th className="py-3">Total Tugas</th>
                      <th className="py-3">Selesai</th>
                      <th className="py-3 text-right">Rasio (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {staffStats.map((st, idx) => (
                      <tr key={idx} className="font-medium">
                        <td className="py-3.5 font-bold text-zinc-800 dark:text-zinc-200">{st.name}</td>
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
    </div>
  );
}
