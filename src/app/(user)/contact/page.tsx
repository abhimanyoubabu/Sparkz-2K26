"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, User } from "lucide-react";
import Head from "next/head";

const coordinators = [
  {
    role: "Staff Coordinator",
    name: "Dr. Kannan C. Bhanu",
    phone: "+91 94963 31267",
    email: "[EMAIL_ADDRESS]",
  },
  {
    role: "Student Coordinator",
    name: "Mr. Steev Palliath",
    phone: "+91 62358 34190",
    email: "[EMAIL_ADDRESS]",
  },
];

const contactInfo = {
  address: "Carmel College of Engineering & Technology, Kerala, India",
  generalEmail: "sparkz@carmelcet.in",
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

      <div className="min-h-screen bg-[#F9F6ED] text-[#221F1A]">
        {/* Background Effects */}
        {mounted && (
          <>
            <div className="pointer-events-none fixed inset-0">
              <div className="absolute left-[-10%] top-[10%] h-96 w-96 rounded-full bg-[#DEC077]/20 blur-[140px]" />
              <div className="absolute right-[-5%] top-[30%] h-96 w-96 rounded-full bg-[#E9D39D]/30 blur-[150px]" />
              <div className="absolute left-[20%] bottom-[10%] h-96 w-96 rounded-full bg-[#C19B4C]/15 blur-[140px]" />
            </div>

            {/* Grid Pattern */}
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(193,155,76,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(193,155,76,0.06)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40" />

            {/* Radial Gradients */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(222,192,119,0.1),transparent_50%),radial-gradient(circle_at_60%_60%,rgba(233,211,157,0.15),transparent_45%)]" />
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
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DEC077] bg-[#E9D39D] px-4 py-2 text-[13px] font-bold uppercase tracking-widest text-[#221F1A] shadow-xs mb-6">
                <span className="h-2 w-2 rounded-full bg-[#C19B4C] animate-pulse" />
                Get in Touch
              </div>

              <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl text-[#221F1A]">
                For more{" "}
                <span className="bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C] bg-clip-text text-transparent">
                  info
                </span>
              </h1>

              <p className="mt-6 text-lg text-[#221F1A]/70 leading-relaxed max-w-2xl mx-auto">
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
                  <div className="relative rounded-3xl border border-[#DEC077] bg-[#FAF4E8] backdrop-blur overflow-hidden hover:border-[#C19B4C] transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#DEC077]/10 via-transparent to-[#E9D39D]/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Animated Border Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#DEC077]/20 via-[#E9D39D]/30 to-[#DEC077]/20 blur-xl" />
                    </div>

                    <div className="relative p-8 sm:p-10">
                      {/* Role Badge */}
                      <div className="inline-block px-4 py-2 mb-6 rounded-lg bg-[#E9D39D] border border-[#DEC077]">
                        <span className="text-[#221F1A] text-xs font-bold tracking-widest uppercase">
                          {coordinator.role}
                        </span>
                      </div>

                      {/* Name */}
                      <div className="flex items-start gap-3 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#E9D39D]/50 flex items-center justify-center border border-[#DEC077]">
                          <User className="w-6 h-6 text-[#C19B4C]" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-[#221F1A] tracking-tight">
                            {coordinator.name}
                          </h3>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-4">
                        {/* Phone */}
                        <a
                          href={`tel:${coordinator.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-3 text-[#221F1A]/80 hover:text-[#C19B4C] transition-colors group/link"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#E9D39D]/40 flex items-center justify-center border border-[#DEC077]/60 group-hover/link:bg-[#E9D39D] transition-colors">
                            <Phone className="w-5 h-5 text-[#C19B4C]" />
                          </div>
                          <span className="text-lg font-bold">
                            {coordinator.phone}
                          </span>
                        </a>

                        {/* Email */}
                        <a
                          href={`mailto:${coordinator.email}`}
                          className="flex items-center gap-3 text-[#221F1A]/80 hover:text-[#C19B4C] transition-colors group/link"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#E9D39D]/40 flex items-center justify-center border border-[#DEC077]/60 group-hover/link:bg-[#E9D39D] transition-colors">
                            <Mail className="w-5 h-5 text-[#C19B4C]" />
                          </div>
                          <span className="text-sm font-medium">{coordinator.email}</span>
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
              className="relative rounded-3xl border border-[#DEC077] bg-[#FAF4E8] backdrop-blur overflow-hidden shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#DEC077]/10 via-transparent to-[#E9D39D]/15 opacity-60" />

              <div className="relative p-8 sm:p-10">
                <h2 className="text-2xl font-black text-[#221F1A] mb-8 tracking-tight">
                  General Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#E9D39D]/40 flex items-center justify-center border border-[#DEC077]/60">
                      <MapPin className="w-5 h-5 text-[#C19B4C]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#221F1A]/60 uppercase tracking-wider mb-1">
                        Location
                      </h3>
                      <p className="text-[#221F1A] font-medium">{contactInfo.address}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#E9D39D]/40 flex items-center justify-center border border-[#DEC077]/60">
                      <Mail className="w-5 h-5 text-[#C19B4C]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#221F1A]/60 uppercase tracking-wider mb-1">
                        General Email
                      </h3>
                      <a
                        href={`mailto:${contactInfo.generalEmail}`}
                        className="text-[#221F1A] font-medium hover:text-[#C19B4C] transition-colors"
                      >
                        {contactInfo.generalEmail}
                      </a>
                    </div>
                  </div>

                  {/* Website */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#E9D39D]/40 flex items-center justify-center border border-[#DEC077]/60">
                      <svg
                        className="w-5 h-5 text-[#C19B4C]"
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
                      <h3 className="text-sm font-bold text-[#221F1A]/60 uppercase tracking-wider mb-1">
                        Website
                      </h3>
                      <p className="text-[#221F1A] font-medium">{contactInfo.website}</p>
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
              <p className="text-[#221F1A]/70 mb-6 font-medium">
                Ready to be part of Sparkz &apos;26?
              </p>
              <a
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DEC077] bg-[#E9D39D] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-[#221F1A] shadow-md hover:bg-[#dec077] transition-all duration-300 transform hover:-translate-y-1"
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
