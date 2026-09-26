import { FeedItem, PaymentRecord, MaintenanceRequest, GuestPass, DocumentItem, AmenityDetail } from './types';

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: 'f1',
    category: 'Event',
    date: '2026-05-28',
    title: 'Palmdale Crest Summer BBQ & Poolside Social',
    summary: 'Join us at the Crest Clubhouse for our seasonal community gathering. Enjoy grilled local pairings, craft mocktails, and live jazz overlooking the sundrenched canyon views.',
    content: 'Our highly anticipated Summer BBQ & Poolside Social returns to the Crest Clubhouse. This resident-exclusive event celebrates our vibrant community under the warm high desert sun. Casual resort attire. Please RSVP by May 25th to help us estimate catering. Premium dishes will be curated by local master grillers.',
    author: 'Crest Clubhouse Management',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&h=600&q=80',
    rsvpCount: 42,
    rsvpStatus: null,
    likesCount: 18,
    commentsCount: 3,
  },
  {
    id: 'f2',
    category: 'Notice',
    date: '2026-05-22',
    title: 'Community Notice: Parking Lot Resurfacing & Striping',
    summary: 'Sectors A and B will undergo asphalt sealing and fresh line painting from May 26 to May 28. Please park in visitor bays.',
    content: 'We are pleased to announce the scheduled resurfacing and color-restorative sealant application for our internal townhouse parking lanes. To minimize resident disruption, work has been divided into phases. Cars currently parked in Sector A (Units 1-15) must be relocated to designated visitor zones or the clubhouse lot by Tuesday morning at 7:00 AM. Thank you for your proactive cooperation in keeping our pavements sleek and structurally sound.',
    author: 'HOA Roadway Team',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=600&q=80',
    likesCount: 12,
    commentsCount: 1,
  },
  {
    id: 'f3',
    category: 'Notice',
    date: '2026-05-19',
    title: 'Pool Key Card Distribution & Smart Lock Upgrade',
    summary: 'Pick up your new high-security RFID pool key cards at the Crest Clubhouse starting this Friday. Old physical keys will be deprecated.',
    content: 'In line with our security modernization project, the old analog key cylinder on the pool security gate is being replaced with a proximity-based RFID badge reader. Each townhome unit is entitled to receive two (2) smart RFID companion key cards free of charge. Pickups can be completed at the Crest Lounge during normal concierge hours. Please bring a valid form of ID or your recent assessment statement to authenticate.',
    author: 'Security Committee',
    likesCount: 24,
    commentsCount: 0,
  },
  {
    id: 'f4',
    category: 'Announcement',
    date: '2026-06-05',
    title: 'Holiday Trash Collection & Bulky Item Drop-off Schedule',
    summary: 'Due to the upcoming Memorial Day holiday, weekly trash and recycling collections will slide by 24 hours. A bulky waste bin will be available at the maintenance bay.',
    content: 'Attention Palmdale Crest residents: our municipal sanitation vendor has communicated that trash, compost, and blue recycling receptacle pickups scheduled for next Monday will slide by one business day to Tuesday. Additionally, the HOA has leased a large-capacity rolloff dumpster at the central maintenance gate for bulky residential item drop-offs (such as old furniture, small appliances, and xeriscape trimmings).',
    author: 'Trash & Recycle Council',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&h=600&q=80',
    rsvpCount: 12,
    rsvpStatus: null,
    likesCount: 15,
    commentsCount: 4,
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay1',
    date: '2026-05-01',
    amount: 450.00,
    category: 'HOA Assessment',
    status: 'Paid',
    paymentMethod: 'AutoPay (Visa *4288)'
  },
  {
    id: 'pay2',
    date: '2026-05-01',
    amount: 120.00,
    category: 'Reserved Parking Space Lease',
    status: 'Paid',
    paymentMethod: 'AutoPay (Visa *4288)'
  },
  {
    id: 'pay3',
    date: '2026-06-01',
    amount: 450.00,
    category: 'HOA Assessment',
    status: 'Pending',
  },
  {
    id: 'pay4',
    date: '2026-06-01',
    amount: 120.00,
    category: 'Reserved Parking Space Lease',
    status: 'Pending',
  }
];

