import React from "react";
import { motion } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "orange";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase transition-colors duration-200 outline-none select-none border";
  
  const variantStyles = {
    primary: "bg-brand-accent text-black border-brand-accent hover:bg-black hover:text-brand-accent hover:border-brand-accent glow-accent",
    orange: "bg-brand-orange text-white border-brand-orange hover:bg-black hover:text-brand-orange hover:border-brand-orange glow-orange",
    secondary: "bg-brand-card text-brand-text border-brand-border hover:bg-brand-card-hover hover:text-white",
    outline: "bg-transparent text-brand-text border-brand-text/30 hover:border-brand-accent hover:text-brand-accent hover:shadow-[0_0_15px_rgba(204,255,0,0.15)]",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3.5 text-sm",
    lg: "px-8 py-4.5 text-base",
  };

  return (
    <motion.button
      id={`button_${variant}_${Math.random().toString(36).substr(2, 5)}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
