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
            className="group relative flex items-center justify-center gap-3 w-full rounded-full bg-[#E9D39D] hover:bg-[#DEC077] border border-[#DEC077] p-4 transition-all duration-300 hover:scale-[1.02] shadow-md shadow-[#DEC077]/30 cursor-pointer"
          >
            <span className="text-lg font-bold text-[#221F1A]">Register Now</span>
            <FaExternalLinkAlt className="text-[#221F1A] text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : (
          // Internal Link
          <Link
            href={`./${event.id}/register`}
            className="group relative flex items-center justify-center gap-3 w-full rounded-full bg-[#E9D39D] hover:bg-[#DEC077] border border-[#DEC077] p-4 transition-all duration-300 hover:scale-[1.02] shadow-md shadow-[#DEC077]/30 cursor-pointer"
          >
            <span className="text-lg font-bold text-[#221F1A]">Register Now</span>
            <FaArrowRight className="text-[#221F1A] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default RegisterButtonSection;
