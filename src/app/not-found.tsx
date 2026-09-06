"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients/Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Glassmorphism Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col items-center relative z-10">
        {/* glitched 404 text effect */}
        <div className="relative mb-6 group">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-500 via-blue-500 to-purple-500 animate-shimmer bg-[length:200%_auto] select-none">
            404
          </h1>
          <div className="absolute top-0 left-0 w-full h-full text-9xl md:text-[12rem] font-bold text-white/5 blur-sm select-none pointer-events-none">
            404
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-unbounded">
          Lost in Hyperspace?
        </h2>

        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The coordinates you entered led to a black hole. Let's get you back to
          solid ground.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-3.5 rounded-xl font-medium transition-all hover:border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none rounded-3xl" />
      </div>
    </div>
  );
}
