"use client";
import { notFound } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuMapPin,
  LuUsers,
  LuIndianRupee,
  LuTrophy,
  LuAward,
  LuBookOpen,
} from "react-icons/lu";
import RegisterButtonSection from "@/widgets/event/RegisterButtonSection";
import {
  FaWhatsapp,
  FaCalendarDay,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { shimmer, toBase64, convertDriveUrl } from "@/utils/imageUtils";
import GradientBackground from "@/components/ui/GradientBackground";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Event } from "@/utils/types/event";

// Loading component for suspense
function EventDetailsSkeleton() {
  return (
    <div className="relative min-h-screen bg-[#F9F6ED] text-[#221F1A] overflow-hidden">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        <div className="w-full lg:w-5/12 p-6 lg:h-screen lg:sticky lg:top-0">
          <div className="h-full w-full bg-[#E9D39D]/20 rounded-3xl animate-pulse" />
        </div>
        <div className="w-full lg:w-7/12 p-6 space-y-8">
           <div className="h-20 w-3/4 bg-[#E9D39D]/20 rounded-2xl animate-pulse" />
           <div className="h-40 w-full bg-[#E9D39D]/20 rounded-2xl animate-pulse" />
           <div className="grid grid-cols-2 gap-4">
             <div className="h-32 bg-[#E9D39D]/20 rounded-2xl animate-pulse" />
             <div className="h-32 bg-[#E9D39D]/20 rounded-2xl animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
}

// InfoCard component (Bento Style)
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | React.ReactNode;
  variant?: "default" | "highlight";
  delay?: number;
}

