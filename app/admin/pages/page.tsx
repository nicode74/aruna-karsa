import React from "react";
import { createClient } from "../../../lib/supabase/server";
import PagesForm from "./PagesForm";

export default async function AdminPagesPage() {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("page_name", { ascending: true });

  return <PagesForm initialPages={pages || []} />;
}
