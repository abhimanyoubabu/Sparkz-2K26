"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const partners = [
  {
    name: "GrabUrPass",
    category: "Ticketing Partner",
    logo: "/graburpass_brand.png",
    website: "https://www.graburpass.com",
    // description:
    //   "Your trusted platform for seamless event ticketing and registration.",
  },
];

export default function Partners() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <section
      id="partners"
      className="relative isolate overflow-hidden bg-[#04050b] py-16 sm:py-24 text-white"
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

      {/* Content */}
      <div className="relative z-10">
        <div className="px-[5vw]">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur mb-6">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Our Partners
            </div>

            <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Powered by{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>

            <p className="mt-4 text-lg text-indigo-100/60 leading-relaxed max-w-2xl mx-auto">
              We collaborate with industry leaders to bring you the best
              experience.
            </p>
          </motion.div>

          {/* Partners Grid */}
          <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full text-center"
              >
                {/* Category Title */}
                <p className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-6">
                  {partner.category}
                </p>

                {/* Logo Link */}
                <Link
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block group"
                >
                  <div className="relative w-full max-w-md mx-auto h-24 sm:h-32 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Credits Link */}
        </div>
      </div>
    </section>
  );
}
