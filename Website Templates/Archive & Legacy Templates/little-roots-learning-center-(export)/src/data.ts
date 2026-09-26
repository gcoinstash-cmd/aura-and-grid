import { Program, Teacher, Testimonial, GalleryImage } from './types';

export const programsData: Program[] = [
  {
    id: 'infant-care',
    name: 'Infant Care',
    ageRange: '6 Weeks – 18 Months',
    ratio: '1:3 Caregiver-to-Infant',
    hours: '7:30 AM – 5:30 PM',
    description: 'A sensory-rich, calming environment designed to nurture physical, emotional, and early cognitive developments while honoring daily intuitive rhythms.',
    extendedDescription: 'Our Infant Care program provides a safe, peaceful home-away-from-home centered on secure attachments. Designed with warm woods, custom organic fibers, and ambient natural lighting, the space is tailored for cognitive and motor exploration. Caregivers engage in respectful caregiving practices (inspired by RIE principles) and integrate soft rhythmic West African lullabies, sensory stimulation, and gentle tummy-time sessions.',
    curriculumHighlights: [
      'Responsive, attachment-based storytelling & singing',
      'Tactile & sensory discovery (wool, polished woods, high-contrast imagery)',
      'Early sign language to empower expressive communication',
      'Daily physical massage & motor milestones support'
    ],
    dailyRhythm: [
      'Flexible child-led sleeping and eating cycles',
      'Scent, audio, and visual sensory walks',
      'Gentle developmental play and floor exploration',
      'Outdoor stroller nature immersion under oak trees'
    ],
    monthlyTuition: 2450,
    annualSupplyFee: 350,
    availability: 'Limited Openings'
  },
  {
    id: 'toddler-discovery',
    name: 'Toddler Discovery',
    ageRange: '18 Months – 3 Years',
    ratio: '1:4 Caregiver-to-Toddler',
    hours: '7:30 AM – 5:30 PM',
    description: 'A beautifully structured Reggio Emilia-inspired classroom where active minds build language, independence, and strong cultural pride through immersive exploration.',
    extendedDescription: 'Toddlers at Little Roots are viewed as natural researchers. Our classroom layout invites tactile exploration, sensory manipulation, and direct physical learning. In keeping with our Afrocentric and community philosophy, children explore global rhythms, cooperative culinary experiments, and collaborative playground problem-solving. We emphasize self-care routines (like eating elegantly and preliminary potty learning) as empowering rites of independence.',
    curriculumHighlights: [
      'Bilingual foundations (English, Spanish, Swahili keywords & daily greetings)',
      'Practical life skills (watering plants, table setting, collaborative cleaning)',
      'Pre-mathematics with premium Montessori wooden manipulatives',
      'Rich multi-sensory storytelling centering Black leaders and folklore'
    ],
    dailyRhythm: [
      '8:30 AM – Morning Gathering, Ancestor & Elder Affirmations',
      '9:00 AM – Self-Selected Project Work & Creative Atelier Exploration',
      '10:30 AM – Al Fresco Organic Snack & Organic Garden Maintenance',
      '11:00 AM – Music, Rhythm & Dynamic Dance Sessions',
      '12:30 PM – Rest and Restorative Dreamtime',
      '3:00 PM – Cooperative Circle & Storytelling'
    ],
    monthlyTuition: 2150,
    annualSupplyFee: 400,
    availability: 'Now Enrolling'
  },
  {
    id: 'pre-k-academy',
    name: 'Pre-K Academy',
    ageRange: '3 – 5 Years',
    ratio: '1:6 Caregiver-to-Student',
    hours: '7:30 AM – 5:30 PM',
    description: 'An advanced, culturally-grounded preparatory curriculum blending classical literacy, STEAM experimentation, and legacy-building mindset training.',
    extendedDescription: 'Preparing our children to step into any environment as resilient, confident visionaries. The Pre-K Academy focuses on advanced literacy, mathematical mastery, biological sciences, and community design. Here, entrepreneurship and creative expression go hand-in-hand. Students engage with actual global architectures, learn to voice social solutions, and lead their own project investigations, ensuring they are exceptional physical, spiritual, and intellectual scholars.',
    curriculumHighlights: [
      'Phonics, early literature analysis, and expressive creative writing',
      'STEAM Lab: Structural building blocks, coding patterns, and urban gardening',
      'Young Visionary: Basic entrepreneurship, design-thinking, and public speaking',
      'Capoeira, martial arts, and core physical coordination disciplines'
    ],
    dailyRhythm: [
      '8:30 AM – Harambee Circle (Daily unity chant & emotional check-in)',
      '9:15 AM – Advanced STEAM Experiments & Cognitive Lab work',
      '10:45 AM – Active Outdoor Play, Kinesthetic Movement & Gardening',
      '11:45 AM – Cultural Arts, Theater & Public Speaking Training',
      '12:30 PM – Organic Lunch & Mindfulness Meditation',
      '1:30 PM – Focused Reading Workshop & Peer Collaboration',
      '3:30 PM – Reflection circle and personal project documentation'
    ],
    monthlyTuition: 1950,
    annualSupplyFee: 450,
    availability: 'Waitlist Active'
  }
];