function InfoCard({
  icon,
  title,
  value,
  variant = "default",
  delay = 0
}: InfoCardProps) {
    return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 group shadow-sm
        ${variant === "highlight" 
            ? "bg-[#E9D39D]/40 border-[#DEC077] hover:bg-[#E9D39D]/60" 
            : "bg-[#FAF4E8] border-[#DEC077]/70 hover:border-[#DEC077] hover:bg-[#FAF4E8]"
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 border border-[#DEC077]/50 ${variant === 'highlight' ? 'bg-[#E9D39D] text-[#221F1A]' : 'bg-[#E9D39D]/40 text-[#221F1A]'}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-semibold text-[#221F1A]/60 uppercase tracking-wider mb-1">{title}</p>
            <div className="text-lg font-bold text-[#221F1A] tracking-wide">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Coordinator Card (Compact)
function CoordinatorCard({
  coordinator,
  eventTitle,
}: {
  coordinator: { name: string; phone: string };
  eventTitle: string;
}) {
  const whatsappMessage = encodeURIComponent(
    `Hello ${coordinator.name}, I have a question regarding "${eventTitle}" on Sparkz 2K26. Could you please help me with more details?`
  );

  return (
    <Link
      href={`https://wa.me/${coordinator.phone}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="flex items-center gap-3 p-3 rounded-xl border border-[#DEC077] bg-[#FAF4E8] hover:bg-[#E9D39D]/30 transition-colors group shadow-sm"
    >
      <div className="h-10 w-10 rounded-full bg-[#E9D39D] flex items-center justify-center text-[#221F1A] border border-[#DEC077] text-sm font-bold">
        {coordinator.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#221F1A] truncate group-hover:text-[#C19B4C] transition-colors">
          {coordinator.name}
        </p>
        <p className="text-xs text-[#221F1A]/60">Coordinator</p>
      </div>
      <FaWhatsapp className="text-[#221F1A]/40 group-hover:text-green-600 transition-colors" />
    </Link>
  );
}

// Prize Card Component
function PrizeCard({
  prize,
  title,
  color,
  icon,
}: {
  prize: string;
  title: string;
  color: "gold" | "silver" | "bronze";
  icon: React.ReactNode;
}) {
  const styles = {
    gold: "border-[#C19B4C] text-[#C19B4C] bg-[#FAF4E8]",
    silver: "border-[#DEC077] text-[#C19B4C] bg-[#FAF4E8]",
    bronze: "border-[#DEC077] text-[#C19B4C] bg-[#FAF4E8]",
  };

  return (
    <div
      className={`relative rounded-xl border p-4 shadow-sm ${styles[color]}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-[#E9D39D] text-[#221F1A] border border-[#DEC077]">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#221F1A]/60 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-lg font-black text-[#221F1A]">{prize}</p>
        </div>
      </div>
    </div>
  );
}

export default function EventPage({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
        try {
            const docRef = doc(db, "events", eventId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
            } else {
                setEvent(null);
            }
        } catch (error) {
            console.error("Error fetching event:", error);
            setEvent(null);
        } finally {
            setLoading(false);
        }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <EventDetailsSkeleton />;

  if (!event) {
    notFound(); 
  }

  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <div className="min-h-screen text-[#221F1A] selection:bg-[#E9D39D]">
        <GradientBackground />

        {/* 
            Desktop Layout: Split Screen 
            Mobile Layout: Stacked
        */}
        <main className="relative z-10 lg:flex max-w-7xl mx-auto">
          {/* LEFT PANEL - Sticky on Desktop */}
          <section className="w-full lg:w-[45%] xl:w-[45%] lg:h-screen lg:sticky mb-7.5 lg:top-0 pt-4 sm:p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar">
            {/* Poster Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-4/5 w-full mt-12 max-w-lg mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-[#DEC077] shadow-xl shadow-[#DEC077]/20 group bg-[#FAF4E8]"
            >
              <Image
                src={convertDriveUrl(event.imageUrl)}
                alt={`${event.title} poster`}
                fill
                quality={50}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(700, 933)
                )}`}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 600px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#221F1A]/60 via-transparent to-transparent opacity-60" />

              {/* Category Tag on Image */}
              <div className="absolute top-4 right-4 flex gap-2">
                  {/* Department Tag */}
                  {event.department && (
                     <div className="px-3.5 py-1.5 rounded-full bg-[#E9D39D] border border-[#DEC077] text-xs font-bold text-[#221F1A] uppercase shadow-sm">
                        {event.department}
                    </div>
                  )}
                  {/* Category Tag */}
                  <div className="px-3.5 py-1.5 rounded-full bg-[#E9D39D] border border-[#DEC077] text-xs font-bold text-[#221F1A] uppercase shadow-sm">
                    {event.type}
                  </div>
              </div>

               {/* Online Banner if applicable */}
               {event.isOnline && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-full py-2 bg-[#E9D39D] text-[#221F1A] border border-[#DEC077] text-center text-sm font-bold tracking-wide uppercase rounded-xl shadow-sm">
                    Online Event
                  </div>
                </div>
               )}
            </motion.div>

            {/* Desktop: Coordinators Below Image (Mobile: moved to bottom) */}
            <div className="hidden lg:grid gap-4 mt-auto">
              {event.coordinators && event.coordinators.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-[#221F1A]/60 font-semibold uppercase tracking-wider">
                    Event Coordinators
                  </p>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {event.coordinators.map((c, i) => (
                      <CoordinatorCard
                        key={i}
                        coordinator={c}
                        eventTitle={event.title}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT PANEL - Scrollable Content */}
          <section className="w-full lg:w-[55%] xl:w-[55%] p-4 sm:p-6 lg:pt-16 pb-24 space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C] bg-clip-text text-transparent">
                  {event.title}
                </span>
              </h1>

              <div className="flex flex-wrap gap-3">
                {/* Event Type / Subtype Tags */}
                {event.eveType && (
                    <span className="px-3 py-1 rounded-full text-xs border border-[#DEC077] bg-[#E9D39D] text-[#221F1A] font-bold uppercase shadow-sm">
                        {event.eveType === 'ind' ? 'Individual' : 'Team Event'}
                    </span>
                )}
              </div>

              <div className="max-w-3xl border-l-2 border-[#DEC077] pl-4">
                <p className="text-base md:text-lg text-[#221F1A]/80 leading-relaxed inline">
                  {isExpanded || !event.description || event.description.length <= 150
                    ? event.description
                    : `${event.description.slice(0, 150)}...`}
                </p>
                {event.description && event.description.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-[#C19B4C] hover:text-[#221F1A] font-semibold text-sm transition-colors cursor-pointer focus:outline-hidden"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Info Grid (Bento) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoCard
                icon={<FaCalendarDay size={18} />}
                title="Date"
                value={event.date || "TBA"}
                delay={0.3}
                variant="highlight"
              />
              <InfoCard
                icon={<LuMapPin size={18} />}
                title="Venue"
                value={event.isOnline ? "Online" : event.venue || "TBA"}
                delay={0.35}
              />
              <InfoCard
                icon={<LuIndianRupee size={18} />}
                title="Registration Fee"
                value={event.registrationFee || "Free"}
                delay={0.4}
              />
              {(event.maxParticipation || event.memberMaxCount > 0) && (
                <InfoCard
                  icon={<LuUsers size={18} />}
                  title="Participation"
                  value={
                      event.maxParticipation 
                      ? event.maxParticipation 
                      : (event.memberMaxCount > 1 ? `${event.memberMinCount}-${event.memberMaxCount} Members` : "Individual")
                  }
                  delay={0.45}
                />
              )}
            </div>

            {/* Prize Pool */}
            {(event.firstPrize || event.secondPrize || event.thirdPrize) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#221F1A]">Prize Pool</h2>
                  <div className="h-px flex-1 bg-[#DEC077]/40" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {event.firstPrize && (
                    <PrizeCard
                      prize={event.firstPrize}
                      title="1st Place"
                      color="gold"
                      icon={<LuTrophy />}
                    />
                  )}
                  {event.secondPrize && (
                    <PrizeCard
                      prize={event.secondPrize}
                      title="2nd Place"
                      color="silver"
                      icon={<LuAward />}
                    />
                  )}
                  {event.thirdPrize && (
                    <PrizeCard
                      prize={event.thirdPrize}
                      title="3rd Place"
                      color="bronze"
                      icon={<LuAward />}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Rules & Details Split */}
            <div className="grid md:grid-cols-1 gap-6">
              {/* Rules */}
              {event.rules && event.rules.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-2xl p-6 border border-[#DEC077] bg-[#FAF4E8] shadow-sm"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#221F1A]">
                    <LuBookOpen className="text-[#C19B4C]" />
                    Rules & Requirements
                  </h3>
                  <ul className="space-y-3">
                    {Array.isArray(event.rules) ? (
                      (event.rules as string[]).map((rule, i: number) => (
                        <li
                          key={i}
                          className="flex gap-3 text-[#221F1A]/85 text-sm leading-relaxed"
                        >
                          <span className="text-[#C19B4C] font-bold mt-1">
                            •
                          </span>
                          <span>{rule}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex gap-3 text-[#221F1A]/85 text-sm leading-relaxed">
                        <span className="text-[#C19B4C] font-bold mt-1">
                          •
                        </span>
                        <span>{event.rules}</span>
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
              
               {/* Extra Fields Notice */}
               {event.extraFields && event.extraFields.length > 0 && (
                 <div className="p-4 rounded-xl border border-[#DEC077] bg-[#FAF4E8] shadow-sm">
                     <p className="text-[#221F1A] text-sm font-semibold mb-2">Registration Information Required:</p>
                     <div className="flex flex-wrap gap-2">
                         {event.extraFields.map((f, i) => (
                             <span key={i} className="px-3 py-1 text-xs rounded-full bg-[#E9D39D] text-[#221F1A] border border-[#DEC077] font-medium">
                                 {f.name}
                             </span>
                         ))}
                     </div>
                 </div>
               )}

              {/* Primary CTA Section */}
              {event.regLink && (
                <div className="pt-2">
                  <RegisterButtonSection event={event} />
                </div>
              )}
            </div>

            {/* Mobile Only: Coordinators at bottom */}
            <div className="lg:hidden space-y-4 pt-8 border-t border-[#DEC077]/40">
              {event.coordinators && event.coordinators.length > 0 && (
                <>
                  <p className="text-sm text-[#221F1A]/60 font-semibold uppercase tracking-wider">
                    Event Coordinators
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {event.coordinators.map((c, i) => (
                      <CoordinatorCard
                        key={i}
                        coordinator={c}
                        eventTitle={event.title}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </Suspense>
  );
}
