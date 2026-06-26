import React from "react";
import { createClient } from "../../../lib/supabase/server";
import ActiveProjectsForm from "./ActiveProjectsForm";

export default async function AdminActiveProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("active_projects")
    .select("*")
    .order("created_at", { ascending: false });

  return <ActiveProjectsForm initialProjects={projects || []} />;
}
