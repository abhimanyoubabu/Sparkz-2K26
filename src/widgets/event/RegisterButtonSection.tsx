import React from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Event } from "@/utils/types/event";

interface Props {
  event: Event;
}

const RegisterButtonSection: React.FC<Props> = ({ event }) => {
  return (
    <div className="relative">
      <div className="space-y-4">
        {event.regLink ? (
          // External Link
          <Link
            href={event.regLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 w-full rounded-xl bg-linear-to-r from-indigo-600 via-fuchsia-600 to-amber-500 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#4f46e5]"
          >
            <span className="text-lg font-bold text-white">Register Now</span>
            <FaExternalLinkAlt className="text-white text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : (
          // Internal Link
          <Link
            href={`./${event.id}/register`}
            className="group relative flex items-center justify-center gap-3 w-full rounded-xl bg-linear-to-r from-indigo-600 via-fuchsia-600 to-amber-500 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_#4f46e5]"
          >
            <span className="text-lg font-bold text-white">Register Now</span>
            <FaArrowRight className="text-white transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default RegisterButtonSection;
