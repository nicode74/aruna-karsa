import React from "react";
import { createClient } from "../../../lib/supabase/server";
import ContactsList from "./ContactsList";

export default async function AdminContactsPage() {
  const supabase = await createClient();

  const { data: contacts, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to query contact submissions:", error.message);
  }

  return <ContactsList initialContacts={contacts || []} />;
}
