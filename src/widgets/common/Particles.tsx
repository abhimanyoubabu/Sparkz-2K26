"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface FloatingParticlesProps {
  count?: number;
}

// Pre-defined particle positions to avoid random generation
const PRE_DEFINED_PARTICLES = [
  { x: "18%", y: "35%", size: 4, color: "bg-cyan-400/30", type: 0 },
  { x: "45%", y: "12%", size: 3, color: "bg-fuchsia-400/25", type: 1 },
  { x: "72%", y: "28%", size: 2, color: "bg-amber-400/25", type: 2 },
  { x: "15%", y: "68%", size: 3.5, color: "bg-cyan-400/30", type: 0 },
  { x: "85%", y: "42%", size: 2.5, color: "bg-fuchsia-400/25", type: 1 },
  { x: "38%", y: "85%", size: 4, color: "bg-amber-400/25", type: 2 },
  { x: "62%", y: "15%", size: 3, color: "bg-cyan-400/30", type: 0 },
  { x: "25%", y: "22%", size: 2.8, color: "bg-fuchsia-400/25", type: 1 },
  { x: "78%", y: "75%", size: 3.2, color: "bg-amber-400/25", type: 2 },
  { x: "5%", y: "45%", size: 2.2, color: "bg-cyan-400/30", type: 0 },
  { x: "55%", y: "65%", size: 3.7, color: "bg-fuchsia-400/25", type: 1 },
  { x: "92%", y: "18%", size: 2.9, color: "bg-amber-400/25", type: 2 },
];

export default function FloatingParticles({
  count = 12,
}: FloatingParticlesProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use only the first 'count' particles from the pre-defined array
  const particles = PRE_DEFINED_PARTICLES.slice(0, count);

  // Don't render on server
  if (!isMounted) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            x: [
              null,
              `calc(${particle.x} + ${
                particle.type === 0
                  ? "20px"
                  : particle.type === 1
                  ? "-15px"
                  : "10px"
              })`,
            ],
            y: [
              null,
              `calc(${particle.y} + ${
                particle.type === 0
                  ? "-15px"
                  : particle.type === 1
                  ? "20px"
                  : "-10px"
              })`,
            ],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: (i % 4) * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}