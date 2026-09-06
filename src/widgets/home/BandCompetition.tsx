"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const accentGradient =
  "bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/25 to-amber-400/25";

const eventPoints = [
  {
    title: "Epic Performances",
    body: "Showcase your band's talent in a high-energy competition with live audiences and professional judging.",
  },
  {
    title: "Lucrative Prizes",
    body: "Compete for ₹30,000 (1st), ₹20,000 (2nd), and ₹10,000 (3rd) – plus certificates and glory!",
  },
  {
    title: "Easy Registration",
    body: "Teams of 6-10 members: Just ₹1,000 fee. Date: 8 October 2026. Register now!",
  },
];

const guests = [
  {
    name: "Manjari",
    role: "Playback Singer | Composer",
    image: "/manjari.png",
    tag: "Chief Guest & Judge",
  },
  {
    name: "Sudashan",
    role: "Playback Singer",
    image: "/sudarshan.jpg",
    tag: "Competition Judge",
  },
];

export default function BandCompetition() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <section
      id="band-competition"
      className="relative isolate overflow-hidden bg-[#04050b] pt-10 pb-20 text-white sm:py-24"
    >
      {/* Background Effects */}
      {mounted && (
        <>
          {/* Gradient Glows */}
          <div className="pointer-events-none absolute left-[-10%] top-[20%] h-96 w-96 rounded-full bg-indigo-600/20 blur-[140px]" />
          <div className="hidden sm:block pointer-events-none absolute right-[-5%] top-[30%] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[150px]" />

          {/* Subtle Grid Pattern */}
          <div className="hidden sm:block pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px] opacity-30" />

          {/* Radial Gradients */}
          <div className="hidden sm:block pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(79,70,229,0.1),transparent_50%),radial-gradient(circle_at_60%_60%,rgba(236,72,153,0.08),transparent_45%)]" />
        </>
      )}

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="mx-auto max-w-336">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Content + Highlights */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  ABHERI -{" "}
                  <span className="text-[9px]">Music Band Competition</span>
                </div>

                <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Rock the Stage
                  <br />
                  <span className="bg-linear-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                    with ABHERI
                  </span>
                </h2>

                <p className="mt-4 text-lg text-indigo-100/60 leading-relaxed max-w-xl">
                  Unleash your rhythm, captivate the crowd, and battle for glory
                  in the ultimate inter-college band showdown.
                </p>
              </div>

              {/* Highlights Grid (Now on Left) */}
              <div className="grid sm:grid-cols-2 gap-4">
                {eventPoints.map((point, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 ${
                      i === 2 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                        {i + 1}
                      </div>
                      <h3 className="font-bold text-indigo-100">
                        {point.title}
                      </h3>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed pl-9">
                      {point.body}
                    </p>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="pt-2"
              >
                <Link
                  href="/abheri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-amber-400/20 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white/90 backdrop-blur hover:border-white/30 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  View More & Register
                  <span className="text-xs">→</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: Guest Spotlights (Grid/Stacked) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative ml-auto w-full grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 items-start"
            >
              {guests.map((guest, index) => (
                <div
                  key={index}
                  className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden group"
                >
                  {/* Decorative background */}
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10 opacity-50" />

                  <div className="relative p-2 sm:p-4">
                    <div className="relative w-full aspect-4/5 overflow-hidden rounded-2xl bg-slate-900/50">
                      <Image
                        src={guest.image}
                        alt={guest.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Stronger gradient overlay to create space for text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#04050b] via-[#04050b]/80 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <div className="inline-block px-3 py-1 mb-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
                          <span className="text-indigo-200 text-[10px] font-bold tracking-widest uppercase">
                            {guest.tag}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight">
                          {guest.name}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-white/80 font-normal">
                          {guest.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