export const teachersData: Teacher[] = [
  {
    id: 'director',
    name: 'Dr. Althea Vance',
    role: 'Founder & Executive Director',
    credentials: 'Ph.D. in Early Childhood Education (UCLA), M.A. in African American Studies',
    bio: 'With over 18 years of pioneering research and directorship in Los Angeles, Dr. Vance founded Little Roots to merge modern developmental neuroscience with highly affirming Afrocentric cultural frameworks, creating an elite space for the community’s newest leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    quote: 'Our children do not start from behind; they inherit a long legacy of excellence and deep-rooted brilliance. We simply construct the soil.'
  },
  {
    id: 'lead-toddler',
    name: 'Keisha Brooks, M.Ed.',
    role: 'Lead Atelierista & Pre-K Specialist',
    credentials: 'M.Ed. in Curriculum Design (Howard University), Reggio Emilia Certified',
    bio: 'Keisha spent a decade design-planning classroom models in Washington D.C. and Atlanta before bringing her expertise to Los Angeles. She specializes in children\'s artistic languages, project-based investigations, and early mathematical thought structures.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    quote: 'Every child is an artist and architect. When they play with clay, wood, or paint, they are testing theories of gravity, balance, and visual truth.'
  },
  {
    id: 'infant-lead',
    name: 'Marcus Harrison, Cle.',
    role: 'Lead Infant Caregiver & Lactation Specialist',
    credentials: 'B.A. in Child Development (Morehouse College), Certified Infant Sleep & RIE Specialist',
    bio: 'Marcus has dedicated his career to building secure early attachments, sensory integration, and reassuring fatherhood/family workshops. His peaceful, loving room energy ensures that our tiniest roots transition beautifully and securely.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    quote: 'Respecting an infant means listening to their actions. When babies feel deeply understood they grow into incredibly brave learners.'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'Little Roots is not standard childcare; it is an absolute cultural and educational sanctuary. My daughter walks around holding her head high, confidently speaking of leaders, and solving math puzzles with genuine joy. The community of LA power partners is unmatched.',
    author: 'Nia & Omari Sterling',
    relation: 'Parents of Zola, Age 4',
    neighborhood: 'Baldwin Hills',
    parentSince: 2024,
    rating: 5
  },
  {
    id: 'testimonial-2',
    quote: 'Finding a daycare that understands both the rigors of our creative tech careers and our deep desire for a culturally-rich, premium environment was difficult. Little Roots offers unparalleled architectural elegance, organic meals, and absolute emotional warmth.',
    author: 'Kofi & Dr. Chloe Mensah',
    relation: 'Parents of Sekou, Age 2',
    neighborhood: 'Windsor Hills',
    parentSince: 2025,
    rating: 5
  },
  {
    id: 'testimonial-3',
    quote: 'The staff are remarkable professionals who treat our children like the royalty they are. The daily meditation, organic gardening, and Spanish/Swahili bilingual prompts have made our 1.5-year-old incredibly expressive and independent.',
    author: 'Aisha Wright',
    relation: 'Mother of Kingston, Age 18 Months',
    neighborhood: 'Ladera Heights',
    parentSince: 2025,
    rating: 5
  }
];

export const galleryData: GalleryImage[] = [
  {
    id: 'gallery-1',
    title: 'Bright Cooperative Classroom',
    category: 'Classrooms',
    imageUrl: 'https://images.unsplash.com/photo-1610500796385-3ffc1ae2f046?w=800&auto=format&fit=crop',
    description: 'Our main learning area uses tidy shelving, positive play materials, and deep learning setups to foster cooperative discovery.'
  },
  {
    id: 'gallery-2',
    title: 'The Organic Garden & Exploration Path',
    category: 'Play & Nature',
    imageUrl: 'https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=800&auto=format&fit=crop',
    description: 'An outdoor play oasis where kids engage in active motor experiences and connect with natural life cycles under the warm sunshine.'
  },
  {
    id: 'gallery-3',
    title: 'The Art Atelier & Culture Corner',
    category: 'Art & Culture',
    imageUrl: 'https://images.unsplash.com/photo-1497375638960-ca368c7231e4?w=800&auto=format&fit=crop',
    description: 'A dynamic studio workspace filled with rich materials, paints, and cooperative projects from across our creative curriculum.'
  },
  {
    id: 'gallery-4',
    title: 'Storytelling Loft & Cozy Library',
    category: 'Art & Culture',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-96a29b76387a?w=800&auto=format&fit=crop',
    description: 'A custom-built reading den cushioned with soft textiles, highlighting literature featuring positive and diverse representations.'
  }
];
