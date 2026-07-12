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

  let staff = await getStaffMembers();
  let tasks = await getTasks();

  // Bootstrapping: Auto-insert logged-in admin user into staff_members table
  let currentStaff = staff.find((s: any) => s.email === user.email);
  if (!currentStaff) {
    const isFirstStaff = staff.length === 0;
    const newStaff = {
      email: user.email,
      name: user.email.split("@")[0].toUpperCase(),
      role: isFirstStaff ? "manager" : "staff",
    };
    
    const res = await saveStaffMember(newStaff);
    if (!res.error) {
      staff = await getStaffMembers();
      currentStaff = staff.find((s: any) => s.email === user.email);
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
