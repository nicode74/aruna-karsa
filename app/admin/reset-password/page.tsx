"use client";

import React, { useActionState } from "react";
import Image from "next/image";
import { resetPassword } from "../../actions/authActions";
import { KeyRound, Loader2 } from "lucide-react";

export default function AdminResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPassword, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 py-12 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-brand-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] aspect-square rounded-full bg-brand-amber-600/10 dark:bg-brand-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Reset Password Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="relative h-12 w-48 mx-auto mb-4">
              <Image
                src="/logo/logo-horizontal.png"
                alt="Aruna Karsa Logo"
                fill
                className="object-contain dark:brightness-200 dark:contrast-200"
                priority
              />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-zinc-900 dark:text-white">
              Atur Ulang Kata Sandi
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Masukkan kata sandi baru untuk akun admin/staf Anda
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-sm text-red-600 dark:text-red-400 font-semibold text-center animate-fadeIn">
                {state.error}
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                Kata Sandi Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Buat kata sandi baru"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 dark:focus:border-brand-amber-500 focus:ring-1 focus:ring-brand-amber-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-brand-amber-500 dark:focus:border-brand-amber-500 focus:ring-1 focus:ring-brand-amber-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-zinc-900 hover:bg-brand-amber-600 active:bg-brand-amber-700 dark:bg-zinc-100 dark:hover:bg-brand-amber-500 dark:active:bg-brand-amber-600 dark:text-zinc-900 text-white font-bold text-sm rounded-xl tracking-wide uppercase transition-all shadow-md shadow-zinc-950/10 dark:shadow-white/5 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Kata Sandi"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
