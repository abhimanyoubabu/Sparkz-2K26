"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toastInfo } from "@/utils/common/Toast";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuth } from "@/context/AuthContext";

const accentGradient =
  "bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/25 to-amber-400/25";

const rulesSections = [
  {
    title: "Eligibility",
    points: [
      "The competition is open to bonafide students of recognized colleges.",
      "Each band must consist of 5 to 10 members.",
      "All participants must carry a valid college ID card.",
      "(2 or 3 passed-out students from the same college can also perform with the band, provided they submit any kind of proof that they belonged to the same college when asked.)",
      "A participant may represent only one band in the competition.",
    ],
  },
  {
    title: "Performance Rules",
    points: [
      "Each band will be allotted 30 minutes (10-15 mins for performance), including setup and sound check.",
      "Exceeding the time limit will result in negative marking.",
      "Bands may perform songs from any genre.",
      "Use of pre-recorded backing tracks is strictly prohibited.",
      "Lyrics and performances must not contain obscene, offensive, or politically provocative content.",
      "Performances may be in English or any Indian language.",
    ],
  },
  {
    title: "Instruments & Technical Requirements",
    points: [
      "Bands must bring their own musical instruments.",
      "The organizers will provide a standard PA system (2 stereo jacks & 3 mono jack cable on stage), microphones, and drum kit.",
      "Any special technical requirements must be informed during registration (like condenser microphones).",
      "The organizing committee will not be responsible for technical failures caused by personal equipment.",
    ],
  },
  {
    title: "Judging Criteria",
    points: [
      "Bands will be judged based on: Musical precision & rhythm, Originality & creativity, Coordination & harmony, Stage presence & audience engagement, Overall impact.",
      "The verdict of the judging panel is final and shall not be questioned under any circumstances.",
    ],
  },
  {
    title: "Prize Money",
    points: [
      "First Prize: ₹30,000",
      "Second Prize: ₹20,000",
      "Third Prize: ₹10,000",
      "All winners will receive certificates and trophies.",
    ],
  },
  {
    title: "Code of Conduct",
    points: [
      "Participants must maintain discipline and sportsmanship throughout the event.",
      "Any form of misconduct, substance use, or violation of campus rules will result in immediate disqualification.",
      "Any damage to the venue or equipment will be the responsibility of the respective band.",
    ],
  },
  {
    title: "Registration & General Instructions",
    points: [
      "Bands must complete registration before the specified deadline.",
      "Reporting time will be announced; late reporting may lead to disqualification.",
      "The order of performance will be decided by draw of lots or organizer discretion.",
      "The organizing committee reserves the right to modify rules if necessary.",
      "Participation implies acceptance of all the above rules.",
    ],
  },
  {
    title: "Online Competition",
    points: [
      "If registrations exceed 10 teams, a screening round will be conducted through video submissions.",
      "Bands must submit a recorded performance video to the event coordinator.",
      "Judging committee will shortlist 10 bands, and the decision shall be final.",
      "Non-selected bands will receive a full refund of the registration fee.",
    ],
  },
];

const chiefGuestImage = "/ousepachan.png"; // Replace with actual image path/URL

