// Professional prize logic with Lucide React icons
import { Key, DollarSign, Percent, Gift, Globe, FileText, Gem } from 'lucide-react';

// Prize configuration with professional icons
export const PRIZES = [
  {
    id: 1,
    name: "Keyring (Single)",
    description: "Get a premium Boraq keyring!",
    probability: 14, // 14%
    color: "#FF6B6B",
    icon: "K", // Will be rendered as Key icon
    iconComponent: Key,
    value: "low"
  },
  {
    id: 2,
    name: "Keyring (Double Win!)",
    description: "Double keyring win - Get 2 premium keyrings!",
    probability: 14, // 14%
    color: "#4ECDC4",
    icon: "2K", // Will show as double key icon
    iconComponent: Key,
    value: "low"
  },
  {
    id: 3,
    name: "Discount – 20% Off",
    description: "20% discount on any Boraq service!",
    probability: 18, // 18%
    color: "#45B7D1",
    icon: "20%", // Will be rendered as Percent icon
    iconComponent: Percent,
    value: "medium"
  },
  {
    id: 4,
    name: "Discount – 50% Off (Big Win)",
    description: "HUGE WIN! 50% off any Boraq service!",
    probability: 10, // 10%
    color: "#F39C12",
    icon: "50%", // Will be rendered as Gift icon for big win
    iconComponent: Gift,
    value: "high"
  },
  {
    id: 5,
    name: "৳2000 OFF Voucher",
    description: "৳2000 OFF on Web & App OR UI & Branding services",
    probability: 14, // 14%
    color: "#9B59B6",
    icon: "৳2K", // Will be rendered as Gem icon
    iconComponent: Gem,
    value: "high"
  },
  {
    id: 6,
    name: "Free 1-Page Landing Website",
    description: "Complete free 1-page landing website!",
    probability: 10, // 10%
    color: "#E74C3C",
    icon: "WEB", // Will be rendered as Globe icon
    iconComponent: Globe,
    value: "premium"
  },
  {
    id: 7,
    name: "Try Again / No Win",
    description: "Better luck next time! Take our brochure.",
    probability: 20, // 20%
    color: "#95A5A6",
    icon: "INFO", // Will be rendered as FileText icon
    iconComponent: FileText,
    value: "none"
  }
];

// Calculate weighted random selection
export const getRandomPrize = () => {
  // Create weighted array
  const weightedPrizes = [];

  PRIZES.forEach(prize => {
    for (let i = 0; i < prize.probability; i++) {
      weightedPrizes.push(prize);
    }
  });

  // Select random prize
  const randomIndex = Math.floor(Math.random() * weightedPrizes.length);
  return weightedPrizes[randomIndex];
};

// Calculate rotation angle for each slice (360° / 7 slices = ~51.43°)
export const SLICE_ANGLE = 360 / PRIZES.length;

// Calculate final rotation for wheel animation
export const calculateWheelRotation = (prizeIndex) => {
  // Add extra rotations for dramatic effect (3-5 full rotations)
  const extraRotations = 3 + Math.random() * 2;
  const baseRotation = extraRotations * 360;

  // Calculate target slice position (center of slice)
  const targetAngle = (PRIZES.length - prizeIndex) * SLICE_ANGLE - (SLICE_ANGLE / 2);

  // Add some randomness within the slice
  const randomOffset = (Math.random() - 0.5) * (SLICE_ANGLE * 0.8);

  return baseRotation + targetAngle + randomOffset;
};

// Get prize by index
export const getPrizeByIndex = (index) => {
  return PRIZES[index] || PRIZES[6]; // Default to "Try Again" if invalid index
};

// Validate prize distribution (should total 100%)
export const validatePrizeDistribution = () => {
  const total = PRIZES.reduce((sum, prize) => sum + prize.probability, 0);
  if (total !== 100) {
    console.warn(`Prize distribution total is ${total}%, should be 100%`);
  }
  return total === 100;
};

// Prize instructions for winners
export const getPrizeInstructions = (prize) => {
  const instructions = {
    1: "Visit our booth to collect your Boraq keyring!",
    2: "Amazing! Visit our booth to collect your 2 Boraq keyrings!",
    3: "Show this screen at our booth to redeem your 20% discount!",
    4: "INCREDIBLE WIN! Show this screen to redeem your 50% discount!",
    5: "Fantastic! Contact us to redeem your ৳2000 voucher for web/app or UI/branding services!",
    6: "ULTIMATE PRIZE! Contact us to claim your free 1-page landing website!",
    7: "Thanks for playing! Visit our booth for a Boraq brochure and learn about our services."
  };

  return instructions[prize.id] || "Contact our team for more information!";
};
