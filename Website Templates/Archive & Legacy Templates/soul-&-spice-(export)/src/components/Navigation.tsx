import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Navigation({
  activeSection,
  setActiveSection,
}: NavigationProps) {
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'philosophy', number: '01', title: 'PHILOSOPHY' },
    { id: 'curation', number: '02', title: 'THE MENU' },
    { id: 'order', number: '03', title: 'CATERING SERVICES' },
    { id: 'residency', number: '04', title: 'RESERVATIONS' },
  ];

  return (
    <header 
      className="fixed top-0 left-0 w-full z-40 backdrop-blur-md flex items-center justify-center transition-all duration-300"
      style={{ 
        height: '60px', 
        backgroundColor: 'rgba(10, 10, 10, 0.75)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)' 
      }}
      id="global-floating-header"
    >
      <nav 
        className="flex items-center justify-center w-full px-4 sm:px-8 max-w-full mx-auto overflow-x-auto scrollbar-none gap-6 sm:gap-12"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="font-sans font-medium uppercase tracking-[0.25em] cursor-pointer transition-colors duration-300 select-none whitespace-nowrap py-2"
            style={{ 
              fontSize: '0.65rem', 
              color: activeSection === item.id ? '#FFFFFF' : '#8E8E93' 
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseOut={(e) => {
              if (activeSection !== item.id) {
                e.currentTarget.style.color = '#8E8E93';
              }
            }}
          >
            {item.number}
            <span className="hidden sm:inline"> // {item.title}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

