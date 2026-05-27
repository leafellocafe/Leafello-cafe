import { MenuItem, FAQItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "sprouts",
    name: "Sprout & Microgreen Bowl",
    description: "Premium sprouted organic pulses tossed with crunchy microgreens, sweet pomegranate, dynamic chaat spices, and fresh lemon juice.",
    price: 120,
    category: "healthy",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    votes: 142,
    calories: 120,
    protein: "9g",
    badge: "Superfood",
    popular: true
  },
  {
    id: "veg_sub",
    name: "Veg Sub",
    description: "Whole wheat multi-grain sub bread stuffed with clean veggie spread, crisp cucumbers, tomatoes, bell peppers, and low-fat herb yogurt dressing.",
    price: 60,
    category: "healthy",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    votes: 189,
    calories: 290,
    protein: "11g",
    badge: "Chef Special",
    popular: true
  },
  {
    id: "salad",
    name: "Green Salad",
    description: "Exotic lettuce, cherry tomatoes, baby cucumber, bell peppers, greek olives, and paneer cubes, drizzled with olive-herb vinaigrette.",
    price: 60,
    category: "healthy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    votes: 215,
    calories: 160,
    protein: "8g",
    badge: "Best Seller",
    popular: true
  },
  {
    id: "fruit_chaat",
    name: "Fruit Chart",
    description: "Freshly sliced kiwi, dragon fruit, apples, berries, pineapples and papaya, spiced with organic black salt and roasted cumin powder.",
    price: 60,
    category: "healthy",
    image: "https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    votes: 98,
    calories: 110,
    protein: "2g",
    badge: "Immunity Booster"
  },
  {
    id: "pb_shake",
    name: "Peanut Butter Shake",
    description: "Creamy banana blend with organic crunchy peanut butter, roasted oats, dynamic whey protein / plant protein isolate, and unsweetened almond milk.",
    price: 60,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    votes: 188,
    calories: 340,
    protein: "24g",
    badge: "Active Fitness",
    popular: true
  },
  {
    id: "mojito",
    name: "Mojito",
    description: "Refreshing cooler composed of freshly crushed spearmint leaves, key lime infusion, sparkling club soda, and zero-calorie stevia extract.",
    price: 50,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    votes: 204,
    calories: 30,
    protein: "0g",
    badge: "Refreshing"
  },
  {
    id: "choco_shake",
    name: "Chocolate Shake",
    description: "Rich 85% Belgian dark unsweetened cocoa blended with butter-ripe avocado, chia seeds, pure honey, and creamy lactose-free coconut milk.",
    price: 60,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    votes: 165,
    calories: 220,
    protein: "5g"
  },
  {
    id: "cold_coffee",
    name: "Cold Coffee",
    description: "Overnight slow-extracted Arabica cold brew, whipped with organic skimmed milk, ice cubes, and a elegant hint of dark maple sweetener.",
    price: 60,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    votes: 410,
    calories: 95,
    protein: "4g",
    badge: "Cafe Classic",
    popular: true
  },
  {
    id: "hot_coffee",
    name: "Hot Coffee",
    description: "Artisanal double espresso shot layered with silky-smooth frothed milk and hand-crafted latte art.",
    price: 50,
    category: "beverage",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    votes: 520,
    calories: 80,
    protein: "3g",
    badge: "Morning Ritual"
  },
  {
    id: "fries",
    name: "Fries",
    description: "Crispy skin-on potato wedges lightly dusted with organic rosemary, sea salt, oregano, and baked to perfection with olive oil spray.",
    price: 60,
    category: "snack",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    rating: 4.5,
    votes: 312,
    calories: 210,
    protein: "4g"
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: "general",
    question: "What is the concept behind Leafello Cafe?",
    answer: "Leafello Cafe blends high-end organic, wholesome ingredients with delicious cafe cravings. We offer a modern healthy menu focused on raw sprouts, fresh organic microgreens, fitness protein shakes, and artisanal house-roasted coffee, proving that wellness and luxury delicious food can coexist beautifully."
  },
  {
    category: "menu",
    question: "Do you use organic and locally-sourced ingredients?",
    answer: "Absolutely! Our sprouts, salads, and fresh fruits are source-verified directly from accredited multi-layer organic hydroponic farms. No synthetic pesticides, artificial flavorings, or high-fructose corn syrups are ever introduced."
  },
  {
    category: "delivery",
    question: "How long does home dispatch delivery take?",
    answer: "For locations within our 8km dining ring, our dispatch riders deliver orders within 25 to 40 minutes. All food containers are eco-friendly, bio-compostable and thermal-sealed to maintain crispness and hot/cold insulation during dispatch."
  },
  {
    category: "payment",
    question: "What secure digital channels can I use to clear bills?",
    answer: "We support multiple secure channels including online instant Unified Payments Interface (UPI via phone scanning or deep link), credit and debit card networks, secure Net Banking gateways, Apple Pay, and convenient Cash on Delivery (COD)."
  },
  {
    category: "delivery",
    question: "What is your refund policy if an order is cancelled?",
    answer: "If you cancel before food preparation (within 3 minutes of transaction submission) or if delivery cannot complete due to weather/errors, full compensation will be reversed instantly to your account. Standard reversal reflections take 1 to 3 banks business-days."
  },
  {
    category: "menu",
    question: "Can I customize dairy, sugar and gluten options in shakes?",
    answer: "Yes, fully! When selecting any beverage or shakes, our interactive menu customization allows swapping classic milk with unsweetened almond, lactose-free coconut, or oat milk, and choosing between stevia, raw organic honey, maple syrup, or no added sweetness."
  }
];
