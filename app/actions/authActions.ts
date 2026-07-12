"use server";

import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(state: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function signUp(state: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Semua field wajib diisi." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Call the Security Definer RPC to check if the email is pre-authorized
  const { data: isPreauthorized, error: rpcError } = await supabase.rpc(
    "is_email_preauthorized",
    { email_to_check: email }
  );

  if (rpcError) {
    return { error: `Gagal memverifikasi email: ${rpcError.message}` };
  }

  if (!isPreauthorized) {
    return {
      error: "Email Anda belum terdaftar sebagai staf. Silakan hubungi manajer studio untuk didaftarkan.",
    };
  }

  // Register user via Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/admin`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Check if session is established directly
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/admin");
  } else {
    // If confirmation email is required
    return {
      success: true,
      message: "Pendaftaran berhasil! Silakan periksa email Anda untuk memverifikasi akun sebelum masuk ke dashboard.",
    };
  }
}

export async function forgotPassword(state: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email wajib diisi." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "Tautan atur ulang kata sandi berhasil dikirim! Silakan periksa kotak masuk email Anda.",
  };
}

export async function resetPassword(state: any, formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Semua field kata sandi wajib diisi." };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi kata sandi tidak cocok." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  // Revalidate and redirect to login with a success parameter
  revalidatePath("/", "layout");
  redirect("/admin/login?message=Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda.");
}
