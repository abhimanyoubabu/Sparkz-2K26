"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Code, Coffee, Heart } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

const techTeam = [
  {
    name: "Abhishek Santhosh",
    role: "Full Stack Developer",
    linkedin: "https://www.linkedin.com/in/abhishek-santhosh",
  },
  {
    name: "Joel Joy",
    role: "Full Stack Developer",
    linkedin: "https://www.linkedin.com/in/joeljoy123/",
  },
];

export default function CreditsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Credits - Tech Team | Sparkz &apos;26</title>
        <meta
          name="description"
          content="Meet the talented developers behind Sparkz 2K26 platform. Built with passion by Abhishek Santhosh and Joel Joy."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-[#04050b] text-white">
        {/* Background Effects */}
        {mounted && (
          <>
            <div className="pointer-events-none fixed inset-0">
              <div className="absolute left-[-10%] top-[10%] h-96 w-96 rounded-full bg-indigo-600/25 blur-[140px]" />
              <div className="absolute right-[-5%] top-[30%] h-96 w-96 rounded-full bg-fuchsia-500/25 blur-[150px]" />
              <div className="absolute left-[20%] bottom-[10%] h-96 w-96 rounded-full bg-amber-400/20 blur-[140px]" />
            </div>

            {/* Grid Pattern */}
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30" />

            {/* Radial Gradients */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(79,70,229,0.1),transparent_50%),radial-gradient(circle_at_60%_60%,rgba(236,72,153,0.08),transparent_45%)]" />

            {/* Floating Code Symbols */}
            {[
              { className: "right-[15%] top-[15%] h-8 w-8", delay: 0 },
              { className: "left-[10%] top-[60%] h-10 w-10", delay: 0.5 },
              { className: "right-[20%] bottom-[20%] h-6 w-6", delay: 1 },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`pointer-events-none absolute ${item.className} rounded-lg border border-indigo-300/30 bg-indigo-400/10 blur-[1px]`}
                animate={{ y: [-10, 15, -10], rotate: [-5, 5, -5] }}
                transition={{
                  duration: 8 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
              >
                <Code className="w-full h-full p-1 text-indigo-300/50" />
              </motion.div>
            ))}
          </>
        )}

        {/* Content */}
        <div className="relative z-10 px-[5vw] py-20 sm:py-32">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur mb-6">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Crafted With Passion
              </div>

              <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
                Meet the{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                  Tech Team
                </span>
              </h1>

              <p className="mt-6 text-lg text-indigo-100/60 leading-relaxed max-w-2xl mx-auto">
                The brilliant minds who transformed ideas into reality, one line
                of code at a time.
              </p>

              {/* Fun Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <Coffee className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                  <p className="text-2xl font-black text-white">∞</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">
                    Cups of Coffee
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <Code className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                  <p className="text-2xl font-black text-white">10K+</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">
                    Lines of Code
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <Heart className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">
                    Made with Love
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {techTeam.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="group"
                >
                  <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

                    {/* Animated Border Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-amber-400/30 blur-xl" />
                    </div>

                    <div className="relative p-8 sm:p-10">
                      {/* Role Badge */}
                      <div className="inline-block px-4 py-2 mb-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-md">
                        <span className="text-cyan-200 text-xs font-bold tracking-widest uppercase">
                          {member.role}
                        </span>
                      </div>

                      {/* Name */}
                      <h2 className="text-3xl font-black text-white mb-6 tracking-tight">
                        {member.name}
                      </h2>

                      {/* LinkedIn Link */}
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-white hover:bg-[#0A66C2]/30 hover:border-[#0A66C2]/50 transition-all duration-300 group/link"
                      >
                        <Linkedin className="w-5 h-5 text-[#0A66C2] group-hover/link:scale-110 transition-transform" />
                        <span className="font-semibold">
                          Connect on LinkedIn
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech Stack Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden mb-16"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-indigo-500/10 opacity-50" />

              <div className="relative p-8 sm:p-10 text-center">
                <h2 className="text-2xl font-black text-white mb-4 tracking-tight">
                  Built With Modern Tech
                </h2>
                <p className="text-white/60 mb-6">
                  Next.js • React • TypeScript • Firebase • Tailwind CSS •
                  Framer Motion
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    "Next.js",
                    "React",
                    "TypeScript",
                    "Firebase",
                    "Tailwind",
                    "Framer Motion",
                  ].map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-amber-400/20 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white/90 backdrop-blur hover:border-white/30 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="text-xs">←</span>
                Back to Home
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
