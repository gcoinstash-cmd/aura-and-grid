import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
  duration?: number;
}

export default function Toast({
  isVisible,
  onClose,
  message = "ALLOCATION REQUEST DISPATCHED // SECURE LINE INITIALIZED",
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 10 }}
          transition={{
            ease: [0.16, 1, 0.3, 1], // Classic high-end editorial curve of Aura & Grid
            duration: 0.7,
          }}
          className="fixed top-6 right-6 md:top-8 md:right-8 z-[9999] max-w-md w-full sm:w-auto bg-[#0B0B0B]/95 backdrop-blur-md border border-yugen-gold/30 px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_15px_rgba(197,168,128,0.03)] flex items-center justify-between gap-5 font-sans"
          id="success-toast"
        >
          {/* Subtle gold line indicator */}
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-yugen-gold" />

          {/* Toast Message Container */}
          <div className="flex items-center gap-3.5 pl-2">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 rounded-full border border-yugen-gold/30 flex items-center justify-center bg-yugen-gold/5">
                <ShieldCheck className="h-3 w-3 text-yugen-gold" />
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-yugen-gold font-bold leading-none mb-1">
                SECURE SYSTEM LINK
              </p>
              <p className="text-[10px] tracking-[0.16em] uppercase text-neutral-300 font-medium leading-relaxed font-mono">
                {message}
              </p>
            </div>
          </div>

          {/* Close button with subtle microanimation hover effect */}
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors duration-300 focus:outline-none cursor-pointer"
            aria-label="Close Notification"
            id="toast-close-btn"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
