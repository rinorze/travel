// Starter destinations, used by `npm run seed` and the admin-only seed route.
const destinations = [
  {
    name: "Santorini",
    country: "Greece",
    description:
      "Iconic white-washed buildings perched on volcanic cliffs overlooking the deep blue Aegean Sea. Famous for breathtaking sunsets and romantic ambiance.",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    price: 1200,
    rating: 4.9,
    category: "beach",
    featured: true,
  },
  {
    name: "Kyoto",
    country: "Japan",
    description:
      "Ancient temples, traditional tea houses, and stunning bamboo forests. Experience the timeless beauty of Japanese culture and architecture.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    price: 1500,
    rating: 4.8,
    category: "cultural",
    featured: true,
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    description:
      "Majestic snow-capped peaks, pristine lakes, and charming alpine villages. A paradise for hiking, skiing, and nature photography.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    price: 2000,
    rating: 4.9,
    category: "mountain",
    featured: true,
  },
  {
    name: "Bali",
    country: "Indonesia",
    description:
      "Lush rice terraces, sacred temples, and vibrant coral reefs. A tropical paradise blending spirituality with natural beauty.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    price: 800,
    rating: 4.7,
    category: "beach",
    featured: true,
  },
  {
    name: "Patagonia",
    country: "Argentina",
    description:
      "Dramatic glaciers, rugged peaks, and vast wilderness at the edge of the world. An adventurer's ultimate destination.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    price: 1800,
    rating: 4.8,
    category: "adventure",
    featured: true,
  },
  {
    name: "Barcelona",
    country: "Spain",
    description:
      "Gaudi's architectural masterpieces, vibrant street life, and Mediterranean beaches. A city where art and culture collide.",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    price: 950,
    rating: 4.6,
    category: "city",
    featured: false,
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    description:
      "The legendary lost city of the Incas, set high in the Andes Mountains. A bucket-list archaeological wonder.",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    price: 1400,
    rating: 4.9,
    category: "cultural",
    featured: true,
  },
  {
    name: "Maldives",
    country: "Maldives",
    description:
      "Crystal-clear turquoise waters, overwater bungalows, and pristine white sand beaches. The ultimate tropical escape.",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    price: 2500,
    rating: 4.9,
    category: "beach",
    featured: false,
  },
  {
    name: "Iceland",
    country: "Iceland",
    description:
      "Northern lights, volcanic landscapes, geysers, and hot springs. A land of fire and ice unlike anywhere else.",
    image:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    price: 1700,
    rating: 4.7,
    category: "adventure",
    featured: false,
  },
  {
    name: "Marrakech",
    country: "Morocco",
    description:
      "Colorful souks, ornate palaces, and the intoxicating aroma of spices. A sensory journey through North African culture.",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    price: 650,
    rating: 4.5,
    category: "cultural",
    featured: false,
  },
  {
    name: "New Zealand",
    country: "New Zealand",
    description:
      "Fjords, volcanoes, and rolling green hills. From Lord of the Rings landscapes to adrenaline-pumping adventures.",
    image:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
    price: 1600,
    rating: 4.8,
    category: "adventure",
    featured: false,
  },
  {
    name: "Tokyo",
    country: "Japan",
    description:
      "Neon-lit streets, world-class cuisine, and a seamless blend of ultra-modern technology with ancient tradition.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    price: 1300,
    rating: 4.7,
    category: "city",
    featured: false,
  },
  {
    name: "Dubrovnik",
    country: "Croatia",
    description:
      "Walk along ancient stone walls above the shimmering Adriatic, explore marble streets lined with baroque buildings, and discover why this coastal gem is called the Pearl of the Adriatic.",
    image:
      "https://images.unsplash.com/photo-1555990538-1a4e617a7929?w=800&q=80",
    price: 900,
    rating: 4.7,
    category: "city",
    featured: true,
  },
  {
    name: "Cappadocia",
    country: "Turkey",
    description:
      "Surreal landscapes of fairy chimneys, ancient cave dwellings, and world-famous hot air balloon rides at sunrise over a dreamlike terrain carved by centuries of wind and rain.",
    image:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&q=80",
    price: 750,
    rating: 4.8,
    category: "adventure",
    featured: true,
  },
];

export default destinations;
