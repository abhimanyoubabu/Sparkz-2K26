"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const accentGradient =
  "bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/25 to-amber-400/25";

export default function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return (
    <section
      id="about"
      className="relative  isolate overflow-hidden bg-[#04050b] pt-10 pb-20 text-white sm:py-24"
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
      <div className="relative z-10 lg:px-[4vw]">
        {/* SPARKZ Section - Centered Vertical Layout */}
        <div className="flex flex-col items-center space-y-10">
          {/* Row 1: About Sparkz Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              About Sparkz
            </div>
          </motion.div>

          {/* Row 2: Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-center">
              Ignite the{" "}
              <span className="bg-linear-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                spark within{" "}
              </span>
              <span className="bg-linear-to-r from-amber-200 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                you
              </span>
            </h2>
          </motion.div>

          {/* Row 3: Sparkz Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/sparkz.svg"
                alt="Sparkz Logo"
                fill
                className="object-contain drop-shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Row 4: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="w-full"
          >
            <div className="">
              <div className="p-6 sm:p-8 space-y-5">
                <p className="text-white/90 leading-relaxed text-base sm:text-lg text-justify">
                  <strong className="text-white">Sparkz</strong> is the flagship
                  technical fest of{" "}
                  <strong className="text-white">
                    Carmel College of Engineering and Technology (CCET)
                  </strong>
                  , conducted as an inter-college competition that brings
                  together innovative and passionate students from various
                  institutions.
                </p>
                <p className="text-white/80 leading-relaxed text-base sm:text-lg text-justify">
                  It serves as a platform for creative thinking, engineering
                  excellence, and collaborative learning beyond traditional
                  academics. The fest blends technical and non-technical
                  engagements to create an energetic and inclusive environment
                  that promotes critical thinking, teamwork, and healthy
                  competition.
                </p>
                <p className="text-white/80 leading-relaxed text-base sm:text-lg text-justify">
                  Sparkz emphasizes experiential learning, enabling participants
                  to apply knowledge in real-world contexts while developing
                  leadership and problem-solving skills. Through Sparkz, CCET
                  reinforces its commitment to{" "}
                  <strong className="text-white">academic excellence</strong>,{" "}
                  <strong className="text-white">
                    innovation-driven education
                  </strong>
                  , and{" "}
                  <strong className="text-white">
                    holistic student development
                  </strong>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CCET Section - Centered Vertical Layout */}
        <div className="flex flex-col items-center mt-24 pt-24 border-t border-white/10 space-y-10">
          {/* Row 1: About CCET Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-bold uppercase tracking-widest backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              About CCET
            </div>
          </motion.div>

          {/* Row 2: Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-center">
              Building{" "}
              <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-blue-200 bg-clip-text text-transparent">
                tomorrow&apos;s{" "}
              </span>
              <span className="bg-linear-to-r from-blue-200 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                engineers
              </span>
            </h2>
          </motion.div>

          {/* Row 3: CCET Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/carmel.png"
                alt="CCET Logo"
                fill
                className="object-contain drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Row 4: Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="w-full"
          >
            <div className="">
              <div className="p-6 sm:p-8 space-y-5">
                <p className="text-white/90 leading-relaxed text-base sm:text-lg text-justify">
                  <strong className="text-white">
                    Carmel College of Engineering and Technology (CCET)
                  </strong>{" "}
                  is an institution dedicated to shaping capable and responsible
                  engineers through quality education and meaningful learning
                  experiences. Rooted in academic excellence and ethical values,
                  the College works with the aim of creating an environment in
                  which students would be encouraged to learn, grow, and
                  innovate.
                </p>
                <p className="text-white/80 leading-relaxed text-base sm:text-lg text-justify">
                  CCET gives a proper academic structure with experienced
                  faculties, modern facilities, and well-equipped labs. The
                  emphasis is laid upon both theoretical knowledge and practical
                  applications. This helps in developing strong technical skills
                  and confident problem-solving behavior among students.
                  Curiosity, critical thinking, and continuous improvement are
                  an integral part of the academic process.
                </p>
                <p className="text-white/80 leading-relaxed text-base sm:text-lg text-justify">
                  Besides academics, CCET promotes overall growth through
                  co-curricular activities, technical forums, and events
                  organized within the campus for developing leadership,
                  teamwork, and professional responsibilities. The strong
                  collaboration with industry and community organizations
                  further reinforces in students the knowledge about real-world
                  applications and expectations.
                </p>
                <p className="text-white/80 leading-relaxed text-base sm:text-lg text-justify">
                  With its focus on educative drives into innovation and growth
                  for students, Carmel College of Engineering and Technology
                  trains individuals to contribute to society and the
                  ever-changing technological world.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
