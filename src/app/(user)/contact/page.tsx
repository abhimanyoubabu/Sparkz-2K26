"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, User } from "lucide-react";
import Head from "next/head";

const coordinators = [
  {
    role: "Staff Coordinator",
    name: "Mr. Vipin G. Namboothiri",
    phone: "+91 97447 64927",
    email: "vipin@example.com", // Add actual email if available
  },
  {
    role: "Student Coordinator",
    name: "Abhilash Chandran J",
    phone: "+91 87148 38918",
    email: "abhilash@example.com", // Add actual email if available
  },
];

const contactInfo = {
  address: "Carmel College of Engineering & Technology, Kerala, India",
  generalEmail: "info@sparkz.carmelcet.in",
  website: "sparkz.carmelcet.in",
};

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>
          Contact Us - Sparkz &apos;26 | Carmel College of Engineering &
          Technology
        </title>
        <meta
          name="description"
          content="Get in touch with Sparkz 2K26 coordinators. Contact Mr. Vipin G. Namboothiri (Staff Coordinator) at +91 97447 64927 or Abhilash Chandran J (Student Coordinator) at +91 87148 38918 for event information, registrations, and inquiries."
        />
        <meta
          name="keywords"
          content="Sparkz contact, Sparkz 2K26 contact, Carmel College tech fest contact, event coordinators, Sparkz registration help, tech fest Kerala contact, Vipin G Namboothiri, Abhilash Chandran J, Carmel College events, college fest contact, event inquiry, Sparkz support, tech fest coordinators, ABHERI contact, band competition contact"
        />
        <meta name="author" content="Sparkz 2K26 Team" />
        <link rel="canonical" href="https://sparkz.carmelcet.in/contact" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sparkz.carmelcet.in/contact" />
        <meta
          property="og:title"
          content="Contact Sparkz 2K26 - Get Event Information & Support"
        />
        <meta
          property="og:description"
          content="Reach out to our coordinators for Sparkz 2K26 event details, registrations, and support. Staff Coordinator: Mr. Vipin G. Namboothiri | Student Coordinator: Abhilash Chandran J"
        />
        <meta
          property="og:image"
          content="https://sparkz.carmelcet.in/sparkz.svg"
        />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Sparkz 2K26" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://sparkz.carmelcet.in/contact"
        />
        <meta
          name="twitter:title"
          content="Contact Sparkz 2K26 - Event Coordinators"
        />
        <meta
          name="twitter:description"
          content="Get in touch with Sparkz 2K26 coordinators for event information and support. Contact us today!"
        />
        <meta
          name="twitter:image"
          content="https://sparkz.carmelcet.in/sparkz.svg"
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Contact Information for Search Engines */}
        <meta name="contact:phone:staff" content="+91 97447 64927" />
        <meta name="contact:phone:student" content="+91 87148 38918" />
        <meta name="contact:email" content="info@sparkz.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Sparkz 2K26 Contact Page",
              description:
                "Contact information for Sparkz 2K26 tech fest coordinators",
              url: "https://sparkz.carmelcet.in/contact",
              mainEntity: {
                "@type": "Organization",
                name: "Sparkz 2K26 - Carmel College of Engineering & Technology",
                url: "https://sparkz.carmelcet.in",
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+91-97447-64927",
                    contactType: "Staff Coordinator",
                    name: "Mr. Vipin G. Namboothiri",
                    areaServed: "IN",
                    availableLanguage: ["English", "Malayalam"],
                  },
                  {
                    "@type": "ContactPoint",
                    telephone: "+91-87148-38918",
                    contactType: "Student Coordinator",
                    name: "Abhilash Chandran J",
                    areaServed: "IN",
                    availableLanguage: ["English", "Malayalam"],
                  },
                ],
              },
            }),
          }}
        />
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
          </>
        )}

        {/* Content */}
        <div className="relative z-10 px-6 py-20 sm:py-32">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Get in Touch
              </div>

              <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
                For more{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                  info
                </span>
              </h1>

              <p className="mt-6 text-lg text-indigo-100/60 leading-relaxed max-w-2xl mx-auto">
                Have questions? Our coordinators are here to help. Reach out to
                us anytime!
              </p>
            </motion.div>

            {/* Coordinators Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {coordinators.map((coordinator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
                      <div className="inline-block px-4 py-2 mb-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
                        <span className="text-indigo-200 text-xs font-bold tracking-widest uppercase">
                          {coordinator.role}
                        </span>
                      </div>

                      {/* Name */}
                      <div className="flex items-start gap-3 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10">
                          <User className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-tight">
                            {coordinator.name}
                          </h3>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-4">
                        {/* Phone */}
                        <a
                          href={`tel:${coordinator.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group/link"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/link:bg-emerald-500/20 transition-colors">
                            <Phone className="w-5 h-5 text-emerald-400" />
                          </div>
                          <span className="text-lg font-semibold">
                            {coordinator.phone}
                          </span>
                        </a>

                        {/* Email */}
                        <a
                          href={`mailto:${coordinator.email}`}
                          className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group/link"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 group-hover/link:bg-fuchsia-500/20 transition-colors">
                            <Mail className="w-5 h-5 text-fuchsia-400" />
                          </div>
                          <span className="text-sm">{coordinator.email}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-indigo-500/10 opacity-50" />

              <div className="relative p-8 sm:p-10">
                <h2 className="text-2xl font-black text-white mb-8 tracking-tight">
                  General Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <MapPin className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-1">
                        Location
                      </h3>
                      <p className="text-white/90">{contactInfo.address}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                      <Mail className="w-5 h-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-1">
                        General Email
                      </h3>
                      <a
                        href={`mailto:${contactInfo.generalEmail}`}
                        className="text-white/90 hover:text-white transition-colors"
                      >
                        {contactInfo.generalEmail}
                      </a>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <svg
                        className="w-5 h-5 text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-1">
                        Website
                      </h3>
                      <p className="text-white/90">{contactInfo.website}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 text-center"
            >
              <p className="text-white/60 mb-6">
                Ready to be part of Sparkz &apos;26?
              </p>
              <a
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-amber-400/20 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white/90 backdrop-blur hover:border-white/30 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Events
                <span className="text-xs">→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