export const INITIAL_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'req1',
    date: '2026-05-18',
    title: 'Irrigation drip line repair - Unit 14 Front Garden',
    description: 'The automated drip emitter system is low pressure and leaking near the front walkway flagstones. Needs section replacement.',
    category: 'Landscaping',
    priority: 'Routine',
    status: 'In Progress'
  },
  {
    id: 'req2',
    date: '2026-05-14',
    title: 'Smart Keyless Hub Re-alignment',
    description: 'Entrance gate lock hub is misaligned with the primary sensor strike plate. Door closes but reports open state occasionally.',
    category: 'Security',
    priority: 'Urgent',
    status: 'Completed'
  }
];

export const INITIAL_GUEST_PASSES: GuestPass[] = [
  {
    id: 'pass1',
    guestName: 'Richard Vance',
    vehiclePlate: '7XLA92',
    date: '2026-05-23',
    duration: '24 Hours',
    passCode: 'PC-591-A8'
  },
  {
    id: 'pass2',
    guestName: 'Eleanor Sterling',
    vehiclePlate: '8BTR04',
    date: '2026-05-21',
    duration: '3 Days',
    passCode: 'PC-392-C9'
  }
];

export const DOCUMENTS_LIST: DocumentItem[] = [
  {
    id: 'doc1',
    title: 'Amended & Restated Master Bylaws (2025 Revised)',
    category: 'Bylaws & Rules',
    fileSize: '3.4 MB',
    lastUpdated: '2025-11-12'
  },
  {
    id: 'doc2',
    title: 'Annual Audited Financial Statement & Reserve Analysis',
    category: 'Financial Reports',
    fileSize: '5.2 MB',
    lastUpdated: '2026-03-01'
  },
  {
    id: 'doc3',
    title: 'Q1 HOA General Assembly Meeting Minutes - Official PDF',
    category: 'Meeting Minutes',
    fileSize: '890 KB',
    lastUpdated: '2026-04-15'
  },
  {
    id: 'doc4',
    title: 'Exterior Paint scheme & Xeriscape Approval Form',
    category: 'Forms & Surveys',
    fileSize: '1.2 MB',
    lastUpdated: '2026-01-20'
  },
  {
    id: 'doc5',
    title: 'Palmdale Crest HOA Rules & Architectural Elements Guidelines',
    category: 'Bylaws & Rules',
    fileSize: '2.8 MB',
    lastUpdated: '2026-05-19'
  },
  {
    id: 'doc6',
    title: 'Crest Clubhouse & EV Infrastructure Master Plan',
    category: 'Financial Reports',
    fileSize: '14.1 MB',
    lastUpdated: '2025-08-30'
  }
];

export const ESTATE_AMENITIES: AmenityDetail[] = [
  {
    id: 'am1',
    name: 'Crest Clubhouse & Executive Lounge',
    description: 'Features premium workspace desks, ultra-high-speed Wi-Fi network, cozy resident lounge corners, and a self-serve organic espresso bar.',
    capacity: '20 Guests',
    status: 'Open',
    timeSlots: ['12:00 PM - 02:00 PM', '03:00 PM - 05:00 PM', '06:00 PM - 08:00 PM', '08:30 PM - 10:30 PM']
  },
  {
    id: 'am2',
    name: 'Palmdale Crest Pool & Hot Tub',
    description: 'Pristine saline water swimming pool with custom heating, designer lounge chairs, dry-landscape details, and cozy gas-powered fire tables.',
    capacity: '30 Residents',
    status: 'Open',
    timeSlots: ['07:00 AM - 10:00 AM', '11:00 AM - 02:00 PM', '03:00 PM - 06:00 PM', '07:00 PM - 10:00 PM']
  },
  {
    id: 'am3',
    name: 'Crest Pickleball & Sports Courts',
    description: 'Professional-grade courts configured with modern LED sports illumination and resident-only secure digital access gates.',
    capacity: '4 Players',
    status: 'Open',
    timeSlots: ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM']
  },
  {
    id: 'am4',
    name: 'EV Smart Charging Grid Bays',
    description: 'Fast Level-2 EV charging bays backed by our local solar array storage, exclusively for residents of Palmdale Crest.',
    capacity: '6 Charging Bays',
    status: 'Open',
    timeSlots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM']
  },
  {
    id: 'am5',
    name: 'The Crest Pavilion & Grill Area',
    description: 'Outdoor culinary space with commercial-grade gas barbecues, large sandstone hearth fireplace, and shaded steel pergola dining tables.',
    capacity: '40 Seats',
    status: 'Open',
    timeSlots: ['11:00 AM - 03:00 PM', '05:00 PM - 10:00 PM']
  }
];
