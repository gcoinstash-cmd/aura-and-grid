import { ServiceItem, PackageTier, TestimonialRecord, BookingRecord } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'fluid-service',
    name: 'Precision Fluid & Safety Audit',
    category: 'maintenance',
    estimatePrice: 165,
    duration: '1 Hour',
    description: 'High-grade endurance engine oil change, premium high-pressure oil filter replacement, safety system multi-point analysis, and complete synthetic fluid stabilization.',
    icon: 'Droplet'
  },
  {
    id: 'ecu-tuning',
    name: 'Stage 1/2 ECU Calibration & Dyno',
    category: 'tuning',
    estimatePrice: 799,
    duration: '3.5 Hours',
    description: 'Custom fuel-map dyno optimization, ignition timing correction, throttle response amplification, speed governor deletion, and certified torque delivery plots.',
    icon: 'Cpu',
    helperText: '(Software optimization to increase horse-power and fuel efficiency safely).'
  },
  {
    id: 'telemetry-diag',
    name: 'OEM-Level Telemetry & Diagnostics',
    category: 'diagnostics',
    estimatePrice: 185,
    duration: '1.5 Hours',
    description: 'Bespoke diagnostic sweeps using official scan tools. Live sensor sweep capture, telemetry analytics logging, fault clearing, and CAN-bus system reset.',
    icon: 'Activity',
    helperText: '(Complete digital health check using factory scan tools to clear error dashboard lights).'
  },
  {
    id: 'paint-ceramic',
    name: '9H Multi-Coat Paint Correction & Ceramic',
    category: 'detailing',
    estimatePrice: 650,
    duration: '6 Hours',
    description: 'Three-stage orbital paint correction to eliminate swirl marks, followed by triple-layer 9H ultra-hydrophobic ceramic glass coating and thermal curing loops.',
    icon: 'Sparkles'
  },
  {
    id: 'chassis-balance',
    name: 'Chassis Tuning & Corner Balancing',
    category: 'tuning',
    estimatePrice: 420,
    duration: '2.5 Hours',
    description: 'Precision adjustable coilover height calibration, individual corner weight distribution balancing, bump-steer trim evaluation, and aggressive performance alignment.',
    icon: 'Sliders',
    helperText: '(Suspension and alignment tuning for perfect steering precision and even tire wear).'
  },
  {
    id: 'track-prep',
    name: 'Track-Day Preparation Package',
    category: 'diagnostics',
    estimatePrice: 280,
    duration: '2 Hours',
    description: 'Track-temperature brake fluid flush (Motul RBF660), thermal tire pressure tuning, component stress audit, caliper torque validation, and telemetry diagnostics check.',
    icon: 'Gauge'
  }
];

export const PACKAGES: PackageTier[] = [
  {
    id: 'pkg-street',
    name: 'Street Standard',
    price: '$249',
    description: 'Complete mechanical assurance for daily drivers seeking reliable, high-end care.',
    features: [
      'Comprehensive telemetry scan',
      'Synthetic engine oil & premium filter',
      'All vehicle fluids top-off',
      '35-point mechanical stress test',
      'Electronic brake system check'
    ]
  },
  {
    id: 'pkg-apex',
    name: 'Apex Performance',
    price: '$899',
    description: 'Our signature tuning and setup loop for performance enthusiasts and grand tourers.',
    features: [
      'Everything in Street Standard',
      'Stage 1 Custom ECU Mapping',
      '2x Dynamic Chassis Dyno sweeps',
      'Intake & combustion diagnostic',
      'Dyno graph log report package',
      '12-month software map warranty'
    ],
    isPopular: true
  },
  {
    id: 'pkg-track',
    name: 'Track Enthusiast',
    price: '$1599',
    description: 'Raw performance optimization designed for competition track days and premium sports cars.',
    features: [
      'Everything in Apex Performance',
      'Precision Corner Balancing setup',
      'High-temp racing brake fluid flush',
      'Adjustable damper alignment sweep',
      'Track telemetry dashboard config',
      '1-on-1 dynamic review with lead tech'
    ]
  }
];

