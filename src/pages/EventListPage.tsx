"use client";

import Image from "next/image";
import { Suspense, useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Particles from "@/widgets/common/Particles";
import GradientBackground from "@/components/ui/GradientBackground";
import { convertDriveUrl } from "@/utils/imageUtils";

import { db } from "@/utils/firebase";
import {
  collection,
  getDocsFromServer,
} from "firebase/firestore";

import { departments } from "@/utils/constants/Constants";
import { Event } from "@/utils/types/event";

// ============================================================
// EVENT CARD
// ============================================================

function EventCard({
  event,
  idx,
}: {
  event: Event;
  idx: number;
}) {
  return (
    <motion.div
      key={event.id}
      layout
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -12,
      }}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
        delay: idx * 0.03,
      }}
      whileHover={{
        y: -6,
      }}
      className="group"
    >
      <Link
        href={`/events/${event.id}`}
        className="block max-w-90 overflow-hidden rounded-2xl border border-[#DEC077] bg-[#FAF4E8] shadow-sm transition-all duration-300 hover:border-[#C19B4C] hover:shadow-lg hover:shadow-[#DEC077]/30"
      >
        {/* ==================================================
            POSTER FRAME
        ================================================== */}

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#FAF4E8]">

          {/* ==================================================
              EVENT POSTER
          ================================================== */}

          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title || "Event poster"}
              fill
              quality={50}
              priority={idx < 4}
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                25vw
              "
              className="rounded-2xl object-cover"
            />
          ) : (
            <Image
              src="/event.png"
              alt={event.title || "Event poster"}
              fill
              priority={idx < 4}
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                25vw
              "
              className="rounded-2xl object-cover"
            />
          )}

        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================
// EVENTS PAGE
// ============================================================

export default function EventsPage() {
  const [selectedDept, setSelectedDept] =
    useState<string>("All");

  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================================
  // FETCH EVENTS FROM FIRESTORE
  // ==========================================================

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        /*
         * Get the latest data directly from Firestore.
         *
         * This prevents the event list from depending
         * on an older cached version of the document.
         */
        const querySnapshot =
          await getDocsFromServer(
            collection(db, "events")
          );

        if (querySnapshot.empty) {
          setEvents([]);
          return;
        }

        /*
         * Convert Firestore documents into Event objects.
         *
         * New events:
         *     imageUrl
         *
         * Old events:
         *     image
         *
         * imageUrl is preferred.
         */

        const eventsList =
          querySnapshot.docs.map((doc) => {
            const data = doc.data();

            // ------------------------------------------------
            // DEBUG
            // ------------------------------------------------

            console.log(
              "--------------------------------------"
            );

            console.log(
              "Event:",
              data.title
            );

            console.log(
              "Event ID:",
              doc.id
            );

            console.log(
              "Google Drive imageUrl:",
              data.imageUrl
            );

            console.log(
              "Old image field:",
              data.image
            );

            console.log(
              "--------------------------------------"
            );

            // ------------------------------------------------
            // IMAGE URL
            // ------------------------------------------------

            const rawImageUrl =
              typeof data.imageUrl === "string" &&
                data.imageUrl.trim() !== ""
                ? data.imageUrl
                : typeof data.image === "string" &&
                  data.image.trim() !== ""
                  ? data.image
                  : "";

            /*
             * Normalise any Google Drive URL variant
             * (sharing links, open?id= links, uc?export=view links)
             * to a direct lh3.googleusercontent.com embed URL so the
             * <Image> component can load it without 307 redirect loops.
             */
            const imageUrl = convertDriveUrl(rawImageUrl);

            return {
              id: doc.id,

              title:
                typeof data.title === "string"
                  ? data.title
                  : "",

              department:
                typeof data.department === "string"
                  ? data.department
                  : "",

              imageUrl,
            };
          }) as Event[];

        console.log(
          "FINAL EVENTS:",
          eventsList
        );

        setEvents(eventsList);

      } catch (error) {
        console.error(
          "Error fetching events:",
          error
        );

        setEvents([]);

      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ==========================================================
  // FILTER EVENTS
  // ==========================================================

  const filteredEvents = useMemo(() => {
    if (selectedDept === "All") {
      return events;
    }

    return events.filter(
      (event) =>
        event.department === selectedDept
    );
  }, [
    events,
    selectedDept,
  ]);

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F9F6ED] py-10 text-[#221F1A]">

      {/* ====================================================
          BACKGROUND
      ==================================================== */}

      <GradientBackground />

      <div className="relative mx-auto max-w-348 px-4 sm:px-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.header
          initial={{
            opacity: 0,
            y: 16,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-12 text-center"
        >

          {/* ==================================================
              TITLE
          ================================================== */}

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C] bg-clip-text text-transparent">
              Sparkz Events
            </span>
          </h1>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#221F1A]/80">
            Choose your battlefield, learn something new,
            and compete for glory — curated challenges
            across all departments.
          </p>

          {/* ==================================================
              DEPARTMENT FILTERS
          ================================================== */}

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            {departments.map((dept) => {
              const active =
                selectedDept === dept;

              return (
                <motion.button
                  key={dept}
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() =>
                    setSelectedDept(dept)
                  }
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC077] ${active
                      ? "border-2 border-[#C19B4C] bg-[#E9D39D] font-bold text-[#221F1A] shadow-md"
                      : "border border-[#DEC077] bg-white/70 text-[#221F1A]/80 hover:bg-[#E9D39D]/40 hover:text-[#221F1A]"
                    }`}
                >
                  {dept === "All"
                    ? "All Events"
                    : dept}
                </motion.button>
              );
            })}

          </div>
        </motion.header>

        {/* ==================================================
            EVENTS GRID
        ================================================== */}

        {loading ? (

          /* ==================================================
             LOADING SKELETON
             ================================================== */

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {[...Array(8)].map(
              (_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-[#DEC077]/50 bg-[#FAF4E8] shadow-sm"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E9D39D]/15">

                    <div className="absolute inset-0 animate-shimmer skew-x-12 bg-gradient-to-r from-transparent via-[#E9D39D]/30 to-transparent" />

                  </div>
                </div>
              )
            )}

          </div>

        ) : (

          /* ==================================================
             EVENTS
             ================================================== */

          <Suspense
            fallback={
              <div className="h-8 w-full rounded-lg bg-[#E9D39D]/20" />
            }
          >

            <motion.div
              layout
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >

              <AnimatePresence>

                {filteredEvents.map(
                  (event, idx) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      idx={idx}
                    />
                  )
                )}

              </AnimatePresence>

            </motion.div>

          </Suspense>
        )}

        {/* ==================================================
            DECORATIVE PARTICLES
        ================================================== */}

        <Particles />

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="mt-12 border-t border-[#DEC077]/40 pt-6 text-center text-sm text-[#221F1A]/60">

          <p>
            Can&apos;t find an event? Contact the tech
            team — we&apos;re happy to help.
          </p>

        </div>

      </div>
    </section>
  );
}