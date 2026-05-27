import { useState, useEffect } from "react";
import { ShoppingCart, Moon, Sun, Menu, X, Coffee, User, LogOut, FileText, Compass, Sparkles } from "lucide-react";
import { PageView } from "../types";

interface NavbarProps {
  currentView: PageView;
  setView: (view: PageView) => void;
  cartCount: number;
  user: any;
  onLogout: () => void;
  openLogin: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  user,
  onLogout,
  openLogin,
  darkMode,
  setDarkMode,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navLinks: { label: string; view: PageView; icon: any }[] = [
    { label: "Home", view: "home", icon: Compass },
    { label: "Our Menu", view: "menu", icon: Coffee },
    { label: "Contact Us", view: "about", icon: FileText },
    { label: "Help & Support", view: "support", icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Brand ID */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("home")}>
            <div className="relative flex h-10 w-10 overflow-hidden rounded-full border border-emerald-100 dark:border-zinc-800 bg-emerald-50 dark:bg-zinc-900 justify-center items-center">
              <img
                src="/src/assets/images/leafello_cafe_logo_1779911838695.png"
                alt="Leafello Logo"
                referrerPolicy="no-referrer"
                className="h-9 w-9 object-cover"
                onError={(e) => {
                  // Fallback to simple icon if image fails
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <span className="font-display text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-400">
                Leafello
              </span>
              <span className="text-[10px] block -mt-1 font-mono tracking-widest text-[#856545] dark:text-amber-500 font-bold">
                CAFE
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  id={`nav-link-${link.view}`}
                  onClick={() => setView(link.view)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                    isActive
                      ? "bg-stone-850 text-white dark:bg-emerald-950/50 dark:text-emerald-400 border border-stone-850 dark:border-emerald-900/50 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-emerald-700 dark:hover:text-emerald-400"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {link.label}
                </button>
              );
            })}

            {user && (
              <button
                id="nav-link-history"
                onClick={() => setView("history")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  currentView === "history"
                    ? "bg-stone-850 text-white dark:bg-emerald-950/50 dark:text-emerald-400 border border-stone-850 dark:border-emerald-900/50 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-emerald-700 dark:hover:text-emerald-400"
                }`}
              >
                My Orders
              </button>
            )}
          </div>

          {/* Right Utilities (Cart, Dark Mode, Profile) */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Dark Mode Toggle */}
            <button
              id="theme-toggler"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors border border-zinc-100 dark:border-zinc-805"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4 w-4 text-emerald-400" /> : <Moon className="h-4 w-4 text-amber-800" />}
            </button>

            {/* Cart Controller Icon */}
            <button
              id="navbar-cart-btn"
              onClick={() => setView("cart")}
              className="relative p-2.5 text-zinc-700 dark:text-zinc-200 bg-emerald-50 dark:bg-zinc-900/40 border border-emerald-100 dark:border-zinc-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow-sm ring-1 ring-white dark:ring-zinc-950 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Button or User ID */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <div
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                  onClick={() => setView("history")}
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.displayName}`}
                    alt="user profile"
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full border border-emerald-200"
                  />
                  <div className="text-left leading-none max-w-[80px] truncate">
                    <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 font-mono">Member</p>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.displayName || "User"}</p>
                  </div>
                </div>
                <button
                  id="navbar-signout-btn"
                  onClick={onLogout}
                  className="p-1.5 text-zinc-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/25 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={openLogin}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white shadow-sm shadow-emerald-100 dark:shadow-none hover:shadow-md transition-all cursor-pointer"
              >
                <User className="h-4 w-4" />
                Guest Access
              </button>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Cart on mobile */}
            <button
              onClick={() => setView("cart")}
              className="relative p-2 text-zinc-700 dark:text-zinc-200 bg-emerald-50 dark:bg-zinc-900/40 border border-emerald-100 dark:border-zinc-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-zinc-800 transition-all"
            >
              <ShoppingCart className="h-4 w-4 text-emerald-850 dark:text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg border border-zinc-10s dark:border-zinc-800"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-colors py-3 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="space-y-1.5 px-4 pb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.view}
                  onClick={() => {
                    setView(link.view);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    currentView === link.view
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-l-4 border-emerald-600"
                      : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </button>
              );
            })}

            {user && (
              <button
                onClick={() => {
                  setView("history");
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  currentView === "history"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-l-4 border-emerald-600"
                    : "text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <Coffee className="h-5 w-5" />
                My Orders
              </button>
            )}

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 mt-2 space-y-3">
              <div className="flex items-center justify-between px-3 py-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Theme</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-md border border-zinc-100 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200"
                >
                  {darkMode ? (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-500" /> Light
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5 text-emerald-700" /> Dark
                    </>
                  )}
                </button>
              </div>

              {user ? (
                <div className="bg-emerald-50/50 dark:bg-zinc-900/50 p-3 rounded-xl border border-emerald-100/50 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.displayName}`}
                      alt="user profile"
                      className="h-8 w-8 rounded-full border border-emerald-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{user.displayName}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 py-2 text-sm text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-lg hover:bg-red-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Secure Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openLogin();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-emerald-755 hover:bg-emerald-800 rounded-xl shadow-md cursor-pointer"
                >
                  <User className="h-4.5 w-4.5" />
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