export const TESTIMONIALS: TestimonialRecord[] = [
  {
    id: 'review-1',
    author: 'Alexander Thorne',
    vehicle: 'Porsche 911 (991.2) GT3 RS',
    type: 'Stage 2 Custom Mapping',
    text: 'Absolute magicians. The dyno calibration woke up the midrange torque like nothing else, and the smooth power delivery is unbelievable. Worth every single dollar.',
    rating: 5,
    beforeUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=700', // Metallic polished grey porsche style
    afterUrl: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&q=80&w=700', // Sparkling yellow hypercar under intense lights
    date: '2026-05-12'
  },
  {
    id: 'review-2',
    author: 'Elena Rostova',
    vehicle: 'Audi RS6 Avant',
    type: '9H Ceramic Correction',
    text: 'The absolute pinnacle of detailing. Swirls from the previous owner are completely gone. Rain literally slides off the bonnet like magic. Ready to resell this beauty!',
    rating: 5,
    beforeUrl: 'https://images.unsplash.com/photo-1549399542-7ee3dc8d757d?auto=format&fit=crop&q=80&w=700', // Dusty, reflection-less bonnet detail close-up
    afterUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=700', // Ultra crystalline liquid droplet detailed hood
    date: '2026-04-29'
  },
  {
    id: 'review-3',
    author: 'Marcus Vance',
    vehicle: 'BMW M2 Competition',
    type: 'Track Day Prep & Corner Balancing',
    text: 'Took their Track Prep before Laguna Seca. Turn-in response is vastly improved. Absolute confidence on cold tyres. The digital dashboard tracking tool kept me updated in real time.',
    rating: 5,
    beforeUrl: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=700', // Dismantled mechanical shop brake background
    afterUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=700', // Shiny neon brake track assembly finish neon orange accent
    date: '2026-05-24'
  }
];

export const PRESEEDED_BOOKINGS: BookingRecord[] = [
  {
    id: 'booking-apex-9502',
    ticketId: 'APEX-9502',
    customerName: 'Marcus Miller',
    email: 'marcus.m@gtconcept.net',
    phone: '(310) 555-0142',
    vehicleType: 'sports',
    vehicleMake: 'Porsche',
    vehicleModel: 'Cayman GT4',
    serviceId: 'ecu-tuning',
    selectedDate: '2026-05-30',
    selectedTime: '10:00 AM',
    notes: 'Installing IPD Plenum and high-flow exhaust system before dynamic dyno tune.',
    priceEstimate: 799,
    status: 'in_progress'
  },
  {
    id: 'booking-track-4108',
    ticketId: 'TRACK-4108',
    customerName: 'Sarah Jenkins',
    email: 'sjenkins@trackfast.io',
    phone: '(415) 555-0199',
    vehicleType: 'sports',
    vehicleMake: 'BMW',
    vehicleModel: 'M4 Competition',
    serviceId: 'track-prep',
    selectedDate: '2026-05-28',
    selectedTime: '01:30 PM',
    notes: 'Complete thermal run-down audit. Check for high-speed brake pad fade.',
    priceEstimate: 280,
    status: 'ready'
  },
  {
    id: 'booking-street-7740',
    ticketId: 'STREET-7740',
    customerName: 'Devon Vance',
    email: 'devon@vanceandassociates.com',
    phone: '(206) 555-0177',
    vehicleType: 'sedan',
    vehicleMake: 'Audi',
    vehicleModel: 'RS7 Sportback',
    serviceId: 'paint-ceramic',
    selectedDate: '2026-05-29',
    selectedTime: '09:00 AM',
    notes: 'Full multi-stage paint renewal required on the high-gloss black roof trims.',
    priceEstimate: 650,
    status: 'parts_ordered'
  }
];
