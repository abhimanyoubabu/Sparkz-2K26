import React from "react";

export default function GradientBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-50"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#F9F6ED]" />
        
      {/* Soft Ambient Gold Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#DEC077]/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#E9D39D]/30 rounded-full blur-[140px]" />
          <div className="absolute top-[35%] right-[20%] w-[30%] h-[30%] bg-[#C19B4C]/10 rounded-full blur-[120px]" />
      </div>

      {/* Subtle Gold Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
         style={{
          backgroundImage: `linear-gradient(#C19B4C 1px, transparent 1px), linear-gradient(90deg, #C19B4C 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
