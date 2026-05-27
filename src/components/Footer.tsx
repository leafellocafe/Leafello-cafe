import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, ShieldCheck, Heart } from "lucide-react";
import { PageView } from "../types";

interface FooterProps {
  setView: (view: PageView) => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="bg-zinc-900 border-t-4 border-emerald-800 text-zinc-300 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-zinc-800">
          
          {/* Brand Presentation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 overflow-hidden rounded-full border border-emerald-800 bg-zinc-800/80 justify-center items-center">
                <img
                  src="/src/assets/images/leafello_cafe_logo_1779911838695.png"
                  alt="Leafello Logo"
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 object-cover"
                />
              </div>
              <div>
                <span className="font-sans text-lg font-black tracking-tight text-emerald-400">
                  Leafello
                </span>
                <span className="text-[10px] block -mt-1 font-mono tracking-widest text-emerald-500 font-bold">
                  CAFE
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              Welcome to a luxury healthy wellness culinary dining concept. Cultivating locally hydroponic sprouts, nutrient-rich salads and artisanal Arabica coffee brews.
            </p>
            <div className="flex space-x-3 pt-1">
              <a href="#" className="p-2 bg-zinc-800 hover:bg-emerald-800 rounded-full text-zinc-400 hover:text-white transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-800 hover:bg-emerald-800 rounded-full text-zinc-400 hover:text-white transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-800 hover:bg-emerald-800 rounded-full text-zinc-400 hover:text-white transition-all">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Dining Links */}
          <div>
            <h3 className="text-zinc-100 font-bold text-sm tracking-widest uppercase mb-4 text-emerald-450 font-mono">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <button onClick={() => setView("home")} className="hover:text-emerald-450 transition-colors">
                  Home Board
                </button>
              </li>
              <li>
                <button onClick={() => setView("menu")} className="hover:text-emerald-450 transition-colors">
                  Explore Menu
                </button>
              </li>
              <li>
                <button onClick={() => setView("about")} className="hover:text-emerald-440 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => setView("support")} className="hover:text-emerald-440 transition-colors">
                  Support & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Business Schedule hours */}
          <div>
            <h3 className="text-zinc-100 font-bold text-sm tracking-widest uppercase mb-4 text-emerald-450 font-mono">
              Operating Hours
            </h3>
            <ul className="space-y-3.5 text-sm font-sans text-zinc-405">
              <li className="flex items-start gap-2.5">
                <Clock className="h-4.5 w-4.5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-200">Daily Monday – Sunday</p>
                  <p className="text-xs text-zinc-450">7:00 AM – 10:30 PM IST</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-200">Super Safe Packaging</p>
                  <p className="text-xs text-zinc-450">Seal-locked, biodegradable thermal dispatch</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Main Contacts */}
          <div>
            <h3 className="text-zinc-100 font-bold text-sm tracking-widest uppercase mb-4 text-emerald-440 font-mono">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-445 shrink-0" />
                <a href="tel:7340860879" className="hover:text-emerald-400 transition-colors font-mono">
                  +91-7340860879
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-445 shrink-0" />
                <a href="mailto:leafellocafe@gmail.com" className="hover:text-emerald-400 transition-colors">
                  leafellocafe@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-445 mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  Sector 5, HSR Layout, Bengaluru, Karnataka 560102
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom footer credit panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© 2026 Leafello Cafe Pvt Ltd. Fresh • Healthy • Delicious.</p>
          <p className="flex items-center gap-1.5 justify-center">
            Made with <Heart className="h-3 w-3 text-red-500 fill-current animate-pulse" /> for healthy dining
          </p>
        </div>

      </div>
    </footer>
  );
}
