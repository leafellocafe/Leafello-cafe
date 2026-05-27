import React from "react";
import { Star, Flame, Award, Dumbbell, ShieldAlert, Plus, Check } from "lucide-react";
import { MenuItem } from "../types";

interface MenuCardProps {
  key?: string | number;
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  addedCount: number;
}

export default function MenuCard({ item, onAddToCart, addedCount }: MenuCardProps) {
  return (
    <div
      id={`menu-card-${item.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 hover:border-emerald-300 dark:hover:border-emerald-900 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Popular or Specialty Badges */}
      {item.badge && (
        <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-emerald-550/90 text-white font-semibold text-[11px] px-3 py-1 shadow-md font-mono backdrop-blur-xs">
          <Award className="h-3 w-3 animate-spin" />
          {item.badge}
        </span>
      )}

      {/* Image Wrap */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        {/* Soft Shadow Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Rating overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 dark:bg-zinc-900/95 px-2 py-0.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-sm border border-zinc-100/30">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
          <span>{item.rating}</span>
          <span className="text-[10px] text-zinc-400 font-normal">({item.votes})</span>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-col flex-grow p-5 space-y-3.5">
        
        <div className="space-y-1.5 flex-grow">
          {/* Diet metrics indicators */}
          <div className="flex items-center gap-2.5 font-mono text-[10px] font-semibold text-zinc-500 dark:text-zinc-405">
            <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-md">
              <Flame className="h-3 w-3 text-amber-500" />
              {item.calories} kCal
            </span>
            {item.protein && (
              <span className="flex items-center gap-1 bg-sky-50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-400 px-2 py-0.5 rounded-md">
                <Dumbbell className="h-3 w-3 text-sky-500" />
                {item.protein} Pro
              </span>
            )}
          </div>

          <h3 id={`menu-title-${item.id}`} className="text-base font-black font-display text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {item.name}
          </h3>
          
          <p className="text-xs text-zinc-500 dark:text-zinc-405 leading-relaxed truncate-2-lines">
            {item.description}
          </p>
        </div>

        {/* Pricing tag and Add-to-Cart Trigger */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-50 dark:border-zinc-850">
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">Total Price</span>
            <span className="text-lg font-black text-emerald-800 dark:text-emerald-400 font-mono">
              ₹{item.price}
            </span>
          </div>

          <button
            id={`menu-add-btn-${item.id}`}
            onClick={() => onAddToCart(item)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-2xl transition-all duration-300 cursor-pointer ${
              addedCount > 0
                ? "bg-emerald-800 text-white shadow-md ring-2 ring-emerald-300/40"
                : "bg-zinc-90 w-auto bg-emerald-50 hover:bg-emerald-550 border border-emerald-100 hover:border-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/40 text-emerald-800 hover:text-white dark:text-emerald-300 dark:hover:text-white"
            }`}
          >
            {addedCount > 0 ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Added ({addedCount})
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 shrink-0" />
                Add to Cart
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
