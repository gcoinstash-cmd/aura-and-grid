import { Retreat } from './types';

export const RETREAT_DATA: Retreat[] = [
  {
    id: 'soma-silence',
    title: 'FOCUS & DECOMPRESSION',
    subtitle: 'Strategic Business & Focus Masterclass',
    tagline: 'A seven-day structured workspace program offering private quiet desks, ergonomic workstations, and recovery protocols in a beautifully restored design venue.',
    location: 'Ubud, Bali',
    dates: 'October 12 – 18, 2026',
    durationDays: 7,
    heroImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200',
    quote: {
      text: 'True productivity requires deliberate disconnect. By taking time out for high-level decompression, we design our next seasons with crystal precision.',
      author: 'Ariya Selvam, Program Director'
    },
    narrativeOverview: 'An immersive, premium workspace program built to separate professionals and operators from digital fatigue. Comprising structured morning routines, premium hot desks, and quiet individual study spaces, this program provides the spatial freedom needed for major strategic work and clear-sighted planning.',
    aboutDetails: [
      'Professional instructional modules led by certified physical posture and movement specialists.',
      'Locally sourced vegetable-rich, nutrition-dense menus designed for physical recovery and cognitive endurance.',
      'Private forest villa property equipped with high-speed focus workspaces and quiet garden study spots.',
      'Comprehensive transition frameworks, printable progress planners, and peer feedback circles.'
    ],
    included: [
      '6 nights in private, custom-designed architectural forest lofts',
      'Three daily nutrient-rich, farm-to-table culinary meals and organic refreshments',
      'Daily individual and cohort posture + alignment masterclasses',
      '3x private physical posture optimization consultations',
      'Premium planning notebooks, designer stationery, and work surfaces',
      'Private round-trip airport chauffeured transportation'
    ],
    notIncluded: [
      'International airfare to Denpasar (DPS)',
      'Visa on Arrival fees (approximately $35 USD)',
      'Optional on-site laundry services or personal local guide tipping',
      'Optional private restorative spa therapies'
    ],
    itinerary: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival & Foundation',
        focus: 'Unpacking, Orientation & Device Standby',
        items: [
          { time: '14:00', title: 'Welcome & Suite Check-in', description: 'Arrive at the private forest grounds, enjoy organic herbal tea at reception, and settle into your suite.' },
          { time: '17:00', title: 'Cohort Orientation & Opening Circle', description: 'Introductions, review of weekly milestones, configuration of private workspace setups, and program details.' },
          { time: '19:00', title: 'Welcome Executive Dinner', description: 'Curated fresh organic welcome meal served under the forest canopy.' },
          { time: '21:05', title: 'Evening Rest & Sleep Prep', description: 'Relax by the natural geothermal pools or prepare for the upcoming focus sessions.' }
        ]
      },
      {
        dayNumber: 2,
        dayTitle: 'Establishing the Focus Baseline',
        focus: 'Posture Alignment & Dedicated Deep Work',
        items: [
          { time: '06:15', title: 'Restorative Physical Alignment', description: 'Gentle physical stretching and structural posture work to prepare the body for focused seating.' },
          { time: '08:30', title: 'Nutrient-Dense Breakfast Service', description: 'Local papaya, fresh cold green juices, and house-made wood-fired baked items.' },
          { time: '10:30', title: 'Focus Alignment Seminar', description: 'Practical workspace alignment and focused breathing structures to enhance cognitive focus.' },
          { time: '13:00', title: 'Catered Lunch & Unstructured Time', description: 'Balanced organic soup service followed by quiet afternoon reflection by the garden ponds.' },
          { time: '16:30', title: 'Deep Stress Reduction Session', description: '90-minute structured physical posture and focused recovery session accompanied by calming ambient acoustic soundscapes.' },
          { time: '18:30', title: 'Screen Decompression Shift', description: 'An elegant daily transition away from display devices and work emails to restore mental focus.' }
        ]
      },
      {
        dayNumber: 3,
        dayTitle: 'Strategic Solitary Work',
        focus: 'Quiet Creative Study, Executive Planning & Core Goals',
        items: [
          { time: '06:30', title: 'Quiet Morning Focus', description: '45 minutes of quiet planning and personal focus to start the day using posture alignment.' },
          { time: '08:00', title: 'Mindful Morning Breakfast', description: 'Quiet breakfast service emphasizing single-source ingredients and tactile dining ware.' },
          { time: '10:00', title: 'Targeted Posture Realignment', description: 'Correcting seating fatigue and lower-back tension using soft active mobility techniques.' },
          { time: '15:00', title: 'Thermal Mineral Pool Soak', description: 'Relaxing inside thermal geothermal mineral pools for physical muscle and joint recovery.' },
          { time: '17:30', title: 'Evening Decompression Session', description: 'A restorative relaxation experience using ambient acoustic instruments in our slate garden courtyard.' }
        ]
      },
      {
        dayNumber: 4,
        dayTitle: 'Integration & Action Planning',
        focus: 'Synthesizing Strategic Steps & Return Protocols',
        items: [
          { time: '07:05', title: 'Morning Posture & Joints Warm-up', description: 'An elegant routine of physical movements to boost joint fluid and blood flow.' },
          { time: '09:00', title: 'Concept Sharing Seminar', description: 'Interactive cohort discussion to organize and present current visual and strategic breakthroughs.' },
          { time: '14:00', title: 'Transition Implementation Circles', description: 'Formulating clear daily routines and integration planning to maintain performance at home.' }
        ]
      }
    ],
    accommodations: [
      {
        id: 'bamboo-loft',
        name: 'Shared Bamboo Garden Loft',
        price: 2450,
        currency: 'USD',
        paymentPlan: '$816/mo for 3 months',
        description: 'An elegant, open-plan loft shared with one other cohort guest. Nestled in the tropical canopy, crafted entirely from sustainable local timber, featuring unbleached organic linens, private outdoor shower, and designer spa amenities.',
        spotsTotal: 6,
        spotsRemaining: 2,
        amenities: [
          'Eco-luxury premium twin mattress',
          'Shared open-air volcanic stone washroom',
          'Private cotton mosquito netting canopy',
          'Daily organic laundry and housekeeping',
          'Panoramic views overlooking the river ravine'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'glass-pavilion',
        name: 'Private Forest Glass Suite',
        price: 3950,
        currency: 'USD',
        paymentPlan: '$1,316/mo for 3 months',
        description: 'A beautiful, fully enclosed private suite with glass walls. Framed with premium ironwood columns and overlooking clean ponds, it includes a hand-carved copper bathing tub and a private cold-plunge pool.',
        spotsTotal: 4,
        spotsRemaining: 1,
        amenities: [
          'Ultra-plush organic king-size latex mattress',
          'En-suite custom bathroom with hand-carved copper tub',
          'Private mineralized cold plunge pool',
          'Scenic acoustic audio relaxation deck',
          'Signature organic lavender mist and designer amenities'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600'
      }
    ],
    host: {
      name: 'Ariya Selvam',
      role: 'Program Director & Posture Consultant',
      bio: 'Ariya is an expert athletic trainer and posture consultant who spent a decade teaching physical alignments and deep stress-reduction methodologies. She translates physical posture optimization and ergonomic control into actionable recovery plans for busy executives.',
      lineage: 'Certified Physical Coach; Advanced Structural Alignment & Posture Consultant credentials.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
    }
  },
  {
    id: 'kairou-clay',
    title: 'KAIRŌ: DETAIL & DESIGN',
    subtitle: 'The Studio Craftsmanship Masterclass',
    tagline: 'Seven days of structured kick-wheel pottery instruction, tactile spatial design, and ink writing workshops inside a historic Kyoto property.',
    location: 'Kyoto, Japan',
    dates: 'November 03 – 09, 2026',
    durationDays: 7,
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    quote: {
      text: 'Design is not about complexity, but reduction. By shaping raw clay on a manual wheel, we train our physical posture and focus parameters.',
      author: 'Ryuzo Kato, Master Potter & Design Lead'
    },
    narrativeOverview: 'Constructed inside a fully restored Edo-period machiya estate in Higashiyama, Kairō is a tactile design residency for creative developers and builders. By anchoring each day around manual wheel pottery and traditional calligraphy, we train focus, improve physical posture, and unlock deep concentration.',
    aboutDetails: [
      'Master-craftsman instruction with a small 1:4 client-to-instructor studio layout.',
      'Daily tea tastings comparing properties of single-origin premium green teas.',
      'Comfortable historic property boasting heated tatami rooms, timber framework, and natural gardens.',
      'Integrated custom-crate shipping that delivers your finished fired pottery safely to your home.'
    ],
    included: [
      '6 nights of architecturally designed lodging inside a historic Higashiyama Machiya estate',
      'Daily traditional seasonal organic meals sourced from local growers',
      'All premium clays, brush tools, pigments, kick-wheel access, and kiln firing cycles',
      'Daily traditional brush calligraphy & geometric layout masterclasses',
      'Professional cargo packaging and custom-crate shipping of completed pottery to your home'
    ],
    notIncluded: [
      'Shinkansen bullet train transit to Kyoto station',
      'Personal shopping or afternoon neighborhood tours',
      'Personal travel health insurance policies'
    ],
    itinerary: [
      {
        dayNumber: 1,
        dayTitle: 'Creative Foundations',
        focus: 'Studio Safety, Clays & Stance Alignment',
        items: [
          { time: '15:00', title: 'Arrival & Historic Courtyard Welcome', description: 'Settle into your timber-framed luxury chamber, enjoy fresh hot genmaicha roasted tea, and receive slippers and keys.' },
          { time: '18:00', title: 'Studio Overview & Workspace Tour', description: 'Gather at the kick-wheel pottery house. Meet the instructors and participate in clay assessment.' },
          { time: '19:30', title: 'Traditional Multi-Course Dinner', description: 'An elegant multi-course seasonal dinner prepared by local culinary masters.' }
        ]
      },
      {
        dayNumber: 2,
        dayTitle: 'Wheel Centering & Techniques',
        focus: 'Manual Wheel Centering & Brush Stroke Layouts',
        items: [
          { time: '07:00', title: 'Architectural View & Morning Orientation', description: 'Morning walking orientation through the dry rock gardens and wooden courtyard layouts.' },
          { time: '09:00', title: 'Centering Fundamentals', description: 'Detailed hands-on coaching to achieve balance on the manual kick-wheel.' },
          { time: '14:00', title: 'Traditional Calligraphy Class', description: 'Studying whitespace, brush pressure, ink density, and geometric layout patterns.' }
        ]
      },
      {
        dayNumber: 3,
        dayTitle: 'High-Fire Kiln Operations',
        focus: 'Firing Cycles & Thermal Management',
        items: [
          { time: '08:00', title: 'Loading the Kiln', description: 'Careful loading of finished clay items and local pine logs into the wood-fired kiln.' },
          { time: '11:00', title: 'Glaze Curing & Firing Review', description: 'Instruction on thermal control, ash reactions, and glaze vitrification.' }
        ]
      }
    ],
    accommodations: [
      {
        id: 'cedar-loft',
        name: 'Historic Cedar Garden Loft',
        price: 3600,
        currency: 'USD',
        paymentPlan: '$1,200/mo for 3 months',
        description: 'Premium low-profile bed set on hand-woven organic tatami mats, featuring original 19th-century cedar timbers, directly overlooking a quiet private moss garden with historic stone lantern pathways.',
        spotsTotal: 4,
        spotsRemaining: 1,
        amenities: [
          'Traditional Japanese futon layers in unbleached organic linen',
          'Private cypress Hinoki wood soaking tub',
          'Beautiful antique painted screen dividers',
          'Daily premium supply of artisan roasted green teas'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'ochre-loft',
        name: 'The Two-Story Main Suite',
        price: 5200,
        currency: 'USD',
        paymentPlan: '$1,733/mo for 3 months',
        description: 'An luxury split-level suite. The lower level offers a private tea-brewing station, while the upper sleeping loft features premium minimalist mattress positions beneath skylights framing Kyoto viewpoints.',
        spotsTotal: 2,
        spotsRemaining: 2,
        amenities: [
          'Private ceramic tea-brewing set with premium instructor teas',
          'Walk-in natural wet stone shower room',
          'Exquisite unbleached merino wool throwing garments',
          'Highest point of elevation overlooking Kyoto slate rooftops'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600'
      }
    ],
    host: {
      name: 'Ryuzo Kato',
      role: 'Master Potter & Design Consultant',
      bio: 'Ryuzo is a prominent sixth-generation ceramic designer whose works are exhibited in international galleries. He focuses on the connection of tactile craft, hand-eye coordination, and spatial focus in high-end design environments.',
      lineage: 'Apprenticed with Kyoto master ceramicists; certified senior instructor with 15+ years of active studio experience.',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'
    }
  },
  {
    id: 'prana-surf',
    title: 'COASTAL FLOW & PERFORMANCE',
    subtitle: 'Surf Training, Yoga & Contrast Recovery',
    tagline: 'Six days of professional surf instruction, restorative mobility alignments, and structured heat-and-ice contrast recovery sessions.',
    location: 'Santa Teresa, Costa Rica',
    dates: 'December 04 – 10, 2026',
    durationDays: 6,
    heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
    quote: {
      text: 'True physical resilience requires both structural muscular alignment and the adaptive flexibility needed to navigate high-momentum oceans.',
      author: 'Marcus Vance, Athletic Director'
    },
    narrativeOverview: 'Perched where the coastal forest meets the Pacific surf breaks, this program is a technically geared athletic recovery camp. Guests study wave mechanics under top-tier coaches, paired with dry sauna heat and cold plunge pools to optimize wellness and recovery.',
    aboutDetails: [
      'Elite surf coaching focusing on board stance, paddle mechanics, and individual video analysis.',
      'Progressive mobility yoga classes designed to relieve shoulder tightness and desk posture slouch.',
      'Daily contrast therapy protocols utilizing redwood saunas and custom cold plunge pools.',
      'Nutrient-rich, high-protein organic menu plans tailored for high athletic output.'
    ],
    included: [
      '5 nights in suspended cliffside ocean bungalows built from native cedar and granite',
      'Three daily high-protein, organic culinary meals configured for athletic support',
      'All premium boards, wetsuits, safety gear, and dedicated personal coaching surf sessions',
      'Biomechanical high-definition video reviews for paddling posture and wave entries',
      'Daily contrast therapy instruction, redwood saunas, and custom ice immersion plunge pools'
    ],
    notIncluded: [
      'Airfare to San Jose (SJO) or regional commuter flight to Tambor',
      'Costa Rican airport environmental exit taxes',
      'Optional physical therapy or deep tissue sports messaging'
    ],
    itinerary: [
      {
        dayNumber: 1,
        dayTitle: 'Ocean Acclimatization',
        focus: 'Equipment Setup, Marine Safety & Rip Assessments',
        items: [
          { time: '14:00', title: 'Arrival & Bungalow Check-in', description: 'Arrive at the coastal property and join the coaches for personal surfboard and equipment fittings.' },
          { time: '16:30', title: 'Biomechanical Board Clinic', description: 'Introductory classroom review of paddling physics, surf line-ups, and target beach current parameters.' },
          { time: '19:00', title: 'High-Protein Performance Feast', description: 'Curated dinner showcasing fresh local fish, organic grains, and performance superfoods.' }
        ]
      },
      {
        dayNumber: 2,
        dayTitle: 'Take-off Mechanics & Board Stance',
        focus: 'Paddle Endurance, Spine Extension & Base Alignments',
        items: [
          { time: '05:30', title: 'Morning Shoulder & Core Extension', description: 'Targeted core stabilization and thoracic opening angles to prepare for long paddling blocks.' },
          { time: '07:30', title: 'Active Board Session (2 Hours)', description: 'Morning surfing under active, real-time coaching from top-tier instructors on the break.' },
          { time: '14:00', title: 'Contrast Recovery Operations', description: 'Redwood infrared dry heat sauna and cold plunge pool protocols to relieve muscle tension and expedite recovery.' }
        ]
      }
    ],
    accommodations: [
      {
        id: 'ocean-bungalow',
        name: 'Shared Cliffside Canopy Loft',
        price: 2900,
        currency: 'USD',
        paymentPlan: '$966/mo for 3 months',
        description: 'Constructed directly over the forest edge, this spacious shared loft sleeps two guests. Crafted with organic native timbers, open layouts, and panoramic viewpoints overlooking the ocean shoreline.',
        spotsTotal: 4,
        spotsRemaining: 2,
        amenities: [
          'Cooling premium latex mattress with organic cotton sheets',
          'Spacious natural stone shower with sliding garden screen panels',
          'Suspended viewing hammock on high structural deck',
          'Premium electrolyte-rich coconut water restocked daily'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'cliffside-suite',
        name: 'Private Panorama Ocean Suite',
        price: 4600,
        currency: 'USD',
        paymentPlan: '$1,533/mo for 3 months',
        description: 'An exceptional private bungalow equipped with custom air-conditioning and retractable floor-to-ceiling glass fronts. Includes a private salt-water plunge pool hanging directly above the ocean spray.',
        spotsTotal: 3,
        spotsRemaining: 1,
        amenities: [
          'Organic-fiber king mattress with premium high-density sheets',
          'Private saltwater plunge pool with premium sunset framing',
          'Outdoor private shower carved directly from native pink granite',
          'Premium herbal tea and organic espresso station'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600'
      }
    ],
    host: {
      name: 'Marcus Vance',
      role: 'Athletic Director & Surf Coach',
      bio: 'Marcus is an elite surf coach and movement specialist with multiple kinesiology and safety credentials. He combines video assessment, posture alignments, and contrast therapy to advance motor skills and restore physical vitality.',
      lineage: 'Functional Movement Specialist (FMS) Certified; B.S. in Kinesiology & Human Performance.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    }
  }
];
