import React, { useState, useEffect } from "react";
import {
  Compass,
  Coffee,
  ShoppingCart,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  MessageSquare,
  HelpCircle,
  Download,
  CheckCircle,
  Instagram,
  Facebook,
  Star,
  Trash2,
  Bookmark,
  ChevronDown,
  X,
  AlertTriangle,
  Truck,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MenuCard from "./components/MenuCard";
import CartPage from "./components/CartPage";
import CheckoutModal from "./components/CheckoutModal";
import SupportChat from "./components/SupportChat";
import LoginModal from "./components/LoginModal";

import { MENU_ITEMS, FAQ_ITEMS } from "./data";
import { MenuItem, CartItem, Order, PageView, UserProfile } from "./types";
import { dbService, mockAuthService } from "./firebase";

export default function App() {
  // Navigation
  const [currentView, setView] = useState<PageView>("home");

  // App Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("leafello_dark_mode");
    return saved === "true";
  });

  // Saving theme choice
  useEffect(() => {
    localStorage.setItem("leafello_dark_mode", String(darkMode));
  }, [darkMode]);

  // Auth User
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("leafello_cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Save Cart
  useEffect(() => {
    localStorage.setItem("leafello_cart", JSON.stringify(cart));
  }, [cart]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // PWA mobile installation simulator state
  const [pwaInstalled, setPwaInstalled] = useState<boolean>(() => {
    return localStorage.getItem("leafello_pwa_installed") === "true";
  });
  const [showPwaModal, setShowPwaModal] = useState(false);

  // Support inquiries contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("General Feedback");
  const [contactMessage, setContactMessage] = useState("");
  const [contactInquirySubmitting, setContactInquirySubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // FAQ Search state
  const [faqSearch, setFaqSearch] = useState("");
  const [activeFaqCategory, setActiveFaqCategory] = useState<"all" | "general" | "delivery" | "menu" | "payment">("all");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Menu filter category
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<"all" | "healthy" | "beverage" | "snack">("all");

  // Load User Session & History
  useEffect(() => {
    mockAuthService.loadSession();
    const unsub = mockAuthService.onStateChange((mockUser) => {
      setUser(mockUser);
    });
    return () => unsub();
  }, []);

  // Fetch Orders when View or User shifts
  useEffect(() => {
    const fetchOrders = async () => {
      const uId = user ? user.uid : "anonymous";
      const hOrders = await dbService.getOrders(uId);
      setOrders(hOrders as any[]);
    };
    fetchOrders();
  }, [currentView, user]);

  // Adding items to cart
  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((it) => it.menuItem.id === item.id);
      if (existing) {
        return prevCart.map((it) =>
          it.menuItem.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prevCart, { menuItem: item, quantity: 1 }];
    });
  };

  // Changing cart item quantities
  const handleUpdateQty = (item: MenuItem, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((it) => {
          if (it.menuItem.id === item.id) {
            const nextQty = it.quantity + change;
            return { ...it, quantity: nextQty };
          }
          return it;
        })
        .filter((it) => it.quantity > 0);
    });
  };

  // Total removing of a cart item
  const handleRemoveCartItem = (item: MenuItem) => {
    setCart((prevCart) => prevCart.filter((it) => it.menuItem.id !== item.id));
  };

  // Placed Order Success Handler
  const handlePlaceOrder = async (info: {
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    paymentMethod: any;
    total: number;
    items: any[];
  }) => {
    const finalOrder = await dbService.createOrder({
      orderId: `LF-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user ? user.uid : "anonymous",
      customerName: info.customerName,
      items: info.items,
      total: info.total,
      paymentMethod: info.paymentMethod,
      phoneNumber: info.phoneNumber,
      deliveryAddress: info.deliveryAddress,
    });

    // Clear cart locally
    setCart([]);
    return finalOrder;
  };

  // Cancel order in history ledger
  const handleCancelOrder = async (id: string) => {
    const done = await dbService.cancelOrder(id);
    if (done) {
      // Re-fetch orders instantly
      const uId = user ? user.uid : "anonymous";
      const hOrders = await dbService.getOrders(uId);
      setOrders(hOrders as any[]);
    }
  };

  // Simulate PWA webapp install screen
  const triggerPwaInstallSimulate = () => {
    setShowPwaModal(true);
  };

  const confirmPwaInstall = () => {
    localStorage.setItem("leafello_pwa_installed", "true");
    setPwaInstalled(true);
    setShowPwaModal(false);
  };

  // Handle Contact Inquiries Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim() || !contactEmail.includes("@")) return;

    setContactInquirySubmitting(true);
    await dbService.submitSupportQuery(contactName, contactEmail, contactSubject, contactMessage);
    setContactInquirySubmitting(false);
    setContactSuccess(true);

    // Reset fields
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => {
      setContactSuccess(false);
    }, 4500);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Dynamic filter for Menu cards
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (selectedMenuCategory === "all") return true;
    return item.category === selectedMenuCategory;
  });

  // Dynamic filter for FAQ questions
  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCat = activeFaqCategory === "all" || item.category === activeFaqCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fdfdfb] dark:bg-zinc-950 text-[#2d3a3a] dark:text-zinc-200 transition-colors duration-300">
      
      {/* simulated PWA installer sticky top banner */}
      {!pwaInstalled && (
        <div className="bg-emerald-800 dark:bg-emerald-950/90 text-white font-mono text-[11px] p-2.5 px-4 text-center select-none flex items-center justify-center gap-3 relative z-40 transition-all">
          <Download className="h-4 w-4 animate-bounce shrink-0" />
          <span>
            Install Leafello Cafe PWA as a Mobile App on your home screen for quick offline access!
          </span>
          <button
            onClick={triggerPwaInstallSimulate}
            className="px-2.5 py-1 text-[10px] font-bold bg-white text-emerald-800 hover:bg-zinc-100 rounded-lg shadow-sm font-sans transition-all active:scale-95 cursor-pointer"
          >
            Install Web App
          </button>
        </div>
      )}

      {/* Responsive unified Header Navigation */}
      <Navbar
        currentView={currentView}
        setView={setView}
        cartCount={totalCartCount}
        user={user}
        onLogout={() => mockAuthService.signOutMock()}
        openLogin={() => setIsLoginOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Direct Call to Order Alert Banner */}
      <div className="bg-amber-500 dark:bg-amber-600 text-stone-950 dark:text-stone-950 p-3 px-4 text-center font-display font-black text-xs sm:text-sm select-none flex flex-wrap items-center justify-center gap-3 relative z-30 shadow-xs border-b border-amber-600">
        <span className="flex items-center gap-1.5 animate-bounce shrink-0 text-base">📞</span>
        <span className="tracking-wide uppercase">
          WANT TO ORDER RIGHT NOW? <strong>CALL US DIRECTLY AT +91 73408 60879 TO PLACE YOUR ORDER EASILY!</strong>
        </span>
        <a 
          href="tel:7340860879" 
          className="px-4 py-1.5 bg-zinc-950 text-white hover:bg-zinc-800 text-[10px] font-mono uppercase font-black rounded-xl shadow-md tracking-wider transition-all scale-100 hover:scale-105 active:scale-95 cursor-pointer ml-1"
        >
          Call to Order
        </a>
      </div>

      {/* Middle Core Applet Canvas Router */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === "home" && (
          <div className="animate-fade-in text-[#2d3a3a] dark:text-zinc-100 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
            
            {/* Bento Grid layout container */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
              
              {/* CARD A (Hero Pitch + Promo Showcase): Spans 3 columns wide, 2 rows high */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-2 bg-[#f0f4ef] dark:bg-emerald-950/20 rounded-3xl p-8 lg:p-10 flex flex-col justify-between overflow-hidden relative border border-emerald-100/30 dark:border-emerald-800/10 shadow-sm text-left">
                
                <div className="relative z-10 max-w-xl space-y-6">
                  {/* Premium Sparkle badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/65 rounded-full border border-emerald-250/20 text-emerald-800 dark:text-emerald-400 font-display text-[10px] uppercase font-bold tracking-widest">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-650" />
                    <span>Certified Organic Freshness</span>
                  </div>
                  
                  {/* Massive Branding Heading */}
                  <div className="space-y-2">
                    <h1 className="text-5xl sm:text-7xl font-black font-display tracking-tight leading-[1.02] text-stone-850 dark:text-stone-100 uppercase">
                      Leafello <span className="text-emerald-700 dark:text-emerald-400">Cafe</span>
                    </h1>
                    <h2 className="text-lg sm:text-2xl font-bold font-display tracking-tight text-emerald-800 dark:text-emerald-400">
                      Greens of Joy • Rich Shakes • Pure Craft
                    </h2>
                  </div>
                  
                  <p className="text-emerald-805 dark:text-emerald-400 font-mono font-bold text-xs tracking-widest uppercase bg-emerald-100/40 dark:bg-emerald-950/40 inline-block px-2.5 py-1 rounded-md">
                    🎁 PROMO: Buy 4 items, lowest is GIFTED FREE!
                  </p>
                  
                  <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-400 max-w-lg font-sans leading-relaxed">
                    Leafello balances fine organic agricultural roots with luxury culinary roasts. Order 100% bio-organic sprouts, fresh salads, hot coffees, and creamy peanut butter protein shakes today. We guarantee chemical-free hydroponics!
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                    <button
                      id="home-ordernow-btn"
                      onClick={() => setView("menu")}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-900 dark:bg-emerald-850 dark:hover:bg-emerald-800 text-white font-bold hover:scale-[1.02] shadow-lg shadow-emerald-900/10 transition-all text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Explore Menu & Order</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    
                    <a
                      href="tel:7340860879"
                      className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 border border-amber-500 text-xs font-black transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                    >
                      <span>📞 Call to Order Directly</span>
                    </a>
                  </div>

                  {/* Trust factors */}
                  <div className="pt-4 flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 divide-x divide-zinc-200 dark:divide-zinc-800 select-none">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span><strong>4.9/5</strong> Star Rating</span>
                    </div>
                    <div className="pl-4">
                      <span><strong>15-25 min</strong> Speedy Dispatch</span>
                    </div>
                    <div className="pl-4">
                      <span><strong>100%</strong> Plant-Based Compostable</span>
                    </div>
                  </div>
                </div>

                {/* Absolutes and image placements */}
                <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-emerald-200/30 dark:bg-emerald-950/15 rounded-full blur-3xl pointer-events-none" />

                {/* Aesthetic Floater Card */}
                <div className="hidden lg:flex absolute top-1/2 right-10 -translate-y-1/2 flex-col gap-4 select-none z-10">
                  <div className="w-52 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-100 dark:border-zinc-850 transition-all hover:scale-105">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center font-mono font-bold text-emerald-800 text-xs">S</div>
                    <div>
                      <p className="text-xs font-bold text-stone-850 dark:text-stone-250">Sprout Bowl</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">₹120 • Pure Fiber</p>
                    </div>
                  </div>

                  <div className="w-52 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-100 dark:border-zinc-850 transform translate-x-4 transition-all hover:scale-105">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center font-mono font-bold text-amber-800 text-xs">P</div>
                    <div>
                      <p className="text-xs font-bold text-stone-850 dark:text-stone-250">Peanut Butter Shake</p>
                      <p className="text-[10px] text-amber-750 dark:text-amber-500 font-mono font-bold">₹60 • Protein High</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* CARD B (Cart Status): Spans 1 column wide, 1 row high */}
              <div className="col-span-1 bg-stone-800 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl relative overflow-hidden text-left border border-stone-750">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-stone-700 rounded-xl">
                    <ShoppingCart className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">Cart Status</span>
                </div>
                
                <div className="mt-4">
                  <div className="text-3xl font-black font-mono text-white">
                    ₹{cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-stone-400 font-mono mt-1">
                    {totalCartCount} item(s) in your bag
                  </div>
                </div>
                
                <button
                  onClick={() => setView("cart")}
                  className="mt-5 w-full py-2.5 bg-emerald-500 hover:bg-emerald-455 text-white rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Checkout Now
                </button>
              </div>

              {/* CARD C (Store Location Map): Spans 1 column wide, 1 row high */}
              <div 
                onClick={() => setView("about")}
                className="col-span-1 bg-[#fcf9f4] dark:bg-zinc-900/40 rounded-3xl p-6 border border-stone-200/50 dark:border-zinc-850 flex flex-col justify-between text-left shadow-xs cursor-pointer group transition-all hover:border-emerald-300 dark:hover:border-emerald-900"
              >
                <div className="flex items-center gap-2 text-stone-800 dark:text-zinc-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-stone-400">Store Coordinates</span>
                </div>
                
                {/* Visual mini-map block inside Bento */}
                <div className="bg-stone-200/60 dark:bg-zinc-800/50 h-20 rounded-xl overflow-hidden mt-3 relative border border-stone-100 dark:border-zinc-800">
                  <div className="absolute inset-0 p-2 opacity-50 font-mono text-[6px] text-zinc-400 leading-none pointer-events-none">
                    Map layout grid grid - HSR Layout Rd
                  </div>
                  <div className="absolute top-1/2 left-1/2 -ml-2 -mt-4">
                    <MapPin className="h-5 w-5 text-red-600 animate-bounce" />
                    <span className="absolute bottom-0 left-0.5 h-1 w-3 rounded-full bg-black/20 blur-xs" />
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-bold text-stone-850 dark:text-zinc-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Leafello Downtown HQ</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">HSR Sector 5 • Open until 10PM</p>
                </div>
              </div>

              {/* CARD D (Wholesome Sprout Guarantee): Spans 2 columns wide, 1 row high */}
              <div className="col-span-1 md:col-span-2 bg-[#fcf9f4] dark:bg-zinc-900/40 rounded-3xl p-6 sm:p-7 border border-stone-200/40 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-xs">
                <div className="space-y-2.5 flex-grow">
                  <span className="text-[9px] font-black tracking-widest text-emerald-800 dark:text-emerald-400 uppercase font-mono">
                    Hydroponic fidelity
                  </span>
                  <h3 className="text-lg font-black font-display text-zinc-900 dark:text-zinc-150 leading-tight">
                    Clean, Wholesome Ingredients Pledge
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                    We source our raw microgreens, sunflower microgreens, alfalfa shoots, and fresh exotic seeds from chemical-free organic hydroponic facilities inside Bengaluru. Zero additives, absolute organic fidelity!
                  </p>
                </div>
                
                <img
                  src="/src/assets/images/interior_ambience_1779909444452.png"
                  alt="Interior Ambience Showcase"
                  referrerPolicy="no-referrer"
                  className="h-28 w-44 rounded-2xl object-cover shrink-0 border border-stone-200/30 dark:border-zinc-800 shadow-xs"
                />
              </div>

              {/* CARD E (Payment Methods): Spans 1 column wide, 1 row high */}
              <div className="col-span-1 bg-[#edf1f2] dark:bg-zinc-900/40 rounded-3xl p-6 flex flex-col justify-between border border-stone-200/40 dark:border-zinc-850 text-left relative overflow-hidden shadow-xs">
                <div className="text-[10px] font-mono font-extrabold uppercase text-stone-400 dark:text-zinc-500 mb-2">
                  Payment Methods
                </div>
                
                <div className="grid grid-cols-2 gap-2 flex-grow">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center p-2 border border-stone-100 dark:border-zinc-800">
                    <span className="font-bold italic text-blue-600 dark:text-blue-400 text-xs text-center font-sans">Pay</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center p-2 border border-stone-100 dark:border-zinc-800">
                    <span className="font-bold text-[10px] text-zinc-800 dark:text-zinc-300 font-mono text-center">UPI</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center p-2 border border-stone-100 dark:border-zinc-800">
                    <span className="font-bold text-[10px] text-zinc-800 dark:text-zinc-300 font-mono text-center">Card</span>
                  </div>
                  <div className="bg-emerald-800 dark:bg-emerald-900 text-white rounded-xl flex items-center justify-center p-2 border border-emerald-900">
                    <span className="text-[10px] font-black font-mono text-center">COD</span>
                  </div>
                </div>
                
                <div className="mt-2 text-[9px] text-center text-stone-400 dark:text-zinc-500 font-mono">
                  Secure Checkout Guaranteed
                </div>
              </div>

              {/* CARD F (Loyalty Rewards / Profile Status): Spans 1 column wide, 1 row high */}
              <div className="col-span-1 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-stone-150 dark:border-zinc-850 flex flex-col justify-between text-left shadow-xs">
                {user ? (
                  <div className="flex-grow flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider font-mono">Active Account</span>
                      <div className="flex items-center gap-2 mt-2">
                        <img 
                          src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.displayName}`} 
                          alt="User" 
                          className="h-8 w-8 rounded-full border border-emerald-100"
                        />
                        <div className="truncate">
                          <p className="text-xs font-black truncate">{user.displayName || "Google Diner"}</p>
                          <p className="text-[9px] text-zinc-400 font-mono">{user.memberTier || "Bronze"} Tier</p>
                        </div>
                      </div>
                    </div>

                    <div className="my-3 pt-2 border-t border-zinc-50 dark:border-zinc-850/50">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono">Green Points</span>
                        <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 font-mono">{user.greenPoints || 50} pts</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-emerald-600 h-full rounded-full" 
                          style={{ width: `${Math.min(100, ((user.greenPoints || 50) / 150) * 100)}%` }} 
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setView("history")}
                      className="w-full py-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-[#2d3a3a] dark:text-zinc-200 border border-stone-200/50 dark:border-zinc-700 text-[10px] font-bold font-mono uppercase tracking-wider rounded-lg text-center"
                    >
                      Examine Ledger
                    </button>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] font-mono font-extrabold uppercase text-stone-400">Guest Perks</span>
                      <div className="mt-2 space-y-1">
                        <h4 className="text-sm font-black text-stone-850 dark:text-stone-200 leading-tight">Unlock 50 Free Points</h4>
                        <p className="text-[10px] text-zinc-400 leading-normal font-sans">Register your Diner Profile now to accrue Leaf Points on your checkout receipts!</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className="w-full mt-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-xl text-xs font-bold cursor-pointer text-center"
                    >
                      Sign In & Claim
                    </button>
                  </div>
                )}
              </div>

              {/* CARD G (Need Help? Barista Interactive Row): Spans 3 columns wide, 1 row high */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-zinc-900 rounded-3xl p-6 lg:p-7 border border-stone-150 dark:border-zinc-850 flex flex-col lg:flex-row items-stretch lg:items-center gap-8 shadow-sm text-left">
                <div className="lg:w-1/3 space-y-3 shrink-0">
                  <h4 className="text-lg font-black font-display text-zinc-900 dark:text-white">Need Help?</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                    Our nutritional barista support guides are online 24/7. Average response is instant.
                  </p>
                  <button 
                    onClick={() => {
                      const chatBtn = document.getElementById("chat-toggle-floating-btn");
                      if (chatBtn) chatBtn.click();
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-350 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 px-4 py-2 border border-emerald-100 dark:border-emerald-900/40 rounded-full cursor-pointer transiton-all"
                  >
                    <span>Converse with Barista</span>
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 md:divide-x md:divide-zinc-100 dark:md:divide-zinc-850">
                  <div className="space-y-1.5 md:pl-0 pl-0">
                    <p className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 font-mono tracking-wider">
                      Delivery info
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-455">Standard: 20-30 mins</p>
                    <p className="text-[10px] text-emerald-650 dark:text-emerald-400 font-bold uppercase font-mono">
                      FREE OVER $20 / ₹499
                    </p>
                  </div>

                  <div className="space-y-1.5 md:pl-5">
                    <p className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 font-mono tracking-wider">
                      Refund Policy
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-455 leading-relaxed">
                      100% money back check or replacement credit if not fully satisfied.
                    </p>
                  </div>

                  <div className="space-y-1.5 md:pl-5">
                    <p className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 font-mono tracking-wider">
                      FAQ Quick Peek
                    </p>
                    <ul className="text-xs text-zinc-500 dark:text-zinc-455 space-y-1 font-sans">
                      <li>• 100% organic sources?</li>
                      <li>• Vegan selections?</li>
                    </ul>
                  </div>
                </div>
              </div>

            </section>

            {/* Showcase Section: Top 3 Popular / Healthy Cards */}
            <section className="py-8 text-center">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-450 font-mono">
                  Popular Gastronomy Selection
                </span>
                <h2 className="text-3xl font-black font-display tracking-tight text-zinc-950 dark:text-zinc-50 mb-10">
                  Diner's Daily Healthy Favorites
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MENU_ITEMS.filter((item) => item.popular).slice(0, 3).map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    addedCount={cart.find((it) => it.menuItem.id === item.id)?.quantity || 0}
                  />
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setView("menu")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-emerald-800 dark:text-emerald-400 font-extrabold rounded-2xl transition-all shadow-xs border border-stone-200 dark:border-zinc-800 text-xs uppercase tracking-wider"
                >
                  View Entire Food Cover Selection
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: DYNAMIC MENU SECTION */}
        {currentView === "menu" && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
            <div className="text-center space-y-3 mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-750 dark:text-emerald-400 font-mono">
                Our Wholesome Online Menu
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-zinc-950 dark:text-zinc-50">
                Delicious Cafe Offerings
              </h1>
              
              {/* Promo Banner on Menu */}
              <div className="max-w-2xl mx-auto p-4 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/10 rounded-2xl text-left flex items-start gap-3 my-5">
                <span className="text-xl shrink-0 mt-0.5">🎁</span>
                <div>
                  <h4 className="text-xs font-black uppercase font-mono text-emerald-850 dark:text-emerald-300">SPECIAL GIFTS PROMO</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-sans mt-0.5">
                    Select any <strong>4 items</strong> on our menu, and we will automatically <strong>gift you 1 item entirely free</strong> (the cheapest item in your cart becomes free instantly!). No promo codes required.
                  </p>
                </div>
              </div>

              {/* Directly Place Order banner on Menu */}
              <div className="max-w-2xl mx-auto p-4 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl text-left flex items-center justify-between gap-4 my-5 flex-wrap sm:flex-nowrap">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">📞</span>
                  <div>
                    <h5 className="text-xs font-black uppercase font-mono text-amber-850 dark:text-amber-400">order directly by calling us</h5>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 font-sans mt-0.5">
                      Want to place your order with a direct phone call? Ring us up easily at +91 73408 60879 to deliver immediately.
                    </p>
                  </div>
                </div>
                <a 
                  href="tel:7340860879" 
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-stone-950 text-[10px] font-mono font-black uppercase tracking-wider rounded-xl shadow-xs shrink-0"
                >
                  Call +91 73408 60879
                </a>
              </div>

              <p className="text-sm text-zinc-450 dark:text-zinc-400 max-w-lg mx-auto">
                Order organic energy boosters, single-origin classic coffees, fiber-packed green bowls, and protein shakes. Select "Add to Cart" to build your custom plate.
              </p>
            </div>

            {/* Filter coordinate tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 select-none">
              {[
                { id: "all", label: "All Items 🍽️" },
                { id: "healthy", label: "Healthy Greens 🌱" },
                { id: "beverage", label: "Specialty Sips 🥤" },
                { id: "snack", label: "Crispy Wedges 🍟" },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedMenuCategory(category.id as any)}
                  className={`px-4 py-2 font-semibold text-xs rounded-xl shadow-xs border transition-all cursor-pointer ${
                    selectedMenuCategory === category.id
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "bg-white dark:bg-zinc-900 border-zinc-150 dark:border-zinc-850 hover:border-emerald-300 text-zinc-600 dark:text-zinc-300"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredMenuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  addedCount={cart.find((it) => it.menuItem.id === item.id)?.quantity || 0}
                />
              ))}
            </div>
            
            {filteredMenuItems.length === 0 && (
              <p className="text-zinc-400 font-mono text-center py-10">
                No items are registered under this dining division.
              </p>
            )}
          </div>
        )}

        {/* VIEW 3: CART SECTION */}
        {currentView === "cart" && (
          <CartPage
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
            onBackToMenu={() => setView("menu")}
          />
        )}

        {/* VIEW 4: CONTACT US SECTION */}
        {currentView === "about" && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in text-zinc-900 dark:text-zinc-100">
            
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-450 font-mono">
                Contact Coordination
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Get In Touch With Leafello
              </h1>
              <p className="text-sm text-zinc-405 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Have customized catering events and organic crop procurement questions? Reach out to our executive coordinate.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              
              {/* Left Column: Form Details */}
              <div className="lg:col-span-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-6 sm:p-8 flex flex-col justify-between space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-lg font-bold font-sans">Contact Credentials</h3>
                  
                  <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 font-mono uppercase leading-tight">Hotline Dial</p>
                        <a href="tel:7340860879" className="font-extrabold font-mono hover:underline">
                          +91 7340860879
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 font-mono uppercase leading-tight">Mail Inquiry</p>
                        <a href="mailto:leafellocafe@gmail.com" className="font-medium hover:underline">
                          leafellocafe@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <MapPin className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 font-mono uppercase leading-tight">Cafe Location</p>
                        <p className="font-medium">Sector 5, HSR Layout, Bengaluru, Karnataka</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps Realistic styled mock section */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative shadow-sm h-64 bg-emerald-50/20 select-none flex flex-col justify-between">
                  {/* Mock styled Map Roads background */}
                  <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 opacity-60 pointer-events-none" />
                  
                  {/* Stylized Google Map Roads */}
                  <div className="absolute inset-0 p-4 pointer-events-none">
                    <div className="absolute top-1/3 left-0 right-0 h-4 bg-white dark:bg-zinc-700/60 shadow-inner" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-white dark:bg-zinc-700/60 shadow-inner" />
                    <div className="absolute top-1/2 left-1/4 w-32 h-16 rounded-full border-2 border-emerald-300 dark:border-emerald-900 border-dashed animate-pulse" />
                    <div className="absolute top-10 left-12 h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping" />
                  </div>

                  {/* Leafello Map Pin Label */}
                  <div className="relative z-10 m-3 inline-flex bg-white/95 dark:bg-zinc-900/95 shadow-lg border border-zinc-150/40 px-3 py-1.5 rounded-xl items-center gap-2 max-w-[215px]">
                    <div className="h-6 w-6 rounded-full overflow-hidden bg-white shrink-0 shadow-xs border">
                      <img src="/src/assets/images/leafello_cafe_logo_1779911838695.png" alt="Leafello Logo" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-emerald-800 leading-none">Leafello Cafe HQ</p>
                      <p className="text-[8px] text-zinc-400 font-mono leading-normal mt-0.5">Sector 5, HSR Layout, BLR</p>
                    </div>
                  </div>

                  {/* Pin Circle Dot */}
                  <div className="absolute top-1/3 left-1/2 -ml-3 -mt-3 relative z-10">
                    <MapPin className="h-7 w-7 text-red-650 fill-red-100 dark:fill-red-950 animate-bounce" />
                    <span className="absolute bottom-0 left-1.5 h-1.5 w-4 rounded-full bg-black/25 blur-xs" />
                  </div>

                  {/* Controls HUD */}
                  <div className="relative z-15 m-3 pb-0 text-left flex justify-between items-end">
                    <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-md font-mono font-bold uppercase shadow-sm">Google Maps</span>
                    <div className="flex flex-col bg-white dark:bg-zinc-800 rounded-lg shadow-sm border text-[10px] font-mono leading-none divide-y">
                      <button className="p-1 px-1.5 font-black hover:bg-zinc-100">+</button>
                      <button className="p-1 px-1.5 font-black hover:bg-zinc-100">-</button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Interaction Form */}
              <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-sans">Submit Support Message</h3>
                  <p className="text-xs text-zinc-405 dark:text-zinc-400 leading-normal mt-1 mb-6">
                    Our nutritional guides monitor submissions instantly. Average email resolution turnaround is under 3 hours!
                  </p>
                  
                  {contactSuccess && (
                    <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-2 animate-fade-in text-left">
                      <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                      Your message coord was submitted successfully! Check your inbox shortly.
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4 text-left text-xs text-zinc-650 dark:text-zinc-400 font-mono">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1.5 font-bold">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Sunder Pichai"
                          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-55 dark:bg-zinc-950 rounded-xl focus:outline-emerald-550 text-zinc-950 dark:text-zinc-100 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1.5 font-bold">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. sunder@google.com"
                          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-55 dark:bg-zinc-950 rounded-xl focus:outline-emerald-550 text-zinc-950 dark:text-zinc-100 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1.5 font-bold">Inquiry Subject</label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-55 dark:bg-zinc-950 rounded-xl text-zinc-80 hover:text-black dark:text-zinc-200 dark:hover:text-white focus:outline-emerald-555 focus:ring-0 text-xs font-sans"
                      >
                        <option value="General Feedback">General Hospitality Feedback</option>
                        <option value="Nutritional Recipe Details">Nutritional Sprout Recipes</option>
                        <option value="Catering & Events">Bespoke Corporate Catering</option>
                        <option value="Career Opportunities">Diner Career Employment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 font-bold">Message Details</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Draft culinary queries, delivery corrections or other details here..."
                        className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-55 dark:bg-zinc-950 rounded-xl focus:outline-emerald-550 text-zinc-950 dark:text-zinc-100 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactInquirySubmitting}
                      className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 border hover:border-emerald-600 font-extrabold text-white text-xs uppercase tracking-widest font-sans rounded-2xl shadow-sm text-center transition-all cursor-pointer select-none active:scale-95"
                    >
                      {contactInquirySubmitting ? "TRANSMITTING INQUIRY..." : "SEND SUPPORT COVER MESSAGE"}
                    </button>

                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 5: HELP & SYSTEM SUPPORT FAQ SECTION */}
        {currentView === "support" && (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in text-zinc-900 dark:text-zinc-100 text-left">
            
            <div className="text-center space-y-3 mb-10">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-450 font-mono">
                Support Center
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Help & Organic FAQ
              </h1>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-normal">
                Search our knowledge catalog about sprout washing, checkout channels, and instant refund options.
              </p>
            </div>

            {/* Live FAQ Search engine */}
            <div className="relative mb-6 max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search queries e.g. sprouts, refund, dairy..."
                className="w-full pl-10 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl focus:outline-emerald-500 text-sm shadow-xs placeholder-zinc-400"
              />
              {faqSearch && (
                <button
                  onClick={() => setFaqSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-450 hover:text-black dark:text-zinc-400 rounded-full"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-8 select-none">
              {[
                { id: "all", label: "All Questions" },
                { id: "general", label: "General Vibe" },
                { id: "menu", label: "Menu Customization" },
                { id: "delivery", label: "Dispatch Logistics" },
                { id: "payment", label: "Bill Clearing" },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFaqCategory(category.id as any)}
                  className={`px-3.5 py-1.5 font-mono text-[10px] font-bold border rounded-full shrink-0 transition-colors cursor-pointer ${
                    activeFaqCategory === category.id
                      ? "border-emerald-700 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350 shadow-xs"
                      : "border-zinc-150 dark:border-zinc-805 bg-white dark:bg-zinc-900/60 text-zinc-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Accordion Questions */}
            <div className="space-y-4 max-w-2xl mx-auto">
              {filteredFaqs.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-zinc-100 dark:border-zinc-850 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-colors duration-300"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-sans gap-4"
                    >
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-emerald-700" : ""
                        }`}
                      />
                    </button>
                    
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-xs text-zinc-500 dark:text-zinc-405 leading-relaxed font-sans border-t border-zinc-50 dark:border-zinc-850/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <p className="text-zinc-400 font-mono text-center py-6 text-sm">
                  We didn't match any inquiries matching: "{faqSearch}". Try typing a simpler term like 'milk' or 'refund'.
                </p>
              )}
            </div>

            {/* Floating assistance banner */}
            <div className="mt-14 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-3xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 leading-normal">
              <div className="space-y-1">
                <h4 className="text-base font-bold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-emerald-700" /> Still Have Questions?</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                  Instantly open our live nutritionist help bot at the bottom right corner of the browser for immediate active solutions!
                </p>
              </div>
              <button
                onClick={() => {
                  // Simply simulate opening chat widget
                  const floatingBtn = document.getElementById("chat-toggle-floating-btn");
                  if (floatingBtn) floatingBtn.click();
                }}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer text-center"
              >
                Converse with Guide
              </button>
            </div>

            {/* Application Download and Export Guidelines Card */}
            <div className="mt-8 p-6 bg-[#f0f4ef] dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/10 rounded-3xl max-w-2xl mx-auto text-left space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📥</span>
                <div>
                  <h4 className="text-base font-black text-zinc-950 dark:text-zinc-50 tracking-tight">How to Download this Web Application</h4>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 font-mono">Save code files, layout configurations, and assets locally</p>
                </div>
              </div>
              
              <p className="text-xs text-stone-650 dark:text-stone-300 font-sans leading-relaxed">
                You can download the entire source code of this <strong>Leafello Cafe</strong> web application anytime as a single ZIP archive or sync it directly to GitHub!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-sans text-xs">
                <div className="bg-white dark:bg-zinc-900/60 p-4 rounded-2xl border border-stone-100 dark:border-zinc-805 space-y-1.5 shadow-2xs">
                  <span className="text-lg">🗄️</span>
                  <h5 className="font-bold text-stone-850 dark:text-zinc-200">Option 1: Download as ZIP</h5>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-550 leading-normal">
                    Click the <strong>Settings (Gear Icon) / Project Options</strong> menu in the top-right corner of the Google AI Studio page. Choose the <strong>"Export ZIP" / "Download ZIP"</strong> option to download a compiled backup package.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-zinc-900/60 p-4 rounded-2xl border border-stone-100 dark:border-zinc-805 space-y-1.5 shadow-2xs">
                  <span className="text-lg">🐙</span>
                  <h5 className="font-bold text-stone-850 dark:text-zinc-200">Option 2: Push to GitHub</h5>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-550 leading-normal">
                    Connect your GitHub profile via the <strong>Settings</strong> button, and trigger <strong>"Export to GitHub Repo"</strong>. This sets up a live repository for continuous deployment on your terms.
                  </p>
                </div>
              </div>
              
              <div className="text-[10px] text-emerald-800 dark:text-emerald-400 bg-emerald-100/30 dark:bg-emerald-990/10 p-2.5 rounded-lg font-mono text-center">
                ✨ <strong>Note:</strong> Your bundle is fully standard: includes <strong>TypeScript source code</strong>, <strong>Tailwind layouts</strong>, <strong>Vite hot builders</strong>, and <strong>Firestore rules</strong> ready to deploy!
              </div>
            </div>

          </div>
        )}

        {/* VIEW 6: ORDER HISTORY LEDGER */}
        {currentView === "history" && (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in text-zinc-900 dark:text-zinc-100 text-left">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
              Diner's Order Ledger
            </h1>
            <p className="text-xs text-zinc-400 font-mono mb-8 uppercase tracking-wider">
              Review transaction state, cancelled dispatches and current courier progress.
            </p>

            <div className="space-y-6">
              {orders.map((order) => {
                const formattedDate = new Date(order.createdAt).toLocaleString();
                
                return (
                  <div
                    key={order.id}
                    id={`order-card-row-${order.id}`}
                    className="p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-850 shadow-xs space-y-4"
                  >
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-zinc-55 dark:border-zinc-800 text-xs font-mono">
                      <div>
                        <p className="text-zinc-400">Order Code</p>
                        <p className="font-extrabold text-zinc-950 dark:text-white">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Transaction timestamp</p>
                        <p className="font-medium">{formattedDate}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Dispatch Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : order.status === "CANCELLED"
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Basket list */}
                    <div className="space-y-1.5 py-1">
                      {order.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs text-zinc-600 dark:text-zinc-450 font-sans">
                          <span>
                            {it.name} <span className="font-mono text-[10px] text-zinc-400">x{it.quantity}</span>
                          </span>
                          <span className="font-mono text-zinc-850 dark:text-zinc-200">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom balance and actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-zinc-55 dark:border-zinc-800 gap-4">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">Grand Total Paid</span>
                        <span className="text-base font-black text-emerald-800 dark:text-emerald-400">₹{order.total}</span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        {order.status === "PENDING" ? (
                          <button
                            id={`order-cancel-btn-${order.id}`}
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-red-650 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                          >
                            Cancel Order
                          </button>
                        ) : null}

                        {order.status !== "CANCELLED" && (
                          <div className="flex items-center gap-1.5 font-sans text-[11px] text-emerald-700 dark:text-emerald-400">
                            <Truck className="h-4 w-4 shrink-0" />
                            <span>Courier dispatch checking active</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}

              {orders.length === 0 && (
                <div className="text-center py-12 max-w-sm mx-auto space-y-4">
                  <Bookmark className="h-12 w-12 text-zinc-300 mx-auto" />
                  <h3 className="text-base font-extrabold text-zinc-850 dark:text-white">No orders are registered</h3>
                  <p className="text-xs text-zinc-450 leading-relaxed font-sans mt-1">
                    You have not placed any organic diners transactions with this account yet. Settle items in your cart to list history!
                  </p>
                  <button
                    onClick={() => setView("menu")}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Examine online Menu
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Floating nutritionist bot widget */}
      <SupportChat />

      {/* FOOTER coordinate details */}
      <Footer setView={setView} />

      {/* Checkout secure modal sheet */}
      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          user={user}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handlePlaceOrder}
        />
      )}

      {/* Customer login registry modal */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSuccess={(u) => setUser(u)}
        />
      )}

      {/* Simulated native PWA installers */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs font-sans">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 shadow-2xl p-6 text-zinc-900 dark:text-zinc-100 text-center space-y-6">
            
            <div className="flex h-12 w-12 rounded-xl bg-emerald-50 dark:bg-zinc-90 w-auto justify-center items-center shrink-0 border mx-auto">
              <img src="/src/assets/images/leafello_cafe_logo_1779911838695.png" alt="Leafello Logo" className="h-9 w-9 object-cover" />
            </div>

            <div className="space-y-1.5 leading-normal">
              <h3 className="text-lg font-black tracking-tight">Add Leafello to Home Screen</h3>
              <p className="text-xs text-zinc-405 dark:text-zinc-400">
                Install "Leafello Cafe" for rapid-load organic wellness, customized beverage logs, and local transaction caching!
              </p>
            </div>

            {/* Apple install instruction visual aid */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border text-[11px] text-zinc-500 text-left space-y-1 leading-snug">
              <p className="font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5">
                <span>iOS Safari Instruction:</span>
              </p>
              <p className="font-sans">1. Tap the Share button in Safari address bar.</p>
              <p className="font-sans">2. Scroll down and press <strong>"Add to Home Screen"</strong> option.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowPwaModal(false)}
                className="py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-90 w-auto rounded-xl text-xs font-bold text-zinc-750 font-sans cursor-pointer"
              >
                No, Thank you
              </button>
              <button
                onClick={confirmPwaInstall}
                className="py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold font-sans shadow-md cursor-pointer"
              >
                Simulate Install
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
