"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F6ED] text-[#221F1A] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients/Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#DEC077]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#E9D39D]/30 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Glassmorphism Card */}
      <div className="bg-[#FAF4E8] backdrop-blur-xl border border-[#DEC077] p-12 rounded-3xl shadow-xl max-w-2xl w-full flex flex-col items-center relative z-10">
        {/* 404 text effect */}
        <div className="relative mb-6 group">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C] select-none">
            404
          </h1>
          <div className="absolute top-0 left-0 w-full h-full text-9xl md:text-[12rem] font-black text-[#DEC077]/10 blur-sm select-none pointer-events-none">
            404
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#221F1A] font-unbounded">
          Lost Your Way?
        </h2>

        <p className="text-[#221F1A]/70 text-lg mb-10 max-w-md mx-auto leading-relaxed font-medium">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-[#E9D39D] text-[#221F1A] border border-[#DEC077] hover:bg-[#dec077] px-8 py-3.5 rounded-full font-bold transition-all shadow-md transform hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5 text-[#C19B4C]" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-transparent hover:bg-[#E9D39D]/30 text-[#221F1A] border border-[#DEC077] px-8 py-3.5 rounded-full font-semibold transition-all shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-[#C19B4C]" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
