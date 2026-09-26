import React from "react";
import { motion } from "motion/react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  glowColor?: "accent" | "orange";
  delayIndex?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  glowOnHover = true,
  glowColor = "accent",
  delayIndex = 0,
}) => {
  const glowStyle = glowColor === "accent" 
    ? "hover:border-brand-accent hover:shadow-[0_0_20px_rgba(204,255,0,0.1)]" 
    : "hover:border-brand-orange hover:shadow-[0_0_20px_rgba(255,69,0,0.1)]";

  return (
    <motion.div
      id={`card_${Math.random().toString(36).substr(2, 5)}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1],
        delay: delayIndex * 0.08 
      }}
      whileHover={glowOnHover ? { y: -4 } : undefined}
      className={`bg-brand-card border border-brand-border p-6 relative overflow-hidden transition-all duration-300 ${glowOnHover ? glowStyle : ""} ${className}`}
    >
      {/* Editorial aesthetic corner bracket decor */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-text/10" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-text/10" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-brand-text/10" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-text/10" />

      {children}
    </motion.div>
  );
};
