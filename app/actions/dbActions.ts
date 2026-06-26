"use server";

import { createClient } from "../../lib/supabase/server";
import { seedDatabase } from "../../lib/supabase/seed";
import { revalidatePath } from "next/cache";

// Seeding DB helper
export async function triggerSeed() {
  const supabase = await createClient();
  const res = await seedDatabase(supabase);
  if (res.success) {
    revalidatePath("/", "layout");
  }
  return res;
}

// Site Config
export async function updateSiteConfig(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_config")
    .upsert({ id: 1, ...data });

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// Page Configurations
export async function updatePageConfig(pageName: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update(data)
    .eq("page_name", pageName);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// Services CRUD
export async function saveService(service: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .upsert(service);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// Portfolio CRUD
export async function saveProject(project: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio")
    .upsert(project);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// Blog Posts CRUD
export async function saveBlogPost(post: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .upsert(post);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// Image Upload to Supabase Storage
export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file uploaded" };
    }

    const supabase = await createClient();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("aruna-assets")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = supabase.storage.from("aruna-assets").getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { error: err.message || "Upload failed" };
  }
}

// Helper: fire Discord notification (non-blocking, best-effort)
async function sendDiscordNotification(type: string, data: Record<string, any>) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
  } catch {
    // Silently fail — notification is best-effort
  }
}

// Contact Form Submission
export async function submitContactForm(data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) {
  const supabase = await createClient();

  // Save to Supabase
  const { error } = await supabase.from("contact_submissions").insert({
    name: data.name,
    email: data.email,
    subject: data.projectType,
    message: data.message,
  });

  if (error) {
    console.error("Failed to save contact submission:", error.message);
    // Don't block — still try to notify
  }

  // Send Discord notification
  await sendDiscordNotification("contact", data);

  return { success: true };
}

// Review Submission
export async function submitReview(data: {
  name: string;
  rating: number;
  message: string;
}) {
  const supabase = await createClient();

  // Save to Supabase
  const { error } = await supabase.from("reviews").insert({
    name: data.name,
    rating: data.rating,
    message: data.message,
    is_published: false, // requires admin approval
  });

  if (error) {
    console.error("Failed to save review:", error.message);
  }

  // Send Discord notification
  await sendDiscordNotification("review", data);

  return { success: true };
}

// Get contact submissions (admin only)
export async function getContactSubmissions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch contact submissions:", error.message);
    return { error: error.message };
  }
  return { data };
}

// Delete contact submission (admin only)
export async function deleteContactSubmission(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete contact submission:", error.message);
    return { error: error.message };
  }
  revalidatePath("/admin/contacts");
  revalidatePath("/admin");
  return { success: true };
}

// Active Projects CRUD (admin only)
export async function saveActiveProject(project: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("active_projects")
    .upsert(project);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteActiveProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("active_projects")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// Invoices CRUD (admin only)
export async function saveInvoice(invoice: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .upsert(invoice);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function sendInvoiceReminderAction(id: string) {
  const supabase = await createClient();
  
  // Fetch current reminder count
  const { data: invoice, error: fetchError } = await supabase
    .from("invoices")
    .select("reminders_sent, client_name, invoice_number")
    .eq("id", id)
    .single();

  if (fetchError) return { error: fetchError.message };

  const newRemindersCount = (invoice?.reminders_sent || 0) + 1;

  const { error: updateError } = await supabase
    .from("invoices")
    .update({ reminders_sent: newRemindersCount })
    .eq("id", id);

  if (updateError) return { error: updateError.message };
  
  return { success: true, count: newRemindersCount };
}


