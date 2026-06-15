import React from "react";
import { createClient } from "../../../lib/supabase/server";
import PortfolioForm from "./PortfolioForm";

export default async function AdminPortfolioPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });

  return <PortfolioForm initialProjects={projects || []} />;
}
