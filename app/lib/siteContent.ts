export type ImageTextItem = {
  title: string;
  text?: string;
  image: string;
};

export type StatItem = {
  icon: string;
  value: string;
  label: string;
};

export type TrainerItem = {
  name: string;
  role: string;
  image: string;
};

export type TestimonialItem = {
  name: string;
  text: string;
};

export type BenefitItem = {
  title: string;
  text: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type PageSection = {
  id: string;
  type: "split" | "features" | "process" | "trainers" | "intake";
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  video?: string;
  buttonLabel?: string;
  buttonHref?: string;
  reverse?: boolean;
  items?: ImageTextItem[];
};

export type PageHeroContent = {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  video?: string;
  primaryButton?: string;
  primaryHref?: string;
  secondaryButton?: string;
  secondaryHref?: string;
};

export type EditablePage = {
  navLabel: string;
  path: string;
  hero: PageHeroContent;
  sections: PageSection[];
};

export type PageKey = "about" | "personalTraining" | "facility" | "trainersPage" | "getStarted";

export type SiteContent = {
  assets: {
    logo: string;
    heroPoster: string;
    heroVideo: string;
    contact: string;
  };
  business: {
    phone: string;
    address: string;
    footerName: string;
  };
  nav: NavLink[];
  hero: {
    title: string;
    accent: string;
    text: string;
    badges: string[];
    primaryButton: string;
    secondaryButton: string;
  };
  stats: StatItem[];
  problems: {
    eyebrow: string;
    title: string;
    items: ImageTextItem[];
  };
  steps: {
    eyebrow: string;
    title: string;
    button: string;
    items: ImageTextItem[];
  };
  difference: {
    eyebrow: string;
    title: string;
    items: ImageTextItem[];
  };
  trainers: {
    eyebrow: string;
    title: string;
    items: TrainerItem[];
  };
  benefits: BenefitItem[];
  testimonials: {
    eyebrow: string;
    title: string;
    items: TestimonialItem[];
  };
  contact: {
    title: string;
    text: string;
    button: string;
    success: string;
  };
  footer: {
    importantLinks: NavLink[];
    quickLinks: NavLink[];
    newsletterTitle: string;
    newsletterText: string;
  };
  tracking: {
    googleTagId: string;
    facebookPixelId: string;
  };
  pages: Record<PageKey, EditablePage>;
};

const figmaAssets = {
  logo: "/phoenix-logo.svg",
  hero: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01371.jpg?v=1782328742",
  why1: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01466.jpg?v=1782328741",
  why2: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01656.jpg?v=1782328738",
  why3: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01652.jpg?v=1782328734",
  start1: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01652.jpg?v=1782328734",
  start2: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01666.jpg?v=1782328736",
  start3: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01679.jpg?v=1782328742",
  difference1: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01683.jpg?v=1782328749",
  difference2: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01543.jpg?v=1782328742",
  difference3: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01478.jpg?v=1782328742",
  trainer1: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01550.jpg?v=1782328742",
  trainer2: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01591.jpg?v=1782328739",
  trainer3: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01607.jpg?v=1782328740",
  contact: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01567.jpg?v=1782328736",
};

const gymAssets = {
  exteriorWide: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01371.jpg?v=1782328742",
  exteriorDoor: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01378.jpg?v=1782328742",
  exteriorSign: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01374.jpg?v=1782328742",
  exteriorAngle: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01398.jpg?v=1782328743",
  exteriorSide: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01404.jpg?v=1782328734",
  windowBrand: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01418.jpg?v=1782328741",
  receptionLogo: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01421.jpg?v=1782328736",
  receptionPlant: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01428.jpg?v=1782328741",
  receptionWide: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01556.jpg?v=1782328731",
  brandCards: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01567.jpg?v=1782328736",
  brandSticker: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01433.jpg?v=1782328742",
  facilityWide: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01537.jpg?v=1782328742",
  facilityLong: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01627.jpg?v=1782328740",
  facilityAlt: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01647.jpg?v=1782328741",
  facilityOpen: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01533.jpg?v=1782328742",
  strengthMachines: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01453.jpg?v=1782328742",
  machineVertical: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01501.jpg?v=1782328737",
  cardio: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01462.jpg?v=1782328731",
  hoistDetail: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01497.jpg?v=1782328739",
  dumbbells: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01478.jpg?v=1782328742",
  dumbbellRack: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01523.jpg?v=1782328742",
  kettlebells: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01526.jpg?v=1782328740",
  barbell: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01466.jpg?v=1782328741",
  barbellVertical: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01473.jpg?v=1782328740",
  bands: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01486.jpg?v=1782328742",
  cableMachine: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01441.jpg?v=1782328735",
  trainerDemo: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01543.jpg?v=1782328742",
  trainerProfile: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01550.jpg?v=1782328742",
  trainerWide: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01597.jpg?v=1782328742",
  trainerFocus: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01607.jpg?v=1782328740",
  trainerFull: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01618.jpg?v=1782328741",
  coachingWide: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01591.jpg?v=1782328739",
  coachingConversation: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01652.jpg?v=1782328734",
  coachingClient: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01656.jpg?v=1782328738",
  coachingObserve: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01666.jpg?v=1782328736",
  coachingAction: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01677.jpg?v=1782328741",
  clientCable: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01679.jpg?v=1782328742",
  coachingClose: "https://cdn.shopify.com/s/files/1/0983/2811/7529/files/DSC01683.jpg?v=1782328749",
};

const shopifyVideo = "https://cdn.shopify.com/videos/c/o/v/50802481d7564557a6be9181f1844591.mp4";

export const defaultSiteContent: SiteContent = {
  assets: {
    logo: figmaAssets.logo,
    heroPoster: figmaAssets.hero,
    heroVideo: shopifyVideo,
    contact: figmaAssets.contact,
  },
  business: {
    phone: "(732)545-0100",
    address: "240 Ryders Lane, Milltown, NJ 08850",
    footerName: "Phoenix Fitness © 2026",
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Trainers", href: "#trainers" },
    { label: "Why Personal Training", href: "#why" },
  ],
  hero: {
    title: "Train Smarter. One Trainer.",
    accent: "Only You.",
    text: "Private, certified 1-on-1 personal training in Milltown, NJ. Built around your goals. Nothing else.",
    badges: ["No Contracts", "NSCA · NASM · ACE Certified", "In-Studio or Virtual"],
    primaryButton: "Book My Free Session",
    secondaryButton: "See How It Works",
  },
  stats: [
    { icon: "★", value: "4.9", label: "Google Rating" },
    { icon: "🏆", value: "25+ Years", label: "Experience" },
    { icon: "✓", value: "NSCA · NASM · ACE", label: "Certified Trainers" },
  ],
  problems: {
    eyebrow: "Why Your Training Isn't",
    title: "Working",
    items: [
      { title: "No Plan", text: "Random workouts rarely create lasting change.", image: figmaAssets.why1 },
      { title: "No Accountability", text: "You need coaching that keeps pace with real life.", image: figmaAssets.why2 },
      { title: "No Personal Fit", text: "Templates miss your body, schedule, and goals.", image: figmaAssets.why3 },
    ],
  },
  steps: {
    eyebrow: "Start Personal Training in",
    title: "3 Steps",
    button: "Book My Free Session",
    items: [
      { title: "Book Your Welcome Session", text: "Meet your trainer, talk goals, and get a clear starting point.", image: figmaAssets.start1 },
      { title: "Build Your Plan", text: "Your program is shaped around your body, schedule, and experience.", image: figmaAssets.start2 },
      { title: "Train 1-on-1", text: "Every session is private, coached, and adjusted as you improve.", image: figmaAssets.start3 },
    ],
  },
  difference: {
    eyebrow: "The Phoenix",
    title: "Difference",
    items: [
      { title: "Private 1-on-1 Coaching", image: figmaAssets.difference1 },
      { title: "Expert Guidance", image: figmaAssets.difference2 },
      { title: "Progress Without Guesswork", image: figmaAssets.difference3 },
    ],
  },
  trainers: {
    eyebrow: "Meet Your",
    title: "Certified Trainers",
    items: [
      { name: "Rob Ruggieri", role: "Owner, Personal Trainer", image: figmaAssets.trainer1 },
      { name: "Amy Weber", role: "Personal Trainer", image: figmaAssets.trainer2 },
      { name: "Ben Ruggieri", role: "Personal Trainer", image: figmaAssets.trainer3 },
    ],
  },
  benefits: [
    { title: "No Contracts", text: "Train with flexibility and a clear path forward." },
    { title: "Personalized Plan", text: "Every workout is adjusted to your goals." },
    { title: "Measured Progress", text: "Know what is changing and what to do next." },
  ],
  testimonials: {
    eyebrow: "Testimonials",
    title: "What Clients Say",
    items: [
      { name: "Mitch K", text: "Excellent private gym with great personal trainers. The atmosphere is focused, clean, and genuinely encouraging." },
      { name: "Sarah M", text: "Phoenix makes training feel personal. Every session is planned around what I need and where I am that day." },
      { name: "Luke R", text: "They are flexible with schedule changes and never make the process stressful. Definitely use this place." },
    ],
  },
  contact: {
    title: "Get in touch",
    text: "Take the first step toward your goals. Schedule your free session and meet your personal trainer today.",
    button: "Send",
    success: "Thanks. We'll be in touch shortly.",
  },
  footer: {
    importantLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
    quickLinks: [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Trainers", href: "#trainers" },
      { label: "Why Personal Training", href: "#why" },
      { label: "Contact Us", href: "#contact" },
    ],
    newsletterTitle: "Newsletter",
    newsletterText: "Keep up with our always upcoming news and updates. Enter your e-mail and subscribe to our newsletter.",
  },
  tracking: {
    googleTagId: "",
    facebookPixelId: "",
  },
  pages: {
    about: {
      navLabel: "About",
      path: "/about",
      hero: {
        eyebrow: "About Phoenix Fitness",
        title: "A private personal training studio built around real coaching.",
        text: "Phoenix Fitness gives you a focused place to train without the noise of a crowded gym. Every session is personal, planned, and adjusted to your body.",
        image: gymAssets.receptionLogo,
      },
      sections: [
        {
          id: "local-studio",
          type: "split",
          eyebrow: "Local Studio",
          title: "A real Milltown training space, not a generic fitness app.",
          text: "From the front door to the training floor, the studio is designed for private coaching, accountability, and practical progress. You meet a trainer who learns your goals, your schedule, and your limits.",
          image: gymAssets.exteriorDoor,
        },
        {
          id: "how-it-feels",
          type: "split",
          eyebrow: "How It Feels",
          title: "Quiet, focused, and personal from the moment you walk in.",
          text: "You are not left wandering through machines or guessing what to do next. The work is guided, the space is clean, and the next step is always clear.",
          image: gymAssets.receptionWide,
          reverse: true,
        },
        {
          id: "studio-difference",
          type: "features",
          eyebrow: "Phoenix Fitness",
          title: "What makes the studio different",
          text: "",
          image: gymAssets.facilityWide,
          items: [
            { title: "Private coaching", text: "Your session is centered on you, your form, and your progress.", image: gymAssets.coachingConversation },
            { title: "Complete equipment", text: "Strength machines, free weights, cables, bands, cardio, and open mat space.", image: gymAssets.facilityWide },
            { title: "Clear next steps", text: "The intake helps your trainer build from your history, availability, and goals.", image: gymAssets.brandCards },
          ],
        },
        {
          id: "arrival-experience",
          type: "split",
          eyebrow: "Arrival",
          title: "The studio feels personal before the first exercise starts.",
          text: "Reception images from the metadata set show the Phoenix logo wall, plants, chairs, and front-window area. Use this section to explain what a new client sees when they arrive and why the space feels approachable.",
          image: gymAssets.receptionPlant,
        },
        {
          id: "local-proof",
          type: "features",
          eyebrow: "Location",
          title: "A local studio clients can actually recognize",
          text: "",
          image: gymAssets.exteriorSign,
          items: [
            { title: "Street-visible sign", text: "The exterior sign is useful for location confidence and helps visitors know they are in the right place.", image: gymAssets.exteriorSign },
            { title: "Front-door view", text: "The storefront entrance works well for directions, contact sections, and first-visit reassurance.", image: gymAssets.exteriorDoor },
            { title: "Window branding", text: "The window decal connects the outside storefront to the studio experience inside.", image: gymAssets.windowBrand },
          ],
        },
        {
          id: "why-private-matters",
          type: "split",
          eyebrow: "Private Training",
          title: "Small-studio training helps people ask better questions.",
          text: "Instead of competing with a busy gym floor, clients can talk through form, aches, schedule problems, and goals with a trainer who is paying attention.",
          image: gymAssets.coachingConversation,
          reverse: true,
        },
      ],
    },
    personalTraining: {
      navLabel: "Personal Training",
      path: "/personal-training",
      hero: {
        eyebrow: "Personal Training",
        title: "One trainer. One plan. One hour focused on you.",
        text: "Training is easier to stick with when someone is watching your form, adjusting the session, and keeping the plan tied to your life.",
        image: gymAssets.coachingWide,
      },
      sections: [
        {
          id: "training-process",
          type: "process",
          eyebrow: "Process",
          title: "How personal training works",
          text: "",
          image: gymAssets.coachingWide,
          items: [
            { title: "Intake", text: "Tell us your goals, training history, injuries, schedule, nutrition needs, and what has made consistency hard.", image: gymAssets.coachingConversation },
            { title: "Plan", text: "Your trainer turns that context into a practical first plan with the right starting point.", image: gymAssets.coachingObserve },
            { title: "Coach", text: "Each session is coached in real time, with form corrections and progressions.", image: gymAssets.clientCable },
            { title: "Adjust", text: "Your plan changes as your body, schedule, and confidence change.", image: gymAssets.coachingAction },
          ],
        },
        {
          id: "technique",
          type: "split",
          eyebrow: "Technique",
          title: "You do not need to know what to do before you arrive.",
          text: "The trainer guides movement selection, intensity, rest, and form. That matters whether you are brand new, returning after years, or already training but stuck.",
          image: gymAssets.clientCable,
        },
        {
          id: "training-support",
          type: "features",
          eyebrow: "Phoenix Fitness",
          title: "Training can support",
          text: "",
          image: gymAssets.clientCable,
          items: [
            { title: "Fat loss and strength", text: "Build a routine that combines resistance training, cardio, and realistic habits.", image: gymAssets.barbell },
            { title: "Confidence with equipment", text: "Learn how to use machines, dumbbells, cables, and bands safely.", image: gymAssets.cableMachine },
            { title: "Accountability", text: "Your trainer keeps the work specific, consistent, and honest.", image: gymAssets.coachingClose },
          ],
        },
        {
          id: "first-session",
          type: "split",
          eyebrow: "First Session",
          title: "Your first workout starts with context, not intensity for its own sake.",
          text: "The intake asks about injuries, history, supplements, nutrition, and availability so the trainer can choose the right starting point and coach the first session with confidence.",
          image: gymAssets.coachingConversation,
          reverse: true,
        },
        {
          id: "coaching-moments",
          type: "features",
          eyebrow: "Coaching Moments",
          title: "What one-on-one coaching looks like",
          text: "",
          image: gymAssets.coachingClient,
          items: [
            { title: "Watch form closely", text: "The trainer observes how the client moves and adjusts the exercise in real time.", image: gymAssets.coachingClient },
            { title: "Coach the setup", text: "Cable work, grips, stance, tempo, and posture can all be coached moment by moment.", image: gymAssets.clientCable },
            { title: "Keep effort appropriate", text: "The goal is productive work that matches the client, not a random hard workout.", image: gymAssets.coachingAction },
          ],
        },
        {
          id: "progress-plan",
          type: "process",
          eyebrow: "Progress",
          title: "How a plan becomes progress",
          text: "",
          image: gymAssets.trainerWide,
          items: [
            { title: "Set the baseline", text: "Start with the client’s current strength, mobility, schedule, and confidence.", image: gymAssets.coachingConversation },
            { title: "Choose the right tools", text: "Use cables, machines, free weights, bands, cardio, or mat work based on the goal.", image: gymAssets.cableMachine },
            { title: "Track what changes", text: "Progress can mean strength, consistency, energy, pain-free movement, or body composition.", image: gymAssets.dumbbellRack },
            { title: "Adjust the next block", text: "The plan changes as the client becomes stronger and more capable.", image: gymAssets.coachingClose },
          ],
        },
        {
          id: "training-tools",
          type: "features",
          eyebrow: "Training Tools",
          title: "The equipment supports many training styles",
          text: "",
          image: gymAssets.cableMachine,
          items: [
            { title: "Cable training", text: "Great for guided strength, controlled movement, and coaching form.", image: gymAssets.cableMachine },
            { title: "Free weights", text: "Dumbbells and barbells help build strength that carries into daily life.", image: gymAssets.dumbbells },
            { title: "Bands and accessories", text: "Useful for mobility, warmups, regressions, and training variety.", image: gymAssets.bands },
          ],
        },
      ],
    },
    facility: {
      navLabel: "Facility",
      path: "/facility",
      hero: {
        eyebrow: "The Facility",
        title: "A private studio with the tools to train the whole body.",
        text: "The space includes strength machines, cables, free weights, bands, cardio equipment, benches, mats, and room to move.",
        image: gymAssets.facilityWide,
      },
      sections: [
        {
          id: "training-floor",
          type: "features",
          eyebrow: "Phoenix Fitness",
          title: "Inside the training floor",
          text: "",
          image: gymAssets.facilityWide,
          items: [
            { title: "Strength machines", text: "Guided resistance equipment for safe, controlled progress.", image: gymAssets.strengthMachines },
            { title: "Free weights", text: "Dumbbells and kettlebells for strength, balance, and full-body work.", image: gymAssets.dumbbells },
            { title: "Bands and accessories", text: "Tools for mobility, rehab-style progressions, and athletic movement.", image: gymAssets.bands },
          ],
        },
        {
          id: "private-studio",
          type: "split",
          eyebrow: "Private Studio",
          title: "Enough equipment to train seriously, without the crowded-gym feeling.",
          text: "The space supports beginner sessions, strength work, conditioning, mobility, and careful return-to-training plans.",
          image: gymAssets.facilityLong,
        },
        {
          id: "location",
          type: "split",
          eyebrow: "Location",
          title: "Easy to recognize from the street.",
          text: "Phoenix Fitness is a real local studio with visible storefront signage and a straightforward arrival experience.",
          image: gymAssets.exteriorWide,
          reverse: true,
        },
        {
          id: "equipment-detail",
          type: "features",
          eyebrow: "Equipment",
          title: "Strength, conditioning, and support tools",
          text: "",
          image: gymAssets.dumbbellRack,
          items: [
            { title: "Cable and machine work", text: "Machine and cable setups support safe progressions and clear coaching cues.", image: gymAssets.hoistDetail },
            { title: "Dumbbells and kettlebells", text: "Organized free weights support strength, balance, and full-body training.", image: gymAssets.kettlebells },
            { title: "Barbell strength", text: "Low-angle barbell detail works well for strength-focused messaging.", image: gymAssets.barbell },
          ],
        },
        {
          id: "room-to-move",
          type: "split",
          eyebrow: "Open Layout",
          title: "The floor has room for machines, benches, mats, and coached movement.",
          text: "The wide facility photos show clear lanes, training stations, mirrors, benches, and enough open floor area for sessions that move between strength, mobility, and conditioning.",
          image: gymAssets.facilityAlt,
        },
        {
          id: "facility-tour",
          type: "features",
          eyebrow: "Tour",
          title: "What clients can expect inside",
          text: "",
          image: gymAssets.facilityOpen,
          items: [
            { title: "Full training floor", text: "A broad look at the main gym space with machines, benches, and mats.", image: gymAssets.facilityOpen },
            { title: "Cardio options", text: "Cardio equipment is available for conditioning and warmups.", image: gymAssets.cardio },
            { title: "Accessory work", text: "Bands, straps, and smaller tools make sessions adaptable.", image: gymAssets.bands },
          ],
        },
        {
          id: "facility-location",
          type: "split",
          eyebrow: "Finding Us",
          title: "Use the storefront images to make the first visit easier.",
          text: "Exterior photos help new clients recognize the building, find the entrance, and feel more confident before they arrive.",
          image: gymAssets.exteriorSide,
          reverse: true,
        },
      ],
    },
    trainersPage: {
      navLabel: "Trainers",
      path: "/trainers",
      hero: {
        eyebrow: "Your Trainers",
        title: "Coaching that watches, listens, and adjusts.",
        text: "The trainer is there to help you train at the right level, understand your form, and stay consistent without feeling lost.",
        image: gymAssets.trainerDemo,
      },
      sections: [
        {
          id: "trainer-cards",
          type: "trainers",
          eyebrow: "Certified Trainers",
          title: "Meet your coaches",
          text: "",
          image: gymAssets.trainerProfile,
        },
        {
          id: "coaching-style",
          type: "split",
          eyebrow: "Coaching Style",
          title: "The work is personal because the context is personal.",
          text: "Your form, goals, schedule, old injuries, nutrition questions, and confidence level all matter. The intake form gives your trainer a useful starting point before the first conversation.",
          image: gymAssets.coachingConversation,
        },
        {
          id: "trainer-method",
          type: "features",
          eyebrow: "Method",
          title: "How trainers support each session",
          text: "",
          image: gymAssets.trainerDemo,
          items: [
            { title: "Demonstrate clearly", text: "Trainer demonstration photos show how clients can see the movement before trying it.", image: gymAssets.trainerDemo },
            { title: "Coach with attention", text: "Close trainer-client images show the trainer watching form and effort.", image: gymAssets.coachingObserve },
            { title: "Adjust in real time", text: "The trainer can change handles, stance, tempo, or resistance during the session.", image: gymAssets.coachingClient },
          ],
        },
        {
          id: "trainer-presence",
          type: "split",
          eyebrow: "Presence",
          title: "A good session feels guided, not guessed.",
          text: "The trainer is there to notice what the client may not notice: posture, control, fatigue, confidence, and the moment an exercise should change.",
          image: gymAssets.trainerFocus,
          reverse: true,
        },
        {
          id: "coach-client-flow",
          type: "process",
          eyebrow: "Session Flow",
          title: "The trainer-client rhythm",
          text: "",
          image: gymAssets.coachingConversation,
          items: [
            { title: "Check in", text: "Review energy, soreness, schedule, and what happened since the last session.", image: gymAssets.coachingConversation },
            { title: "Warm up", text: "Prepare the body for the work planned that day.", image: gymAssets.bands },
            { title: "Train", text: "Move through coached exercises with form feedback and appropriate challenge.", image: gymAssets.clientCable },
            { title: "Leave with clarity", text: "Know what improved, what to practice, and what comes next.", image: gymAssets.coachingClose },
          ],
        },
        {
          id: "trainer-action-gallery",
          type: "features",
          eyebrow: "Action",
          title: "Training is active, observed, and personal",
          text: "",
          image: gymAssets.trainerWide,
          items: [
            { title: "Full-body coaching", text: "Wide action shots show the trainer working in the real studio environment.", image: gymAssets.trainerWide },
            { title: "Technique focus", text: "Mid-shot trainer photos work well for technique and expertise messaging.", image: gymAssets.trainerProfile },
            { title: "Client-centered attention", text: "Client foreground photos show the trainer focused on the person, not just the equipment.", image: gymAssets.coachingClose },
          ],
        },
      ],
    },
    getStarted: {
      navLabel: "Get Started",
      path: "/get-started",
      hero: {
        eyebrow: "Get Started",
        title: "Tell us what you want, what you have tried, and what schedule actually works.",
        text: "This intake is designed to help your trainer understand you before the first session. The more honest you are, the better the plan can be.",
        image: gymAssets.coachingConversation,
      },
      sections: [
        {
          id: "why-intake-matters",
          type: "split",
          eyebrow: "Before You Train",
          title: "The intake helps your trainer understand the person behind the goal.",
          text: "Goals are only useful when they are connected to history, schedule, injuries, nutrition, confidence, and what has made consistency hard before.",
          image: gymAssets.brandCards,
        },
        {
          id: "intake-topics",
          type: "features",
          eyebrow: "What We Ask",
          title: "The form is detailed because the plan should not be generic",
          text: "",
          image: gymAssets.coachingConversation,
          items: [
            { title: "Goals and motivation", text: "Tell us what you want to change and why it matters now.", image: gymAssets.coachingConversation },
            { title: "History and limitations", text: "Past training, injuries, pain, surgeries, and movement limitations shape the starting point.", image: gymAssets.coachingObserve },
            { title: "Schedule and support", text: "Availability, nutrition support, and supplement habits help us make the plan realistic.", image: gymAssets.receptionWide },
          ],
        },
        {
          id: "what-happens-next",
          type: "process",
          eyebrow: "Next Steps",
          title: "After you submit the intake",
          text: "",
          image: gymAssets.brandCards,
          items: [
            { title: "We review your answers", text: "Your trainer looks at goals, history, availability, and health notes before reaching out.", image: gymAssets.brandCards },
            { title: "We clarify the plan", text: "You can ask questions and talk through the right training schedule.", image: gymAssets.coachingConversation },
            { title: "You book the first session", text: "Your first session starts with a clearer picture of what you need.", image: gymAssets.exteriorDoor },
            { title: "Training begins", text: "The plan can evolve as your trainer learns how you move and recover.", image: gymAssets.clientCable },
          ],
        },
        {
          id: "intake",
          type: "intake",
          eyebrow: "Training Intake",
          title: "Build your starting point",
          text: "Answer what you can. We ask about goals, training history, injuries, availability, nutrition, supplements, and motivation so your first conversation is useful instead of generic.",
          image: gymAssets.coachingConversation,
        },
      ],
    },
  },
};

export function mergeSiteContent(content?: Partial<SiteContent> | null): SiteContent {
  const mergedPages = { ...defaultSiteContent.pages };
  for (const key of Object.keys(defaultSiteContent.pages) as PageKey[]) {
    const savedPage = content?.pages?.[key];
    if (!savedPage) {
      continue;
    }

    const savedSections = savedPage.sections || [];
    const savedById = new Map(savedSections.map((section) => [section.id, section]));
    const mergedSections = defaultSiteContent.pages[key].sections.map((section) => ({
      ...section,
      ...savedById.get(section.id),
    }));
    const customSections = savedSections.filter(
      (section) => !defaultSiteContent.pages[key].sections.some((defaultSection) => defaultSection.id === section.id),
    );

    mergedPages[key] = {
      ...defaultSiteContent.pages[key],
      ...savedPage,
      hero: {
        ...defaultSiteContent.pages[key].hero,
        ...savedPage.hero,
      },
      sections: [...mergedSections, ...customSections],
    };
  }

  return {
    ...defaultSiteContent,
    ...content,
    assets: { ...defaultSiteContent.assets, ...content?.assets },
    business: { ...defaultSiteContent.business, ...content?.business },
    hero: { ...defaultSiteContent.hero, ...content?.hero },
    problems: { ...defaultSiteContent.problems, ...content?.problems },
    steps: { ...defaultSiteContent.steps, ...content?.steps },
    difference: { ...defaultSiteContent.difference, ...content?.difference },
    trainers: { ...defaultSiteContent.trainers, ...content?.trainers },
    testimonials: { ...defaultSiteContent.testimonials, ...content?.testimonials },
    contact: { ...defaultSiteContent.contact, ...content?.contact },
    footer: { ...defaultSiteContent.footer, ...content?.footer },
    tracking: { ...defaultSiteContent.tracking, ...content?.tracking },
    pages: mergedPages,
  };
}
