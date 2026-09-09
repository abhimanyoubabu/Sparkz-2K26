"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#FAF4E8] border-t border-[#DEC077]/50">
      {/* Decorative ambient glows (non-interactive) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-12 h-64 w-64 rounded-full bg-[#DEC077]/20 blur-[120px]" />
        <div className="absolute right-6 bottom-12 h-64 w-64 rounded-full bg-[#E9D39D]/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(222,192,119,0.12),transparent_50%)]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(193,155,76,0.1)_1px,transparent_1px),linear-gradient(rgba(193,155,76,0.08)_1px,transparent_1px)] bg-[size:120px_120px]" />
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
                  className="object-contain drop-shadow-[0_0_10px_rgba(193,155,76,0.25)]"
                  priority
                />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C]">
                  Sparkz 2K26
                </h4>
                <p className="mt-1 text-xs text-[#221F1A]/70">
                  October 08–09 • Campus Arena
                </p>
              </div>
            </motion.div>

            <p className="max-w-sm text-sm text-[#221F1A]/70">
              A vibrant tech fest for students — challenges, workshops, and
              prizes for tomorrow&apos;s makers.
            </p>
          </div>

          {/* Quick links: grouped and accessible */}
          <nav aria-label="Quick links">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#C19B4C]">
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
                    className="text-[#221F1A]/75 hover:text-[#C19B4C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC077] rounded-sm px-1 py-0.5"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials with clear icons and labels */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#C19B4C]">
              Join the Circuit
            </h3>

            <div className="flex items-center gap-4">
              {/* Instagram */}
              <Link
                href="#"
                className="group inline-flex items-center gap-2 rounded-full p-2.5 border border-[#DEC077]/40 bg-[#FAF4E8] text-[#221F1A]/80 transition-all hover:text-[#C19B4C] hover:border-[#DEC077] hover:scale-110 focus:outline-none"
                aria-label="Instagram"
              >
                <FaInstagram
                  className="h-5 w-5 transition-colors"
                  aria-hidden
                />
                <span className="sr-only">Instagram</span>
              </Link>

              {/* LinkedIn */}
              <Link
                href="#"
                className="group inline-flex items-center gap-2 rounded-full p-2.5 border border-[#DEC077]/40 bg-[#FAF4E8] text-[#221F1A]/80 transition-all hover:text-[#C19B4C] hover:border-[#DEC077] hover:scale-110 focus:outline-none"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5 transition-colors" aria-hidden />
                <span className="sr-only">LinkedIn</span>
              </Link>

              {/* X / Twitter */}
              <Link
                href="#"
                className="group inline-flex items-center gap-2 rounded-full p-2.5 border border-[#DEC077]/40 bg-[#FAF4E8] text-[#221F1A]/80 transition-all hover:text-[#C19B4C] hover:border-[#DEC077] hover:scale-110 focus:outline-none"
                aria-label="Twitter"
              >
                <FaXTwitter className="h-5 w-5 transition-colors" aria-hidden />
                <span className="sr-only">X</span>
              </Link>
            </div>

            <p className="mt-4 text-sm text-[#221F1A]/60 max-w-xs">
              Follow us for event updates, behind-the-scenes, and shoutouts.
            </p>
          </div>

          {/* Call to action */}
          <div className="md:flex md:flex-col md:items-end">
            <div>
              <p className="mb-4 text-sm text-[#221F1A]/70">
                Ready to do something that sparks?
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E9D39D] hover:bg-[#DEC077] border border-[#DEC077] px-6 py-2.5 text-sm font-bold text-[#221F1A] shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C19B4C]"
                >
                  Join Now →
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="mt-10 border-t border-[#DEC077]/40 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#221F1A]/60">
              Terms • Privacy • Code of Conduct
            </p>
            <div className="text-xs text-[#221F1A]/60 text-center md:text-right">
              <p>© 2026 Sparkz.</p>
              <p className="mt-1">
                Crafted with ♥ by the <Link href="/credits" className="text-[#C19B4C] hover:text-[#221F1A] transition-all duration-300 font-semibold decoration-dotted underline-offset-2">Tech Team</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
