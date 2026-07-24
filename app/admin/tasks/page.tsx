import React from "react";
import { createClient } from "../../../lib/supabase/server";
import { getStaffMembers, getTasks } from "../../../lib/supabase/helpers";
import { saveStaffMember } from "../../actions/dbActions";
import TasksManager from "./TasksManager";

export default async function AdminTasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const userEmail = user.email.toLowerCase();
  let staff = await getStaffMembers();
  let tasks = await getTasks();

  // Bootstrapping: Auto-insert logged-in user into staff_members table
  let currentStaff = staff.find((s: any) => s.email.toLowerCase() === userEmail);
  const isCeoUser = userEmail === "ceo@arunakarsa.my.id" || userEmail === "it@arunakarsa.my.id";
  const isMainAdmin = userEmail.includes("admin") || isCeoUser;

  if (!currentStaff) {
    const isFirstStaff = staff.length === 0;
    const assignedRole = isCeoUser ? "ceo" : (isFirstStaff || isMainAdmin) ? "manager" : "staff";
    const newStaff = {
      email: user.email,
      name: user.email.split("@")[0].toUpperCase(),
      role: assignedRole,
    };
    
    const res = await saveStaffMember(newStaff);
    if (!res.error) {
      staff = await getStaffMembers();
      currentStaff = staff.find((s: any) => s.email.toLowerCase() === userEmail);
    }
  } else if (isCeoUser && currentStaff.role !== "ceo") {
    // Automatically upgrade CEO / IT user to CEO role if not set
    currentStaff.role = "ceo";
    const res = await saveStaffMember(currentStaff);
    if (!res.error) {
      staff = await getStaffMembers();
      currentStaff = staff.find((s: any) => s.email.toLowerCase() === userEmail);
    }
  } else if (isMainAdmin && currentStaff.role !== "manager" && currentStaff.role !== "ceo") {
    // Automatically upgrade admin user to manager if they are registered as staff
    currentStaff.role = "manager";
    const res = await saveStaffMember(currentStaff);
    if (!res.error) {
      staff = await getStaffMembers();
      currentStaff = staff.find((s: any) => s.email.toLowerCase() === userEmail);
    }
  }

  return (
    <TasksManager
      currentUser={user}
      currentStaff={currentStaff || { email: user.email, name: user.email.split("@")[0].toUpperCase(), role: "staff" }}
      initialStaff={staff}
      initialTasks={tasks}
    />
  );
}