export default function AbheriPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  const [abheriRegistered, setAbheriRegistered] =
    useState(false);

  const [checkingAbheriRegistration, setCheckingAbheriRegistration] =
    useState(true);

  useEffect(() => {
    const checkAbheriRegistration = async () => {
      if (!user) {
        setAbheriRegistered(false);
        setCheckingAbheriRegistration(false);
        return;
      }

      try {
        const q = query(
          collection(db, "abheri_registrations"),
          where("userId", "==", user.uid),
          limit(1)
        );

        const snapshot = await getDocs(q);

        setAbheriRegistered(!snapshot.empty);
      } catch (error) {
        console.error(
          "Failed to check Abheri registration:",
          error
        );

        setAbheriRegistered(false);
      } finally {
        setCheckingAbheriRegistration(false);
      }
    };

    checkAbheriRegistration();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#04050b] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-10 pb-20 sm:py-15">
        {mounted && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#04050b] via-transparent to-transparent h-64" />
            <div className="pointer-events-none absolute left-[-10%] top-[10%] h-96 w-96 rounded-full bg-indigo-600/25 blur-[140px]" />
            <div className="hidden sm:block pointer-events-none absolute right-[-5%] top-[15%] h-96 w-96 rounded-full bg-fuchsia-500/25 blur-[150px]" />
            <div className="hidden sm:block pointer-events-none absolute inset-x-0 top-[20%] h-full bg-linear-to-b from-indigo-600/12 via-fuchsia-500/10 to-amber-400/8 blur-3xl opacity-70" />
            <div className="hidden sm:block pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.15),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.12),transparent_40%)]" />
            <div className="hidden sm:block pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_transparent_1px)] bg-size-[140px_140px] opacity-20" />
            <div className="hidden sm:block pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.08),transparent_40%),linear-gradient(240deg,rgba(236,72,153,0.08),transparent_35%)] opacity-60" />
            <div className="hidden sm:block pointer-events-none absolute inset-0 mix-blend-screen opacity-25">
              <div className="hidden sm:block absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(135deg,rgba(94,234,212,0.08)_1px,transparent_1px),linear-gradient(45deg,rgba(251,191,36,0.1)_2px,transparent_2px)] bg-size-[180px_180px,180px_180px,220px_220px,100px_100px]" />
            </div>
            {[
              {
                className: "right-[12%] top-[20%] h-10 w-10",
                color: "fuchsia",
              },
              {
                className: "left-1/2 top-[55%] -translate-x-1/2 h-12 w-12",
                color: "amber",
              },
              { className: "left-[10%] top-[70%] h-8 w-8", color: "indigo" },
            ].map((chip, i) => (
              <motion.div
                key={i}
                className={`pointer-events-none absolute ${chip.className} rounded-xl border border-${chip.color}-300/50 bg-${chip.color}-400/15 blur-[1px]`}
                animate={{ y: [-10, 15, -10], rotate: [-8, 8, -8] }}
                transition={{
                  duration: 7 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        )}
        <div className="relative z-10 px-[5vw]">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur mx-auto">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Inter-Collegiate Band Competition
              </div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  ABHERI
                </span>
                <br />
                Rock the Stage on <br />
                <span className="text-orange-400">8 Oct 2026</span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Unleash your band's energy at Sparkz 2K26 – Prize pool up to
                ₹60,000 | Teams of 6-10 | Reg: ₹1,000
              </p>
              {abheriRegistered ? (
                <div
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-green-300 w-full md:w-auto"
                >
                  ✓ Registered
                </div>
              ) : (
                <Link
                  href="/abheri/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-orange-500/20 via-amber-400/15 to-orange-500/20 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white/90 backdrop-blur hover:scale-105 transition-transform w-full md:w-auto"
                >
                  Register Now
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chief Guest Section */}
      <section className="relative isolate overflow-hidden pb-20 pt-10 sm:pt-14">
        <div className="absolute inset-0 bg-linear-to-b from-[#04050b] via-[#04050b]/90 to-black" />
        {mounted && (
          <>
            {/* Dynamic background elements */}
            <div className="hidden sm:block pointer-events-none absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-orange-500/10 blur-[180px]" />
            <div className="hidden sm:block pointer-events-none absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
          </>
        )}
        <div className="relative z-10 px-[5vw]">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <div className="relative mx-auto w-full max-w-sm lg:max-w-md aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-orange-500/10 group">
                    <Image
                      src={chiefGuestImage}
                      alt="Manjari"
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04050b] via-transparent to-transparent opacity-80" />
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                    Chief Guest Spotlight
                  </div>

                  <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                    <span className="text-white">Manjari</span>
                  </h2>

                  <div className="space-y-4">
                    <p className="text-xl text-indigo-100/80 font-medium leading-relaxed">
                      Renowned Playback Singer, Composer, and Hindustani
                      Classical & Ghazal Vocalist.
                    </p>
                    <p className="text-lg text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0">
                      Gracing the stage of Spark at Abheri 2K26. Witness a
                      mesmerizing performance by one of the most versatile
                      voices in the industry.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Competition Judge Section - Sudarshan */}
      <section className="relative isolate overflow-hidden pb-20 pt-10 sm:pt-14">
        <div className="absolute inset-0 bg-linear-to-b from-black via-[#04050b]/90 to-[#04050b]" />
        {mounted && (
          <>
            {/* Dynamic background elements */}
            <div className="hidden sm:block pointer-events-none absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-fuchsia-500/10 blur-[180px]" />
            <div className="hidden sm:block pointer-events-none absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
          </>
        )}
        <div className="relative z-10 px-[5vw]">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <div className="relative mx-auto w-full max-w-sm lg:max-w-md aspect-[4/5] sm:aspect-3/4 lg:aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-fuchsia-500/10 group">
                    <Image
                      src="/sudarshan.jpg"
                      alt="Sudarshan"
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04050b] via-transparent to-transparent opacity-80" />
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse" />
                    Competition Judge
                  </div>

                  <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                    <span className="text-white">Sudarshan</span>
                  </h2>

                  <div className="space-y-4">
                    <p className="text-xl text-indigo-100/80 font-medium leading-relaxed">
                      Renowned Playback Singer
                    </p>
                    <p className="text-lg text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0">
                      Bringing his expertise and musical prowess to judge the
                      performances at Abheri 2K26. Experience the thrill of
                      being evaluated by one of the industry's finest voices.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="relative py-20">
        {mounted && (
          <>
            <div className="pointer-events-none absolute left-[-10%] top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px]" />
            <div className="hidden sm:block pointer-events-none absolute right-[-5%] bottom-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[100px]" />
          </>
        )}
        <div className="relative z-10 px-[5vw]">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-8 mb-16"
            >
              <h2 className="text-4xl font-black sm:text-5xl">
                Rules &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
                  Regulations
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Know the guidelines to rock the stage without a hitch.
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {rulesSections.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden flex flex-col hover:bg-white/10 transition-colors duration-300"
                >
                  <div
                    className={`px-8 py-5 ${accentGradient} border-b border-white/10`}
                  >
                    <h3 className="text-md font-bold uppercase tracking-widest text-white/90">
                      {section.title}
                    </h3>
                  </div>
                  <div className="p-8 space-y-4 flex-1">
                    {section.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-4">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs mt-0.5 border border-indigo-500/20">
                          {pIdx + 1}
                        </div>
                        <p className="text-white/70 leading-relaxed text-base">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contacts & CTA Section */}
      {/* Contacts & CTA Section */}
      <section className="relative py-24 bg-[#04050b]">
        {mounted && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.05),transparent_50%)]" />
          </>
        )}
        <div className="relative z-10 px-[5vw]">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-12"
            >
              <div className="space-y-6">
                <h2 className="text-4xl font-black sm:text-5xl">
                  Ready to <span className="text-orange-400">Jam?</span>
                </h2>
                <div className="inline-flex flex-wrap justify-center gap-4">
                  <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium">
                    Reg Fee:{" "}
                    <span className="text-white font-bold">₹1,000</span> / team
                  </span>
                  <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium">
                    Date:{" "}
                    <span className="text-white font-bold">8 Oct 2026</span>
                  </span>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
                {[
                  {
                    title: "Faculty Coordinator",
                    name: "Ashin Sabu",
                    phone: "+91 9487752512",
                  },
                  {
                    title: "Student Coordinator",
                    name: "Jacs J Jacob",
                    phone: "+91 8590204413",
                  },
                ].map((contact, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-2">
                      {contact.title}
                    </h3>
                    <p className="text-xl font-bold text-white mb-1">
                      {contact.name}
                    </p>
                    <a
                      href={`tel:${contact.phone.replace(/ /g, "")}`}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
              {abheriRegistered ? (
                <div
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-green-300 w-full md:w-auto"
                >
                  ✓ Registered
                </div>
              ) : (
                <Link
                  href="/abheri/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-orange-500/20 via-amber-400/15 to-orange-500/20 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white/90 backdrop-blur hover:scale-105 transition-transform w-full md:w-auto"
                >
                  Register Now
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
