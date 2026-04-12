// src/assets/component/navData.js
export const navItems = [
  {
    id: 1,
    name: "Makeup",
    basePath: "/beauty/makeup",
    columns: [
      { title: "Face", links: ["Foundation", "Concealer", "Blush"] },
      { title: "Eyes", links: ["Mascara", "Eyeshadow", "Eyeliner"] },
    ],
    brands: ["Dior", "Huda Beauty", "Maybelline"],
    banner: {
      title: "Glow Makeup Deals",
      image: "https://via.placeholder.com/200x120",
    },
  },

  {
    id: 2,
    name: "Skincare",
    basePath: "/beauty/skincare",
    columns: [
      { title: "Care", links: ["Cleanser", "Serum", "Moisturizer"] },
      { title: "Treatment", links: ["Sunscreen", "Anti Aging"] },
    ],
    brands: ["CeraVe", "La Roche Posay", "The Ordinary"],
    banner: {
      title: "Healthy Skin Starts Here",
      image: "https://via.placeholder.com/200x120",
    },
  },

  {
    id: 3,
    name: "Fragrance",
    basePath: "/beauty/fragrance",
    columns: [
      { title: "Perfumes", links: ["Women", "Luxury", "Daily Wear"] },
      { title: "Body", links: ["Body Mist", "Deodorant"] },
    ],
    brands: ["Chanel", "Dior", "YSL"],
    banner: {
      title: "Signature Scents",
      image: "https://via.placeholder.com/200x120",
    },
  },

  {
    id: 4,
    name: "Hair Care",
    basePath: "/beauty/hair",
    columns: [
      { title: "Hair Treatment", links: ["Shampoo", "Conditioner"] },
      { title: "Styling", links: ["Hair Oil", "Hair Mask"] },
    ],
    brands: ["L'Oreal", "Olaplex", "Kerastase"],
    banner: {
      title: "Shiny Hair Collection",
      image: "https://via.placeholder.com/200x120",
    },
  },

  {
    id: 5,
    name: "Beauty Tools",
    basePath: "/beauty/tools",
    columns: [
      { title: "Tools", links: ["Brushes", "Sponges"] },
      { title: "Devices", links: ["Hair Dryer", "Straightener"] },
    ],
    brands: ["Real Techniques", "Dyson"],
    banner: {
      title: "Pro Beauty Tools",
      image: "https://via.placeholder.com/200x120",
    },
  },
];