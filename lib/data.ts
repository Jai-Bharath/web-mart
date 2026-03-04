import type { Product, Category } from "./types";

// Seeded pseudo-random number generator for deterministic values
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Fixed base date for deterministic product timestamps (avoids hydration mismatch)
const BASE_DATE = new Date('2025-01-01T00:00:00Z').getTime();

// Helper to clean specifications (remove undefined values)
const cleanSpecs = (specs: Record<string, string | number | undefined>): Record<string, string | number> => {
  const cleaned: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(specs)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

// Categories with icons and subcategories
export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    productCount: 1250,
    subcategories: [
      { id: "smartphones", name: "Smartphones", slug: "smartphones" },
      { id: "laptops", name: "Laptops", slug: "laptops" },
      { id: "tablets", name: "Tablets", slug: "tablets" },
      { id: "cameras", name: "Cameras", slug: "cameras" },
      { id: "audio", name: "Audio & Headphones", slug: "audio" },
      { id: "accessories", name: "Accessories", slug: "accessories" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
    productCount: 3420,
    subcategories: [
      { id: "mens", name: "Men's Clothing", slug: "mens" },
      { id: "womens", name: "Women's Clothing", slug: "womens" },
      { id: "shoes", name: "Shoes", slug: "shoes" },
      { id: "watches", name: "Watches", slug: "watches" },
      { id: "jewelry", name: "Jewelry", slug: "jewelry" },
      { id: "bags", name: "Bags & Luggage", slug: "bags" },
    ],
  },
  {
    id: "home",
    name: "Home & Garden",
    slug: "home",
    icon: "🏠",
    productCount: 2100,
    subcategories: [
      { id: "furniture", name: "Furniture", slug: "furniture" },
      { id: "decor", name: "Home Decor", slug: "decor" },
      { id: "kitchen", name: "Kitchen", slug: "kitchen" },
      { id: "bedding", name: "Bedding", slug: "bedding" },
      { id: "garden", name: "Garden & Outdoor", slug: "garden" },
    ],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    slug: "sports",
    icon: "⚽",
    productCount: 890,
    subcategories: [
      { id: "fitness", name: "Fitness Equipment", slug: "fitness" },
      { id: "outdoor", name: "Outdoor Sports", slug: "outdoor" },
      { id: "team-sports", name: "Team Sports", slug: "team-sports" },
      { id: "cycling", name: "Cycling", slug: "cycling" },
      { id: "sportswear", name: "Sportswear", slug: "sportswear" },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Health",
    slug: "beauty",
    icon: "💄",
    productCount: 1560,
    subcategories: [
      { id: "skincare", name: "Skincare", slug: "skincare" },
      { id: "makeup", name: "Makeup", slug: "makeup" },
      { id: "haircare", name: "Hair Care", slug: "haircare" },
      { id: "fragrance", name: "Fragrance", slug: "fragrance" },
      { id: "health", name: "Health & Wellness", slug: "health" },
    ],
  },
  {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    icon: "🚗",
    productCount: 670,
    subcategories: [
      { id: "parts", name: "Parts & Accessories", slug: "parts" },
      { id: "tools", name: "Tools & Equipment", slug: "tools" },
      { id: "interior", name: "Interior Accessories", slug: "interior" },
      { id: "exterior", name: "Exterior Accessories", slug: "exterior" },
    ],
  },
  {
    id: "books",
    name: "Books & Media",
    slug: "books",
    icon: "📚",
    productCount: 2340,
    subcategories: [
      { id: "fiction", name: "Fiction", slug: "fiction" },
      { id: "non-fiction", name: "Non-Fiction", slug: "non-fiction" },
      { id: "education", name: "Education", slug: "education" },
      { id: "music", name: "Music", slug: "music" },
      { id: "movies", name: "Movies & TV", slug: "movies" },
    ],
  },
  {
    id: "toys",
    name: "Toys & Games",
    slug: "toys",
    icon: "🎮",
    productCount: 1120,
    subcategories: [
      { id: "video-games", name: "Video Games", slug: "video-games" },
      { id: "board-games", name: "Board Games", slug: "board-games" },
      { id: "kids-toys", name: "Kids Toys", slug: "kids-toys" },
      { id: "collectibles", name: "Collectibles", slug: "collectibles" },
    ],
  },
];

// Brands
export const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "LG",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "Levi's",
  "Zara",
  "H&M",
  "Uniqlo",
  "IKEA",
  "Philips",
  "Bose",
  "JBL",
  "Canon",
  "Nikon",
  "GoPro",
  "Dyson",
  "KitchenAid",
  "Instant Pot",
  "Nintendo",
  "PlayStation",
  "Xbox",
];

// Generate realistic product data
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  // Electronics - Smartphones
  const smartphones = [
    {
      id: "iphone-15-pro-max",
      title: "Apple iPhone 15 Pro Max 256GB - Natural Titanium",
      description: "The most powerful iPhone ever with A17 Pro chip, titanium design, and Action button. Features a 6.7\" Super Retina XDR display with ProMotion, 48MP main camera with advanced computational photography, and all-day battery life.",
      price: 1199,
      compareAtPrice: 1299,
      brand: "Apple",
      category: "Electronics",
      subcategory: "Smartphones",
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800"
      ],
      rating: 4.9,
      reviewCount: 12847,
      stock: 156,
      specifications: {
        "Display": "6.7\" Super Retina XDR",
        "Chip": "A17 Pro",
        "Storage": "256GB",
        "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
        "Battery": "Up to 29 hours video playback",
        "5G": "Yes",
        "Weight": "221g",
      },
      features: [
        "Titanium design with textured matte glass",
        "Ceramic Shield front cover",
        "Action button for quick access",
        "USB-C connector with USB 3",
        "ProRes video recording"
      ],
      tags: ["iphone", "apple", "smartphone", "5g", "pro"],
      freeShipping: true,
      shippingTime: "1-2 days",
    },
    {
      id: "samsung-s24-ultra",
      title: "Samsung Galaxy S24 Ultra 512GB - Titanium Gray",
      description: "Meet Galaxy AI. The Samsung Galaxy S24 Ultra features the ultimate AI experience with a 200MP camera, S Pen, and titanium frame. The 6.8\" QHD+ Dynamic AMOLED display delivers stunning visuals.",
      price: 1299,
      compareAtPrice: 1419,
      brand: "Samsung",
      category: "Electronics",
      subcategory: "Smartphones",
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800"
      ],
      rating: 4.8,
      reviewCount: 8932,
      stock: 89,
      specifications: {
        "Display": "6.8\" QHD+ Dynamic AMOLED 2X",
        "Processor": "Snapdragon 8 Gen 3",
        "Storage": "512GB",
        "Camera": "200MP + 12MP + 10MP + 50MP",
        "Battery": "5000mAh",
        "5G": "Yes",
        "S Pen": "Included",
      },
      features: [
        "Galaxy AI with Circle to Search",
        "200MP adaptive pixel sensor",
        "S Pen with AI assistance",
        "Titanium frame",
        "100x Space Zoom"
      ],
      tags: ["samsung", "galaxy", "smartphone", "5g", "s-pen"],
      freeShipping: true,
      shippingTime: "1-2 days",
    },
    {
      id: "google-pixel-8-pro",
      title: "Google Pixel 8 Pro 256GB - Obsidian",
      description: "The best of Google AI in a premium smartphone. Pixel 8 Pro features the Tensor G3 chip, Super Actua display, and Pro-level camera with Magic Eraser, Photo Unblur, and Best Take.",
      price: 999,
      compareAtPrice: 1099,
      brand: "Google",
      category: "Electronics",
      subcategory: "Smartphones",
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"
      ],
      rating: 4.7,
      reviewCount: 5621,
      stock: 234,
      specifications: {
        "Display": "6.7\" Super Actua LTPO OLED",
        "Processor": "Google Tensor G3",
        "Storage": "256GB",
        "Camera": "50MP + 48MP + 48MP",
        "Battery": "5050mAh",
        "5G": "Yes",
      },
      features: [
        "Tensor G3 with advanced AI",
        "Magic Eraser & Photo Unblur",
        "7 years of OS updates",
        "Temperature sensor",
        "Pro-level 4K video"
      ],
      tags: ["google", "pixel", "smartphone", "ai", "android"],
      freeShipping: true,
      shippingTime: "2-3 days",
    },
  ];

  // Electronics - Laptops
  const laptops = [
    {
      id: "macbook-pro-16-m3",
      title: "Apple MacBook Pro 16\" M3 Max - 36GB RAM, 1TB SSD",
      description: "The most powerful MacBook Pro ever. With M3 Max chip delivering extraordinary performance for the most demanding workflows. 16.2\" Liquid Retina XDR display with ProMotion for stunning visuals.",
      price: 3499,
      compareAtPrice: 3699,
      brand: "Apple",
      category: "Electronics",
      subcategory: "Laptops",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"
      ],
      rating: 4.9,
      reviewCount: 3421,
      stock: 45,
      specifications: {
        "Chip": "Apple M3 Max",
        "RAM": "36GB Unified Memory",
        "Storage": "1TB SSD",
        "Display": "16.2\" Liquid Retina XDR",
        "Battery": "Up to 22 hours",
        "Ports": "3x Thunderbolt 4, HDMI, MagSafe 3, SD card",
      },
      features: [
        "M3 Max with 14-core CPU and 30-core GPU",
        "Up to 22 hours battery life",
        "ProMotion technology with 120Hz",
        "Six-speaker sound system",
        "1080p FaceTime HD camera"
      ],
      tags: ["macbook", "apple", "laptop", "pro", "m3"],
      freeShipping: true,
      shippingTime: "3-5 days",
    },
    {
      id: "dell-xps-15",
      title: "Dell XPS 15 - Intel Core i9, 32GB RAM, 1TB SSD, RTX 4070",
      description: "Premium performance in a stunning design. The XPS 15 features a brilliant 15.6\" OLED display, 13th Gen Intel Core i9, and NVIDIA GeForce RTX 4070 for creative and professional work.",
      price: 2499,
      compareAtPrice: 2799,
      brand: "Dell",
      category: "Electronics",
      subcategory: "Laptops",
      images: [
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800"
      ],
      rating: 4.7,
      reviewCount: 2156,
      stock: 67,
      specifications: {
        "Processor": "Intel Core i9-13900H",
        "RAM": "32GB DDR5",
        "Storage": "1TB NVMe SSD",
        "Graphics": "NVIDIA RTX 4070 8GB",
        "Display": "15.6\" 3.5K OLED",
        "Battery": "86Whr",
      },
      features: [
        "InfinityEdge OLED display",
        "CNC machined aluminum chassis",
        "Windows Hello IR camera",
        "Thunderbolt 4 ports",
        "Wi-Fi 6E"
      ],
      tags: ["dell", "xps", "laptop", "nvidia", "oled"],
      freeShipping: true,
      shippingTime: "2-4 days",
    },
    {
      id: "thinkpad-x1-carbon",
      title: "Lenovo ThinkPad X1 Carbon Gen 11 - Intel Core i7, 16GB, 512GB",
      description: "The legendary business laptop, reimagined. X1 Carbon Gen 11 delivers unmatched portability with 13th Gen Intel vPro, stunning 2.8K OLED display, and all-day battery life.",
      price: 1849,
      compareAtPrice: 2099,
      brand: "Lenovo",
      category: "Electronics",
      subcategory: "Laptops",
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"
      ],
      rating: 4.8,
      reviewCount: 1823,
      stock: 112,
      specifications: {
        "Processor": "Intel Core i7-1365U vPro",
        "RAM": "16GB LPDDR5",
        "Storage": "512GB SSD",
        "Display": "14\" 2.8K OLED",
        "Battery": "57Whr",
        "Weight": "1.12kg",
      },
      features: [
        "MIL-STD-810H tested durability",
        "Intel vPro Enterprise",
        "Rapid Charge technology",
        "Dolby Atmos speakers",
        "Privacy shutter camera"
      ],
      tags: ["lenovo", "thinkpad", "business", "lightweight"],
      freeShipping: true,
      shippingTime: "2-3 days",
    },
  ];

  // Electronics - Audio
  const audio = [
    {
      id: "airpods-pro-2",
      title: "Apple AirPods Pro (2nd Generation) with MagSafe Case",
      description: "Rebuilt from the sound up with H2 chip. AirPods Pro deliver Adaptive Audio, Active Noise Cancellation, and Transparency mode. Now with USB-C MagSafe Charging Case.",
      price: 249,
      compareAtPrice: 279,
      brand: "Apple",
      category: "Electronics",
      subcategory: "Audio",
      images: [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800"
      ],
      rating: 4.8,
      reviewCount: 45231,
      stock: 567,
      specifications: {
        "Chip": "H2",
        "Active Noise Cancellation": "Yes",
        "Battery": "6 hours (30 with case)",
        "Water Resistant": "IPX4",
        "Charging": "USB-C, MagSafe, Qi",
      },
      features: [
        "Adaptive Audio with Conversation Awareness",
        "Personalized Spatial Audio",
        "Touch control for media and calls",
        "Find My support with Precision Finding",
        "Sweat and water resistant"
      ],
      tags: ["airpods", "apple", "wireless", "earbuds", "anc"],
      freeShipping: true,
      shippingTime: "1-2 days",
    },
    {
      id: "sony-wh1000xm5",
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      description: "Industry-leading noise cancellation meets exceptional sound. WH-1000XM5 features 8 microphones, 30-hour battery, and supremely comfortable design for immersive listening.",
      price: 349,
      compareAtPrice: 399,
      brand: "Sony",
      category: "Electronics",
      subcategory: "Audio",
      images: [
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800"
      ],
      rating: 4.9,
      reviewCount: 23456,
      stock: 234,
      specifications: {
        "Driver": "30mm",
        "Battery": "30 hours",
        "Quick Charge": "3 min = 3 hours",
        "Weight": "250g",
        "Bluetooth": "5.2",
      },
      features: [
        "Auto NC Optimizer",
        "Speak-to-Chat",
        "Multipoint connection",
        "LDAC Hi-Res Audio",
        "30 hours battery life"
      ],
      tags: ["sony", "headphones", "noise-cancelling", "wireless"],
      freeShipping: true,
      shippingTime: "1-2 days",
    },
    {
      id: "bose-qc-ultra",
      title: "Bose QuietComfort Ultra Headphones",
      description: "Immersive Audio unlocks a new dimension of sound. QuietComfort Ultra delivers world-class noise cancellation, spatial audio, and breakthrough comfort for all-day listening.",
      price: 429,
      compareAtPrice: 479,
      brand: "Bose",
      category: "Electronics",
      subcategory: "Audio",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
      ],
      rating: 4.8,
      reviewCount: 8765,
      stock: 145,
      specifications: {
        "Battery": "24 hours",
        "Quick Charge": "15 min = 2.5 hours",
        "Bluetooth": "5.3",
        "Weight": "250g",
        "Noise Cancellation": "CustomTune",
      },
      features: [
        "Bose Immersive Audio",
        "CustomTune technology",
        "Aware Mode with ActiveSense",
        "Multipoint Bluetooth",
        "Premium comfort design"
      ],
      tags: ["bose", "headphones", "noise-cancelling", "premium"],
      freeShipping: true,
      shippingTime: "2-3 days",
    },
  ];

  // Fashion Items
  const fashion = [
    {
      id: "nike-air-jordan-1",
      title: "Nike Air Jordan 1 Retro High OG - Chicago",
      description: "The shoe that started it all. The Air Jordan 1 Retro High OG brings back the iconic silhouette with premium leather and the classic Chicago colorway that defined sneaker culture.",
      price: 180,
      compareAtPrice: 220,
      brand: "Nike",
      category: "Fashion",
      subcategory: "Shoes",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
      ],
      rating: 4.9,
      reviewCount: 34567,
      stock: 89,
      specifications: {
        "Upper": "Full-grain leather",
        "Sole": "Rubber cupsole",
        "Closure": "Laces",
        "Style": "High Top",
        "Color": "White/Black-Varsity Red",
      },
      features: [
        "Premium leather upper",
        "Nike Air cushioning",
        "Perforated toe box",
        "Wings logo on collar",
        "Iconic Nike Swoosh"
      ],
      tags: ["nike", "jordan", "sneakers", "basketball"],
      freeShipping: false,
      shippingTime: "3-5 days",
    },
    {
      id: "levis-501-original",
      title: "Levi's 501 Original Fit Jeans - Dark Stonewash",
      description: "The original blue jean since 1873. 501 jeans are the signature of authentic style, featuring a straight leg, button fly, and the iconic fit that started it all.",
      price: 79,
      compareAtPrice: 98,
      brand: "Levi's",
      category: "Fashion",
      subcategory: "Men's Clothing",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
      ],
      rating: 4.7,
      reviewCount: 12890,
      stock: 456,
      specifications: {
        "Fit": "Original",
        "Rise": "Regular",
        "Material": "100% Cotton Denim",
        "Closure": "Button Fly",
        "Leg": "Straight",
      },
      features: [
        "Signature straight fit",
        "Button fly closure",
        "5-pocket styling",
        "Iconic leather patch",
        "Stonewash finish"
      ],
      tags: ["levis", "jeans", "denim", "classic"],
      freeShipping: false,
      shippingTime: "2-4 days",
    },
    {
      id: "apple-watch-ultra-2",
      title: "Apple Watch Ultra 2 - 49mm Titanium with Ocean Band",
      description: "The most capable Apple Watch ever. Built for endurance athletes and outdoor adventurers with precision dual-frequency GPS, up to 36 hours battery life, and the brightest Apple display ever.",
      price: 799,
      compareAtPrice: 899,
      brand: "Apple",
      category: "Fashion",
      subcategory: "Watches",
      images: [
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800"
      ],
      rating: 4.9,
      reviewCount: 8923,
      stock: 78,
      specifications: {
        "Case": "49mm Titanium",
        "Display": "Always-On Retina LTPO OLED",
        "Water Resistance": "100m",
        "Battery": "Up to 36 hours",
        "Chip": "S9 SiP",
      },
      features: [
        "Precision dual-frequency GPS",
        "Depth gauge and water temperature",
        "86-decibel siren",
        "Action button",
        "Titanium case"
      ],
      tags: ["apple", "watch", "fitness", "outdoor"],
      freeShipping: true,
      shippingTime: "2-3 days",
    },
  ];

  // Home & Garden
  const home = [
    {
      id: "dyson-v15-detect",
      title: "Dyson V15 Detect Absolute Cordless Vacuum",
      description: "The most powerful, intelligent cordless vacuum. V15 Detect reveals microscopic dust with a laser, counts and sizes particles, and automatically adjusts suction power.",
      price: 749,
      compareAtPrice: 849,
      brand: "Dyson",
      category: "Home & Garden",
      subcategory: "Kitchen",
      images: [
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800"
      ],
      rating: 4.8,
      reviewCount: 7654,
      stock: 123,
      specifications: {
        "Suction Power": "240 AW",
        "Runtime": "Up to 60 minutes",
        "Bin Volume": "0.76L",
        "Weight": "3.1kg",
        "Filtration": "Advanced HEPA",
      },
      features: [
        "Laser dust detection",
        "Piezo sensor particle counting",
        "LCD screen display",
        "Anti-tangle technology",
        "5-stage filtration"
      ],
      tags: ["dyson", "vacuum", "cordless", "cleaning"],
      freeShipping: true,
      shippingTime: "2-4 days",
    },
    {
      id: "instant-pot-duo-plus",
      title: "Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker 6Qt",
      description: "The world's best-selling multi-cooker. Duo Plus combines 9 appliances in one: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, egg cooker, yogurt maker, warmer, and sterilizer.",
      price: 119,
      compareAtPrice: 149,
      brand: "Instant Pot",
      category: "Home & Garden",
      subcategory: "Kitchen",
      images: [
        "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=800"
      ],
      rating: 4.7,
      reviewCount: 56789,
      stock: 567,
      specifications: {
        "Capacity": "6 Quart",
        "Wattage": "1000W",
        "Programs": "15 Smart Programs",
        "Pressure": "10.15-11.6 psi",
        "Material": "Stainless Steel",
      },
      features: [
        "9-in-1 functionality",
        "15 one-touch smart programs",
        "Advanced safety features",
        "Whisper-quiet steam release",
        "Easy-seal lid"
      ],
      tags: ["instant-pot", "kitchen", "pressure-cooker", "cooking"],
      freeShipping: true,
      shippingTime: "2-3 days",
    },
    {
      id: "ikea-kallax-shelf",
      title: "IKEA KALLAX Shelf Unit 4x4 - White",
      description: "Versatile storage that fits your space and style. KALLAX is perfect for everything from books and decorations to baskets and boxes. Use it as a room divider or against a wall.",
      price: 199,
      compareAtPrice: 249,
      brand: "IKEA",
      category: "Home & Garden",
      subcategory: "Furniture",
      images: [
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"
      ],
      rating: 4.6,
      reviewCount: 23456,
      stock: 234,
      specifications: {
        "Width": "147 cm",
        "Depth": "39 cm",
        "Height": "147 cm",
        "Material": "Particleboard with white finish",
        "Compartments": "16",
      },
      features: [
        "16 cube compartments",
        "Compatible with KALLAX inserts",
        "Can be used as room divider",
        "Easy assembly",
        "Wall mounting required"
      ],
      tags: ["ikea", "furniture", "storage", "organization"],
      freeShipping: false,
      shippingTime: "5-7 days",
    },
  ];

  // Gaming & Toys
  const gaming = [
    {
      id: "ps5-console",
      title: "Sony PlayStation 5 Console - Disc Edition",
      description: "Experience lightning-fast loading, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. PS5 delivers a new generation of incredible PlayStation games.",
      price: 499,
      compareAtPrice: 549,
      brand: "Sony",
      category: "Toys & Games",
      subcategory: "Video Games",
      images: [
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"
      ],
      rating: 4.9,
      reviewCount: 34567,
      stock: 45,
      specifications: {
        "CPU": "AMD Zen 2 8-core",
        "GPU": "AMD RDNA 2 10.28 TFLOPS",
        "RAM": "16GB GDDR6",
        "Storage": "825GB SSD",
        "Resolution": "Up to 8K",
      },
      features: [
        "Ultra-high speed SSD",
        "DualSense controller",
        "Ray tracing support",
        "3D Audio",
        "Backward compatible with PS4"
      ],
      tags: ["playstation", "ps5", "gaming", "console"],
      freeShipping: true,
      shippingTime: "1-2 days",
    },
    {
      id: "nintendo-switch-oled",
      title: "Nintendo Switch OLED Model - White",
      description: "Play at home on your TV or in handheld mode with the vibrant 7-inch OLED screen. Nintendo Switch OLED Model features enhanced audio, 64GB storage, and a wide adjustable stand.",
      price: 349,
      compareAtPrice: 379,
      brand: "Nintendo",
      category: "Toys & Games",
      subcategory: "Video Games",
      images: [
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800"
      ],
      rating: 4.8,
      reviewCount: 28934,
      stock: 178,
      specifications: {
        "Screen": "7-inch OLED",
        "Resolution": "1280x720 (handheld)",
        "Storage": "64GB",
        "Battery": "4.5-9 hours",
        "Modes": "TV, Tabletop, Handheld",
      },
      features: [
        "Vibrant 7-inch OLED screen",
        "Wide adjustable stand",
        "Enhanced audio",
        "64GB internal storage",
        "Wired LAN port in dock"
      ],
      tags: ["nintendo", "switch", "gaming", "portable"],
      freeShipping: true,
      shippingTime: "1-2 days",
    },
    {
      id: "xbox-series-x",
      title: "Microsoft Xbox Series X - 1TB",
      description: "Power your dreams with Xbox Series X. Experience 12 teraflops of raw graphic processing power, DirectX ray tracing, 4K gaming up to 120 FPS, and incredibly quick load times.",
      price: 499,
      compareAtPrice: 549,
      brand: "Microsoft",
      category: "Toys & Games",
      subcategory: "Video Games",
      images: [
        "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800"
      ],
      rating: 4.8,
      reviewCount: 21345,
      stock: 67,
      specifications: {
        "CPU": "AMD Zen 2 8-core",
        "GPU": "12 TFLOPS",
        "RAM": "16GB GDDR6",
        "Storage": "1TB SSD",
        "Resolution": "Up to 8K",
      },
      features: [
        "True 4K gaming",
        "120 FPS support",
        "DirectX ray tracing",
        "Quick Resume",
        "Smart Delivery"
      ],
      tags: ["xbox", "microsoft", "gaming", "console"],
      freeShipping: true,
      shippingTime: "1-2 days",
    },
  ];

  // Beauty & Health
  const beauty = [
    {
      id: "dyson-airwrap",
      title: "Dyson Airwrap Multi-Styler Complete Long",
      description: "Engineer your hair with the Dyson Airwrap. Curl, wave, smooth, and dry with no extreme heat. Redesigned attachments for faster, easier styling.",
      price: 599,
      compareAtPrice: 649,
      brand: "Dyson",
      category: "Beauty & Health",
      subcategory: "Hair Care",
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"
      ],
      rating: 4.7,
      reviewCount: 12345,
      stock: 89,
      specifications: {
        "Motor": "Dyson digital motor V9",
        "Heat Settings": "3",
        "Airflow Settings": "3",
        "Cord Length": "2.675m",
        "Weight": "325g",
      },
      features: [
        "Coanda air styling",
        "No extreme heat",
        "Intelligent heat control",
        "Multi-functional attachments",
        "Enhanced Coanda airflow"
      ],
      tags: ["dyson", "hair", "styling", "beauty"],
      freeShipping: true,
      shippingTime: "2-3 days",
    },
    {
      id: "la-mer-moisturizer",
      title: "La Mer Crème de la Mer Moisturizing Cream 60ml",
      description: "The iconic moisturizer. Crème de la Mer transforms skin with the healing powers of the sea. Miracle Broth™ deeply moisturizes and renews for a radiant, healthy-looking glow.",
      price: 380,
      compareAtPrice: 420,
      brand: "La Mer",
      category: "Beauty & Health",
      subcategory: "Skincare",
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"
      ],
      rating: 4.6,
      reviewCount: 5678,
      stock: 45,
      specifications: {
        "Size": "60ml",
        "Skin Type": "All skin types",
        "Concerns": "Dryness, Fine Lines",
        "Texture": "Rich cream",
        "Key Ingredient": "Miracle Broth™",
      },
      features: [
        "Miracle Broth™ formula",
        "Deep moisturization",
        "Softens and smooths",
        "Visibly heals dryness",
        "Luxury skincare experience"
      ],
      tags: ["la-mer", "skincare", "moisturizer", "luxury"],
      freeShipping: true,
      shippingTime: "2-4 days",
    },
  ];

  // Sports & Fitness
  const sports = [
    {
      id: "peloton-bike-plus",
      title: "Peloton Bike+ - Premium Indoor Exercise Bike",
      description: "The most immersive Peloton Bike ever. Features a 23.8\" rotating HD touchscreen, Auto Follow resistance, Apple GymKit integration, and thousands of live & on-demand classes.",
      price: 2495,
      compareAtPrice: 2795,
      brand: "Peloton",
      category: "Sports & Fitness",
      subcategory: "Fitness Equipment",
      images: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
      ],
      rating: 4.8,
      reviewCount: 9876,
      stock: 23,
      specifications: {
        "Screen": "23.8\" HD touchscreen",
        "Resistance": "100 levels",
        "Dimensions": "59\" L x 22\" W x 59\" H",
        "Weight Capacity": "297 lbs",
        "Connectivity": "WiFi, Bluetooth, ANT+",
      },
      features: [
        "Rotating HD touchscreen",
        "Auto Follow resistance",
        "Apple GymKit integration",
        "Rear-facing soundbar",
        "Unlimited profiles"
      ],
      tags: ["peloton", "fitness", "cycling", "exercise"],
      freeShipping: true,
      shippingTime: "7-10 days",
    },
    {
      id: "garmin-fenix-7x",
      title: "Garmin Fenix 7X Solar Sapphire - Multisport GPS Watch",
      description: "The ultimate adventure watch. Fenix 7X Solar features solar charging, multi-band GPS, detailed topo maps, and advanced training metrics for serious athletes.",
      price: 899,
      compareAtPrice: 999,
      brand: "Garmin",
      category: "Sports & Fitness",
      subcategory: "Fitness Equipment",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
      ],
      rating: 4.9,
      reviewCount: 6789,
      stock: 67,
      specifications: {
        "Display": "1.4\" sunlight-visible",
        "Battery": "Up to 37 days (solar)",
        "GPS": "Multi-band with SatIQ",
        "Water Rating": "10 ATM",
        "Storage": "32GB",
      },
      features: [
        "Solar charging",
        "Multi-band GPS",
        "Offline maps",
        "Recovery advisor",
        "Training status insights"
      ],
      tags: ["garmin", "watch", "fitness", "outdoor"],
      freeShipping: true,
      shippingTime: "2-3 days",
    },
  ];

  // Additional random products to make 1000+
  const moreProducts = [
    {
      id: "canon-eos-r5",
      title: "Canon EOS R5 Mirrorless Camera Body",
      description: "Revolutionary 8K video and 45MP stills. The EOS R5 delivers unprecedented image quality with Dual Pixel CMOS AF II and in-body image stabilization.",
      price: 3899,
      brand: "Canon",
      category: "Electronics",
      subcategory: "Cameras",
      images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
      rating: 4.9,
      reviewCount: 4567,
      stock: 34,
      specifications: { "Sensor": "45MP Full-Frame", "Video": "8K RAW", "AF Points": "5940" },
      features: ["8K video recording", "45MP full-frame sensor", "In-body IS", "Dual card slots"],
      tags: ["canon", "camera", "mirrorless", "professional"],
      freeShipping: true,
      shippingTime: "2-4 days",
    },
    {
      id: "lg-c3-oled-65",
      title: "LG C3 65\" 4K OLED evo Smart TV",
      description: "Perfect blacks and infinite contrast. LG OLED evo brings your content to life with α9 AI Processor Gen6, Dolby Vision IQ, and webOS 23.",
      price: 1796,
      brand: "LG",
      category: "Electronics",
      subcategory: "TVs",
      images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"],
      rating: 4.8,
      reviewCount: 7890,
      stock: 56,
      specifications: { "Screen": "65\" OLED", "Resolution": "4K UHD", "HDR": "Dolby Vision IQ" },
      features: ["Self-lit pixels", "α9 Gen6 AI Processor", "4 HDMI 2.1 ports", "G-Sync & FreeSync"],
      tags: ["lg", "tv", "oled", "4k"],
      freeShipping: true,
      shippingTime: "3-5 days",
    },
  ];

  // Combine all products
  const allProducts = [
    ...smartphones,
    ...laptops,
    ...audio,
    ...fashion,
    ...home,
    ...gaming,
    ...beauty,
    ...sports,
    ...moreProducts,
  ];

  // Generate seller info and return formatted products
  const sellers = [
    { id: "seller-1", name: "TechWorld Official", rating: 4.9 },
    { id: "seller-2", name: "Fashion Hub", rating: 4.8 },
    { id: "seller-3", name: "Home Essentials", rating: 4.7 },
    { id: "seller-4", name: "Sports Pro", rating: 4.8 },
    { id: "seller-5", name: "Beauty Palace", rating: 4.6 },
    { id: "seller-6", name: "Gaming Zone", rating: 4.9 },
    { id: "seller-7", name: "Global Gadgets", rating: 4.7 },
  ];

  allProducts.forEach((product, index) => {
    const seller = sellers[index % sellers.length];
    products.push({
      ...product,
      specifications: cleanSpecs(product.specifications),
      currency: "USD",
      sellerId: seller.id,
      sellerName: seller.name,
      sellerRating: seller.rating,
      status: "active",
      createdAt: new Date(BASE_DATE - index * 24 * 60 * 60 * 1000).toISOString(),
    } as Product);
  });

  // Duplicate and modify to create 1000+ products
  const baseCount = products.length;
  for (let i = 0; i < 50; i++) {
    products.forEach((product, index) => {
      if (products.length >= 1000) return;
      
      const variation = i + 1;
      const seed = i * 1000 + index;
      const priceMultiplier = 0.8 + seededRandom(seed) * 0.4; // 80% to 120% of original price
      const titleSeed = seed + 100;
      const newProduct: Product = {
        ...product,
        id: `${product.id}-v${variation}-${index}`,
        title: product.title.replace(/\d+GB|\d+\"|\d+mm/g, (match, offset) => {
          const num = parseInt(match);
          return isNaN(num) ? match : `${Math.round(num * (0.5 + seededRandom(titleSeed + offset)))}${match.replace(/\d+/, '')}`;
        }),
        price: Math.round(product.price * priceMultiplier),
        compareAtPrice: product.compareAtPrice ? Math.round(product.compareAtPrice * priceMultiplier) : undefined,
        rating: Math.round((product.rating - 0.3 + seededRandom(seed + 200) * 0.6) * 10) / 10,
        reviewCount: Math.round(product.reviewCount * (0.1 + seededRandom(seed + 300) * 2)),
        stock: Math.round(product.stock * seededRandom(seed + 400) * 3),
        createdAt: new Date(BASE_DATE - seed * 60 * 60 * 1000).toISOString(),
      };
      products.push(newProduct);
    });
  }

  return products.slice(0, 1200); // Return 1200 products
};

