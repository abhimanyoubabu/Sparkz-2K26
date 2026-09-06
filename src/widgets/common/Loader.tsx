"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#04050b]">
      {/* Ambient glows & circuits - same as Hero */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 animate-pulse rounded-full bg-indigo-600/30 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-fuchsia-500/30 blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px]" />
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0.15)_1px,transparent_1px),linear-gradient(0deg,rgba(94,234,212,0.1)_1px,transparent_1px)] bg-[size:160px_160px]" />
      </div>

      {/* Floating spark chips - playful energy! */}
      {[
        { x: "-left-10 top-20", color: "cyan" },
        { x: "right-20 top-40", color: "fuchsia" },
        { x: "left-1/3 bottom-32", color: "amber" },
        { x: "right-1/3 bottom-10", color: "emerald" },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute h-8 w-8 rounded-lg border border-${pos.color}-300/50 bg-${pos.color}-400/20 blur-sm ${pos.x}`}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Central loading magic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-8"
      >
        {/* Glowing orb spinner with logo */}
        <div className="relative h-64 w-64">
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-fuchsia-400/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/20 to-amber-400/15 blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-300/30"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo reveal */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/sparkz.svg"
              alt="Sparkz 2K26"
              width={180}
              height={180}
              className="object-contain drop-shadow-[0_0_40px_rgba(236,72,153,0.6)]"
            />
          </motion.div>
        </div>

        {/* Text hype */}
        <div className="space-y-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-bold leading-tight sm:text-6xl"
          >
            <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent animate-[pulse_6s_ease-in-out_infinite]">
              Sparkz &apos;25
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl text-white/70"
          >
            Igniting in...
          </motion.p>

          {/* Fun spinner bar */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="h-2 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                animate={{
                  scaleY: [1, 1.8, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}