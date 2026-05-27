export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "healthy" | "beverage" | "snack";
  image: string;
  rating: number;
  votes: number;
  calories: number;
  protein?: string;
  badge?: string;
  popular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: "UPI" | "CARD" | "NETBANKING" | "APPLEPAY" | "COD";
  phoneNumber: string;
  deliveryAddress: string;
  status: "PENDING" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  pwaState?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "delivery" | "menu" | "payment";
}

export interface SupportQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phoneNumber?: string;
  memberTier: "Bronze" | "Gold" | "LeafPlatinum";
  greenPoints: number; // loyalty rewards program
}

export type PageView = "home" | "menu" | "cart" | "history" | "about" | "support";
