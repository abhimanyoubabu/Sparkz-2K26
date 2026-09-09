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
      <div className="min-h-screen bg-[#F9F6ED] text-[#221F1A] flex items-center justify-center relative overflow-hidden">
        {/* Decorative ambient glows (non-interactive) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-6 top-12 h-64 w-64 rounded-full bg-[#DEC077]/20 blur-[120px]" />
          <div className="absolute right-6 bottom-12 h-64 w-64 rounded-full bg-[#E9D39D]/30 blur-[120px]" />
        </div>

        {/* Subtle grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(193,155,76,0.06)_1px,transparent_1px),linear-gradient(rgba(193,155,76,0.06)_1px,transparent_1px)] bg-[size:120px_120px]" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg font-bold text-[#C19B4C]"
        >
          You’re already logged in ✅
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6ED] text-[#221F1A] px-4 flex items-center justify-center relative overflow-hidden border-t border-[#DEC077]/30">
      {/* Decorative ambient glows (non-interactive) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-12 h-64 w-64 rounded-full bg-[#DEC077]/20 blur-[120px]" />
        <div className="absolute right-6 bottom-12 h-64 w-64 rounded-full bg-[#E9D39D]/30 blur-[120px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(193,155,76,0.06)_1px,transparent_1px),linear-gradient(rgba(193,155,76,0.06)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-md bg-[#FAF4E8] backdrop-blur-xl border border-[#DEC077] rounded-3xl shadow-xl p-8 md:p-10 relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 text-2xl font-black bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C] bg-clip-text text-transparent"
        >
          Login
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoginClick}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#E9D39D] border border-[#DEC077] hover:bg-[#dec077] transition-all font-bold text-[#221F1A] shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC077]"
        >
          <FcGoogle size={22} />
          Continue with Google
        </motion.button>

        <p className="text-xs text-[#221F1A]/60 text-center mt-6">
          We use Google only for authentication. No spam, ever.
        </p>
      </motion.div>
    </div>
  );
}
