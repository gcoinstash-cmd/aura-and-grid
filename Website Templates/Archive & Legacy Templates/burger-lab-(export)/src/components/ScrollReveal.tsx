import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // millisecond delay before animation starts
  duration?: number; // millisecond duration of the transition
  distance?: string; // translate distance, e.g. '30px'
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 800,
  distance = '32px',
  direction = 'up',
  id,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Bypassed Scroll Observer wrapper for reliable iframe rendering
    setIsIntersecting(true);
  }, []);

  const getTransform = () => {
    if (isIntersecting || direction === 'none') return 'translate(0, 0)';
    switch (direction) {
      case 'up':
        return `translate(0, ${distance})`;
      case 'down':
        return `translate(0, -${distance})`;
      case 'left':
        return `translate(${distance}, 0)`;
      case 'right':
        return `translate(-${distance}, 0)`;
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      id={id}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // ultra-smooth sleek easing curve
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
