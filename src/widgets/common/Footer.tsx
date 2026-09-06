"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#04050b] border-t border-white/8">
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

      <div className="relative px-[5vw] py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-16">
          {/* Logo & quick details */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/sparkz.svg"
                  alt="Sparkz logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300">
                  Sparkz 2K26
                </h4>
                <p className="mt-1 text-xs text-white/60">
                  October 08–09 • Campus Arena
                </p>
              </div>
            </motion.div>

            <p className="max-w-sm text-sm text-white/40">
              A vibrant tech fest for students — challenges, workshops, and
              prizes for tomorrow&apos;s makers.
            </p>
          </div>

          {/* Quick links: grouped and accessible */}
          <nav aria-label="Quick links">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">
              Quick Links
            </h3>

            <ul className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-1 md:grid-cols-1">
              {[
                ["Home", "/"],
                ["Events", "/events"],
                ["ABHERI", "/abheri"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href as string}
                    className="text-white/60 hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 rounded-sm px-1 py-0.5"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials with clear icons and labels */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">
              Join the Circuit
            </h3>

            <div className="flex items-center gap-4">
              {/* Instagram */}
              <Link
                href="#"
                className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-white/80 transition-all hover:text-[#E4405F] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/40"
                aria-label="Instagram"
              >
                <FaInstagram
                  className="h-6 w-6 transition-colors"
                  aria-hidden
                />
                <span className="sr-only">Instagram</span>
              </Link>

              {/* LinkedIn */}
              <Link
                href="#"
                className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-white/80 transition-all hover:text-[#0A66C2] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-6 w-6 transition-colors" aria-hidden />
                <span className="sr-only">LinkedIn</span>
              </Link>

              {/* X / Twitter */}
              <Link
                href="#"
                className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-white/80 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
                aria-label="Twitter"
              >
                <FaXTwitter className="h-6 w-6 transition-colors" aria-hidden />
                <span className="sr-only">X</span>
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/40 max-w-xs">
              Follow us for event updates, behind-the-scenes, and shoutouts.
            </p>
          </div>

          {/* Call to action */}
          <div className="md:flex md:flex-col md:items-end">
            <div>
              <p className="mb-4 text-sm text-white/60">
                Ready to do something that sparks?
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="#register"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
                >
                  Join Now →
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom tiny legal bar */}
        <div className="mt-10 border-t border-white/8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              Terms • Privacy • Code of Conduct
            </p>
            <div className="text-xs text-white/40 text-center md:text-right">
              <p>© 2026 Sparkz.</p>
              <p className="mt-1">
                Crafted with ♥ by the {" "}
                <Link
                  href="/credits"
                  className="text-white/70 hover:text-white transition-all duration-300 font-semibold hover:underline decoration-dotted underline-offset-2 animate-pulse hover:animate-none"
                >
                  Tech Team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
