import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Leaf, HeartHandshake, Sparkles, Trash2 } from "lucide-react";
import { ChatMessage } from "../types";

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! 🌿 Welcome to Leafello Cafe support! I am your organic nutrition guide. How can I help you digest today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Handle smart query chips selection
  const handleChipClick = (queryText: string) => {
    onSendMessage(queryText);
  };

  const onSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Push User Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate Leafello Wellness Smart Bot response based on keywords
    setTimeout(() => {
      let botAnswer = "That is a great inquiry. Our kitchens are fully open! Could you tell me more about your nutrition interests?";
      const inputLower = textToSend.toLowerCase();

      if (inputLower.includes("sprout") || inputLower.includes("microgreen")) {
        botAnswer = "Our organic sprouts and microgreens are grown using direct vertical-hydroponic methods! We rinse them with active ionized water, ensuring pristine crispness, rich antioxidants, and active enzymes. Try the Sprouts & Microgreen Bowl! 🌱";
      } else if (inputLower.includes("deliver") || inputLower.includes("zone") || inputLower.includes("where")) {
        botAnswer = "We dispatch fresh orders within 25–40 minutes across our 8km dining corridor in HSR Layout, Bengaluru! Packed tightly in warm-locked compostable boxes. 🚀";
      } else if (inputLower.includes("recommend") || inputLower.includes("healthy") || inputLower.includes("weight") || inputLower.includes("diet")) {
        botAnswer = "For premium dieting weight wellness: Try our Special Garden Salad (rich fiber & light paneer protein) and our famous avocado Veg Sub! Settle down with our Minty Forest Mojito (sweetened naturally with zero-calorie stevia). 🥗";
      } else if (inputLower.includes("milk") || inputLower.includes("sugar") || inputLower.includes("dairy")) {
        botAnswer = "We offer absolute lactose-free freedom! You can customize any beverage or shake with rich oat milk, unsweetened almond milk, or creamy organic coconut milk. We utilize organic raw honey and stevia instead of white artificial sugars! 🥛";
      } else if (inputLower.includes("phone") || inputLower.includes("contact") || inputLower.includes("call")) {
        botAnswer = "You can talk directly to our head barista or support coordinate by dialling our primary line: +91-7340860879. We are active daily 7:00 AM – 10:30 PM! ☎️";
      } else if (inputLower.includes("refund") || inputLower.includes("cancel")) {
        botAnswer = "No stress! If an order is canceled within 3 minutes of creation, we reverse the complete transactional amount instantly to your bank. Reversal processes take 1-3 business days. 💳";
      } else if (inputLower.includes("coffee")) {
        botAnswer = "Our beans are 100% single-origin Arabica, shade-grown under organic forest canopies in Chikmagalur and roasted locally! Try the oat milk Classic Oat Latte (hot) or the whipped Cold Brew Frothy Coffee (cold). ☕";
      } else if (inputLower.includes("shake")) {
        botAnswer = "Choose our high-protein Peanut Butter Shake (24g organic whey/plant isolate, roasted oats & almond milk) or our creamy cocoa Dark Chocolate Avocado Shake! Perfect post-workout. 🥥";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "init",
        sender: "bot",
        text: "History cleared! Ask me anything about Leafello Cafe's microgreens, raw nutrition recipes, or delivery networks.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Floating Button */}
      {!isOpen && (
        <button
          id="chat-toggle-floating-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-850 text-white rounded-full shadow-2xl hover:shadow-emerald-250 hover:-translate-y-1 transition-all cursor-pointer border border-emerald-500/20 active:translate-y-0 text-sm font-bold"
        >
          <MessageSquare className="h-4.5 w-4.5 animate-pulse" />
          <span>Leafello Bot</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 sm:w-96 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 shadow-2xl flex flex-col overflow-hidden animate-fade-in text-zinc-900 dark:text-zinc-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white select-none shrink-0 border-b border-zinc-50/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Leaf className="h-4.5 w-4.5 text-emerald-300 fill-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-black font-sans leading-none">Leafello Guide AI</h4>
                <span className="text-[9px] text-emerald-305 font-mono">Nutritionist Support Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1 hover:bg-white/10 rounded"
                title="Clear History"
              >
                <Trash2 className="h-3.5 w-3.5 text-zinc-300" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded cursor-pointer"
              >
                <X className="h-4.5 w-4.5 text-zinc-300" />
              </button>
            </div>
          </div>

          {/* Message List Grid */}
          <div
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-3.5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900"
          >
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[82%] ${isBot ? "self-start animate-slide-left text-left" : "ml-auto text-right"}`}
                >
                  <div
                    className={`px-3 py-2.5 rounded-2xl text-xs font-sans leading-relaxed ${
                      isBot
                        ? "bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 rounded-tl-none shadow-xs text-zinc-800 dark:text-zinc-200"
                        : "bg-emerald-700 text-white rounded-tr-none shadow-sm dark:shadow-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-mono mt-1 px-1 block">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Choice Chips */}
          <div className="p-2 bg-white dark:bg-zinc-950 shrink-0 flex gap-1.5 overflow-x-auto border-t border-zinc-50 dark:border-zinc-900 select-none">
            {[
              { id: "recommend", text: "Recommend healthy menu" },
              { id: "delivery", text: "How long is delivery?" },
              { id: "milk", text: "Options for milk?" },
              { id: "refund", text: "Is refund possible?" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip.text)}
                className="px-2.5 py-1 text-[10px] font-mono border border-zinc-150 dark:border-zinc-805 bg-zinc-50/50 dark:bg-zinc-900 text-zinc-650 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-zinc-700 hover:text-emerald-800 dark:text-zinc-350 shrink-0 rounded-full transition-colors font-medium hover:border-emerald-250 cursor-pointer"
              >
                {chip.text}
              </button>
            ))}
          </div>

          {/* Input Form field */}
          <div className="p-3 bg-white dark:bg-zinc-950 shrink-0 flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-900">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSendMessage(inputText)}
              placeholder="Ask Leafello Guide..."
              className="flex-grow px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-emerald-500"
            />
            <button
              onClick={() => onSendMessage(inputText)}
              className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
