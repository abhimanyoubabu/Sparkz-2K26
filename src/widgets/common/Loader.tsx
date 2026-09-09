"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#F9F6ED]">
      {/* Ambient gold glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 animate-pulse rounded-full bg-[#DEC077]/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-[#E9D39D]/30 blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(222,192,119,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(233,211,157,0.15),transparent_45%)]" />

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
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#DEC077]"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-[#DEC077]/20 via-[#E9D39D]/20 to-[#C19B4C]/15 blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-[#C19B4C]/40"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo reveal */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-[#FAF4E8]/90 border border-[#DEC077]/50 backdrop-blur"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/sparkz.svg"
              alt="Sparkz 2K26"
              width={180}
              height={180}
              className="object-contain drop-shadow-[0_0_25px_rgba(193,155,76,0.3)]"
            />
          </motion.div>
        </div>

        {/* Text */}
        <div className="space-y-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-bold leading-tight sm:text-6xl"
          >
            <span className="bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C] bg-clip-text text-transparent animate-[pulse_6s_ease-in-out_infinite]">
              Sparkz 2K26
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-xl text-[#221F1A]/70"
          >
            Igniting...
          </motion.p>

          {/* Fun spinner bar */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="h-2 w-10 rounded-full bg-gradient-to-r from-[#C19B4C] to-[#DEC077]"
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