export const products = generateProducts();

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};

export const getProductsByIds = (ids: string[]): Product[] => {
  return products.filter((p) => ids.includes(p.id));
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

export const filterProducts = (
  filters: {
    search?: string;
    category?: string;
    brands?: string[];
    priceRange?: [number, number];
    rating?: number;
    freeShipping?: boolean;
    inStock?: boolean;
    sortBy?: string;
  }
): Product[] => {
  let result = [...products];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
    );
  }

  if (filters.category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  if (filters.brands && filters.brands.length > 0) {
    result = result.filter((p) =>
      filters.brands!.some((b) => b.toLowerCase() === p.brand.toLowerCase())
    );
  }

  if (filters.priceRange) {
    result = result.filter(
      (p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
    );
  }

  if (filters.rating) {
    result = result.filter((p) => p.rating >= filters.rating!);
  }

  if (filters.freeShipping) {
    result = result.filter((p) => p.freeShipping);
  }

  if (filters.inStock) {
    result = result.filter((p) => p.stock > 0);
  }

  // Sorting
  switch (filters.sortBy) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "bestselling":
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return result;
};

// Featured products
export const featuredProducts = products.filter(p => p.rating >= 4.7).slice(0, 12);

// Deal products (with compareAtPrice)
export const dealProducts = products.filter(p => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 8);

// New arrivals
export const newArrivals = products
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 12);

// Top rated
export const topRated = products
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 12);
