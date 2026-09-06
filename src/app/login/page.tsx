"use client";

import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/utils/common/Toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user, login, loading: authLoading, refetchUserProfile } = useAuth();
  const router = useRouter();

  const handleLoginClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await login();
      toastSuccess("Successfully logged in!");
      router.back();
    } catch (error) {
      toastError("Failed to login.");
    }
  };

  useEffect(() => {
    if (user) {
    //   toastError("Please login to register for Abheri");
      router.push("/abheri/register");
    }
  }, [user, authLoading, router]);

  if (user) {
    return (
      <div className="min-h-screen bg-[#04050b] text-white flex items-center justify-center relative overflow-hidden">
        {/* Decorative ambient glows (non-interactive) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-6 top-12 h-64 w-64 rounded-full bg-indigo-600/18 blur-[120px]" />
          <div className="absolute right-6 bottom-12 h-64 w-64 rounded-full bg-fuchsia-600/18 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.12),transparent_50%)]" />
        </div>

        {/* Subtle grid overlay for the 'circuit' feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-12"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(rgba(56,189,248,0.04)_1px,transparent_1px)] bg-[size:120px_120px]" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg font-medium text-green-400"
        >
          You’re already logged in ✅
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04050b] text-white px-4 flex items-center justify-center relative overflow-hidden border-t border-white/8">
      {/* Decorative ambient glows (non-interactive) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-12 h-64 w-64 rounded-full bg-indigo-600/18 blur-[120px]" />
        <div className="absolute right-6 bottom-12 h-64 w-64 rounded-full bg-fuchsia-600/18 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.12),transparent_50%)]" />
      </div>

      {/* Subtle grid overlay for the 'circuit' feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-12"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(rgba(56,189,248,0.04)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300"
        >
          Login
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoginClick}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-amber-400/20 border border-white/10 hover:from-indigo-500/30 hover:via-fuchsia-500/30 hover:to-amber-400/30 transition-all font-semibold text-white active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
        >
          <FcGoogle size={22} />
          Continue with Google
        </motion.button>

        <p className="text-xs text-white/40 text-center mt-6">
          We use Google only for authentication. No spam, ever.
        </p>
      </motion.div>
    </div>
  );
}
