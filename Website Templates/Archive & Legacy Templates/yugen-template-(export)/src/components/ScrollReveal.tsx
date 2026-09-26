import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms delay
  yOffset?: number; // pixels to shift downwards at launch
  duration?: number; // ms duration
  key?: React.Key;
  [key: string]: any;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 24,
  duration = 1200,
  ...rest
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05, // Trigger when 5% enters the viewport to be ultra-responsive
        rootMargin: '0px 0px -60px 0px', // Pre-trigger slightly so the animation starts elegantly
      }
    );

    const target = elementRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${yOffset}px)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'var(--ease-editorial)',
        willChange: 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
