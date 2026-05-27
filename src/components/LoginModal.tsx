import React, { useState } from "react";
import { X, UserPlus, Award, Lock, ShieldAlert } from "lucide-react";
import { mockAuthService } from "../firebase";

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const user = await mockAuthService.signInWithGoogle();
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Google Sign-in failed or was cancelled.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please provide your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const loggedUser = mockAuthService.signInMock(name, email, phone);
        onSuccess(loggedUser);
        onClose();
      } catch (err) {
        setErrorMsg("Failed to sign in. Please check details.");
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 shadow-2xl overflow-hidden animate-fade-in text-zinc-900 dark:text-zinc-100">
        
        {/* Banner Graphic background */}
        <div className="h-28 bg-gradient-to-br from-emerald-800 to-emerald-950 relative p-6 flex flex-col justify-end text-white select-none">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-bold">Welcome Diner</span>
          <h2 className="text-xl font-black font-sans leading-tight">Leafello Cafe Sign-In</h2>
          <p className="text-[10px] text-emerald-200 font-mono mt-0.5">Access Loyalty Program & Live Orders Sync</p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-2.5 bg-red-50 dark:bg-red-955/20 border border-red-100 dark:border-red-900 rounded-lg text-xs font-semibold text-red-600 block text-left">
              {errorMsg}
            </div>
          )}

          {/* Real Google Sign-in for Live Sync */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 py-3.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.92 15.54 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.56-4.435 10.56-10.74 0-.72-.08-1.27-.18-1.975H12.24z"
              />
            </svg>
            Sign in with Google Account
          </button>

          <div className="flex items-center gap-2 py-1">
            <span className="h-px flex-1 bg-zinc-150 dark:bg-zinc-900" />
            <span className="text-[9px] text-zinc-450 uppercase font-mono tracking-wider font-bold">or continue as guest</span>
            <span className="h-px flex-1 bg-zinc-150 dark:bg-zinc-900" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3.5 text-left text-xs">
              <div>
                <label className="block text-zinc-650 dark:text-zinc-400 font-bold mb-1 font-mono">Diner's Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunder Pichai"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-90 w-auto text-xs focus:outline-emerald-550 text-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-650 dark:text-zinc-400 font-bold mb-1 font-mono">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sunder@google.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-emerald-550 text-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-650 dark:text-zinc-400 font-bold mb-1 font-mono">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 7340860879"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-emerald-550 text-zinc-950 dark:text-zinc-100 font-mono"
                />
              </div>
            </div>

            {/* Perks checklist */}
            <div className="p-3 bg-emerald-50/50 dark:bg-zinc-900/40 rounded-xl border border-emerald-100/50 dark:border-zinc-805/60 text-[10px] text-emerald-850 dark:text-emerald-400 flex items-start gap-2 text-left leading-normal font-sans">
              <Award className="h-4.5 w-4.5 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-300">New Account Perks Unlocked:</p>
                <p className="mt-0.5 text-zinc-550 dark:text-zinc-400">Instantly credit <span className="font-bold">50 Free Leaf Point Credits</span> on your receipt history ledger! Access dynamic order cancel functions.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-1.5 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-xs"
            >
              {loading ? (
                <span className="flex h-4 w-4 rounded-full border-2 border-white/30 border-b-white animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Guest Account
                </>
              )}
            </button>
            
            <div className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
              <Lock className="h-3 w-3 text-zinc-300" />
              Your data is 100% secure.
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
