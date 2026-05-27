import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { CartItem, MenuItem } from "../types";

interface CartPageProps {
  cart: CartItem[];
  onUpdateQty: (item: MenuItem, change: number) => void;
  onRemoveItem: (item: MenuItem) => void;
  onProceedToCheckout: () => void;
  onBackToMenu: () => void;
}

export default function CartPage({
  cart,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  onBackToMenu,
}: CartPageProps) {
  
  // Calculate pricing metrics
  const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const hasGiftPromo = totalQuantity >= 4;
  const promoGiftDeduction = hasGiftPromo ? Math.min(...cart.map(item => item.menuItem.price)) : 0;

  const itemTotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  const discountedItemTotal = itemTotal - promoGiftDeduction;
  const packagingFee = itemTotal > 0 ? 25 : 0; // Biodegradable high-quality safety wrap
  const gst = itemTotal > 0 ? Math.round(discountedItemTotal * 0.05) : 0; // 5% cafe GST
  const grandTotal = discountedItemTotal + packagingFee + gst;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center py-20 px-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 mb-6">
          <ShoppingBag className="h-10 w-10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black font-display text-zinc-900 dark:text-zinc-50 tracking-tight">
          Your Cart is Empty!
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
          Looks like you haven't filled your plate with healthy goodness yet. Head over to our online menu to explore fresh sprouts, salads, and rich premium shakes.
        </p>
        <button
          id="cart-back-empty-btn"
          onClick={onBackToMenu}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-all cursor-pointer"
        >
          Explore Delicious Menu
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Process indicator steps */}
      <div className="flex items-center justify-center gap-4 mb-8 font-mono text-xs font-bold text-zinc-400 select-none">
        <span className="text-emerald-700 dark:text-emerald-450 flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 ring-2 ring-emerald-300">1</span>
          Shopping Cart Review
        </span>
        <span className="h-px w-8 bg-zinc-250 dark:bg-zinc-800" />
        <span className="flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300">2</span>
          Checkout Details
        </span>
        <span className="h-px w-8 bg-zinc-250 dark:bg-zinc-800" />
        <span className="flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300">3</span>
          Tasty Dispatch!
        </span>
      </div>

      <h1 className="text-3xl font-black font-display text-zinc-950 dark:text-zinc-50 tracking-tight mb-8">
        Review Your Selection
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.menuItem.id}
              id={`cart-item-row-${item.menuItem.id}`}
              className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 hover:border-emerald-100 dark:hover:border-zinc-800 rounded-2xl gap-4 shadow-xs transition-all duration-300"
            >
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Food Image */}
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-xl object-cover shrink-0 border border-zinc-100 dark:border-zinc-800"
                />
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider font-mono bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-md font-extrabold">
                    {item.menuItem.category}
                  </span>
                  <h3 id={`cart-title-${item.menuItem.id}`} className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mt-1">
                    {item.menuItem.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    ₹{item.menuItem.price} each
                  </p>
                </div>
              </div>

              {/* Quantity Changer controls and deletion */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-zinc-50 dark:border-zinc-850">
                
                {/* Quantity Buttons */}
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden shadow-xs">
                  <button
                    id={`cart-qty-dec-${item.menuItem.id}`}
                    onClick={() => onUpdateQty(item.menuItem, -1)}
                    className="p-2 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-200/55 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span id={`cart-qty-count-${item.menuItem.id}`} className="px-3 text-sm font-bold font-mono text-zinc-900 dark:text-zinc-50">
                    {item.quantity}
                  </span>
                  <button
                    id={`cart-qty-inc-${item.menuItem.id}`}
                    onClick={() => onUpdateQty(item.menuItem, 1)}
                    className="p-2 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-200/55 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Multiply calculations */}
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-mono w-20 text-right">
                  ₹{item.menuItem.price * item.quantity}
                </span>

                {/* Trash Deletion */}
                <button
                  id={`cart-remove-btn-${item.menuItem.id}`}
                  onClick={() => onRemoveItem(item.menuItem)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>

              </div>

            </div>
          ))}

          {/* Prompt banner returning to food catalog */}
          <div className="flex justify-start">
            <button
              onClick={onBackToMenu}
              className="text-emerald-700 dark:text-emerald-400 text-sm font-bold hover:underline py-1"
            >
              ← Add more items to your plate
            </button>
          </div>

        </div>

        {/* Right Column: Billing Calculations Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 p-6 space-y-6">
            
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight pb-3 border-b border-zinc-200/60 dark:border-zinc-800">
              Bill Invoice
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-sans">
                <span>Subtotal of Items</span>
                <span className="font-mono font-semibold">₹{itemTotal}</span>
              </div>
              
              {hasGiftPromo ? (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-450 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/10">
                  <span className="flex items-center gap-1">
                    🎁 Buy 4 Get 1 Free Promo
                  </span>
                  <span className="font-mono">-₹{promoGiftDeduction}</span>
                </div>
              ) : (
                <div className="text-[11px] text-amber-800 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100/40 font-medium">
                  💡 <strong>Promo Alert:</strong> Select 4 items or more to get <strong>1 item as a FREE gift!</strong> (Add {4 - totalQuantity} more)
                </div>
              )}

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-sans">
                <span className="flex items-center gap-1">
                  Eco Packaging charge
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-mono">Bio-wrap</span>
                </span>
                <span className="font-mono font-semibold">₹{packagingFee}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-sans">
                <span>5% Culinary GST</span>
                <span className="font-mono font-semibold">₹{gst}</span>
              </div>
              
              <div className="border-t border-zinc-200 dark:border-zinc-800 my-4 pt-4 flex justify-between text-base font-black text-zinc-900 dark:text-zinc-50">
                <span>Grand Total (INR)</span>
                <span className="text-xl font-black text-emerald-800 dark:text-emerald-400 font-mono">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            {/* Direct Phone Order banner */}
            <div className="rounded-2xl p-4 bg-amber-50 dark:bg-amber-950/20 text-[#856545] dark:text-amber-400 border border-amber-200/40 text-xs text-left">
              <p className="font-black text-xs flex items-center gap-1">
                📞 PLACE YOUR ORDER BY PHONE
              </p>
              <p className="mt-1 font-sans text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
                Prefer a human touch? You can call us directly to place your order with our barista instantly!
              </p>
              <a 
                href="tel:7340860879" 
                className="inline-block mt-2.5 px-4.5 py-2 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] uppercase font-mono tracking-wider transition-all"
              >
                Call +91 73408 60879
              </a>
            </div>

            {/* Zero-Chemical Pledge */}
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-8 bg-emerald-100/50 dark:border-emerald-950/60 border border-emerald-100 rounded-xl leading-snug">
              <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Leafello Organic Promise</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-sans mt-0.5">Hydropnic sprouts and farm organic ingredients, packed safely in zero-plastic containers.</p>
              </div>
            </div>

            <button
              id="cart-checkout-proceed-btn"
              onClick={onProceedToCheckout}
              className="flex w-full items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-750 to-emerald-850 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer shadow-emerald-100 dark:shadow-none hover:shadow-lg"
            >
              <span>Validate & Proceed to Pay</span>
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
