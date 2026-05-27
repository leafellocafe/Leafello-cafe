import React, { useState } from "react";
import { X, ShieldCheck, Ticket, CheckCircle2, ChevronRight, QrCode, CreditCard, Landmark, CircleDot, Truck, Lock } from "lucide-react";
import { CartItem, MenuItem } from "../types";

interface CheckoutModalProps {
  cart: CartItem[];
  user: any;
  onClose: () => void;
  onOrderSuccess: (orderData: {
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    paymentMethod: any;
    total: number;
    items: any[];
  }) => Promise<any>;
}

export default function CheckoutModal({ cart, user, onClose, onOrderSuccess }: CheckoutModalProps) {
  // Total Billing
  const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const hasGiftPromo = totalQuantity >= 4;
  const promoGiftDeduction = hasGiftPromo ? Math.min(...cart.map(item => item.menuItem.price)) : 0;

  const itemTotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  const discountedItemTotal = itemTotal - promoGiftDeduction;
  const packagingFee = itemTotal > 0 ? 25 : 0;
  const gst = itemTotal > 0 ? Math.round(discountedItemTotal * 0.05) : 0;
  const grandTotal = discountedItemTotal + packagingFee + gst;

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "takeaway">("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "APPLEPAY" | "COD">("UPI");

  // Advanced Payment Form States
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [selectedBank, setSelectedBank] = useState("SBI");

  // Flow State
  const [step, setStep] = useState<"inputs" | "verifying" | "receipt">("inputs");
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!customerName.trim()) {
      setErrorMsg("Please provide your name.");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setErrorMsg("Please provide a valid 10-digit mobile number.");
      return;
    }
    if (deliveryType === "delivery" && !deliveryAddress.trim()) {
      setErrorMsg("Please provide a valid shipping address.");
      return;
    }

    if (paymentMethod === "CARD") {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        setErrorMsg("Please fill out complete credit card digits.");
        return;
      }
    }

    // Step 2: Verification Loading Delay
    setStep("verifying");

    const orderItems = cart.map((item) => ({
      id: item.menuItem.id,
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.menuItem.price,
    }));

    try {
      setTimeout(async () => {
        const orderRes = await onOrderSuccess({
          customerName,
          phoneNumber,
          deliveryAddress: deliveryType === "takeaway" ? "Takeaway Counter" : deliveryAddress,
          paymentMethod,
          total: grandTotal,
          items: orderItems,
        });
        setCreatedOrder(orderRes);
        setStep("receipt");
      }, 2000);
    } catch (e: any) {
      setErrorMsg("An error occurred whilst placing your order. Try again.");
      setStep("inputs");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header (Hidden in receipt step for a clean look) */}
        {step !== "receipt" && (
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50 shrink-0">
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-750" /> Secure Checkout Gateway
              </h2>
              <p className="text-xs text-zinc-400 font-mono">Leafello SSL-256 Bit Encryption</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-zinc-400 hover:text-black dark:hover:text-white" />
            </button>
          </div>
        )}

        {/* Content body with scrolling */}
        <div className="flex-grow overflow-y-auto p-6">
          {errorMsg && (
            <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg border border-red-100 dark:border-red-900">
              {errorMsg}
            </div>
          )}

          {step === "inputs" && (
            <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Form: Delivery/Recipient inputs */}
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-450 font-mono">
                  1. Delivery Destination
                </h3>

                {/* Switch for takeaway vs delivery */}
                <div className="grid grid-cols-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      deliveryType === "delivery"
                        ? "bg-white dark:bg-zinc-800 shadow-xs text-emerald-800 dark:text-emerald-400"
                        : "text-zinc-500"
                    }`}
                  >
                    Home Dispatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("takeaway")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      deliveryType === "takeaway"
                        ? "bg-white dark:bg-zinc-800 shadow-xs text-emerald-800 dark:text-emerald-400"
                        : "text-zinc-500"
                    }`}
                  >
                    Takeaway Counter
                  </button>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-400 mb-1 font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sunder Pichai"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-emerald-500 text-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-400 mb-1 font-mono">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 7340860879"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-emerald-500 text-zinc-950 dark:text-zinc-100 font-mono"
                    />
                  </div>

                  {deliveryType === "delivery" && (
                    <div className="animate-fade-in">
                      <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-400 mb-1 font-mono">Delivery Address</label>
                      <textarea
                        required
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Detail your block, HSR Layout, Bengaluru..."
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-emerald-500 text-zinc-950 dark:text-zinc-100"
                      />
                    </div>
                  )}
                </div>

                {/* Mini bill preview */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-zinc-850 text-xs space-y-2 text-left text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Selected items count ({cart.length})</span>
                    <span className="font-mono">₹{itemTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-250 dark:border-zinc-800 text-sm">
                    <span>Payable Bill Total</span>
                    <span className="font-mono text-emerald-800 dark:text-emerald-400">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Right Form: Payments selection & specifics */}
              <div className="space-y-5 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-450 font-mono">
                  2. Financial Channel
                </h3>

                {/* Option selection chips */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "UPI", label: "UPI Pay", icon: QrCode },
                    { id: "CARD", label: "Credit Card", icon: CreditCard },
                    { id: "NETBANKING", label: "Net Banking", icon: Landmark },
                    { id: "APPLEPAY", label: "Apple Pay", icon: CircleDot },
                    { id: "COD", label: "Cash on Deliv.", icon: Truck },
                  ].map((pay) => {
                    const Icon = pay.icon;
                    return (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setPaymentMethod(pay.id as any)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          paymentMethod === pay.id
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350 shadow-sm"
                            : "border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-emerald-755 dark:text-emerald-400" />
                        <span>{pay.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Specific form based on choice */}
                <div className="p-4 bg-zinc-55 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 min-h-[160px] flex flex-col justify-center">
                  
                  {/* UPI */}
                  {paymentMethod === "UPI" && (
                    <div className="space-y-3 font-sans text-center">
                      <div className="flex justify-center mb-1">
                        <div className="p-2 border border-emerald-100 bg-emerald-50 rounded-xl">
                          <QrCode className="h-20 w-20 text-emerald-850" />
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        Scan with GPay, PhonePe, Paytm, or enter UPI ID below:
                      </p>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. leafello@okhdfcbank"
                        className="w-full text-center px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs focus:outline-emerald-500 font-mono"
                      />
                    </div>
                  )}

                  {/* CREDIT CARD */}
                  {paymentMethod === "CARD" && (
                    <div className="space-y-3 text-xs">
                      {/* Interactive visual Card mockup */}
                      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-4 rounded-xl shadow-md flex flex-col justify-between h-28 font-mono">
                        <div className="flex justify-between items-center text-[10px]">
                          <span>LEAFELLO PRESTIGE COFFEE CLUB</span>
                          <CreditCard className="h-5 w-5 text-emerald-300" />
                        </div>
                        <p className="text-sm font-semibold tracking-widest text-emerald-200">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        <div className="flex justify-between text-[9px] text-emerald-300">
                          <div>
                            <p className="text-[7px] text-emerald-400 uppercase">Card Holder</p>
                            <p className="truncate max-w-[120px]">{cardHolder || "NAME SURNAME"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[7px] text-emerald-400 uppercase">Expiry</p>
                            <p>{cardExpiry || "MM/YY"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-[10px] text-zinc-500 font-mono mb-0.5">Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, "").replace(/(.{4})/g, "$1 ").trim())}
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-500 font-mono mb-0.5">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            placeholder="NAME SURNAME"
                            className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-center uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-500 font-mono mb-0.5">Expiry date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-500 font-mono mb-0.5">Secure CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="•••"
                            className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NET BANKING */}
                  {paymentMethod === "NETBANKING" && (
                    <div className="space-y-4">
                      <p className="text-[11px] text-zinc-500 font-sans text-center">
                        Select your verified banking gateway coordinates:
                      </p>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-zinc-800 dark:text-zinc-200"
                      >
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="HDFC">HDFC Bank Secure Portal</option>
                        <option value="ICICI">ICICI Bank Retail Gateway</option>
                        <option value="AXIS">Axis Bank Limited</option>
                        <option value="KOTAK">Kotak Mahindra NetBanking</option>
                      </select>
                    </div>
                  )}

                  {/* APPLE PAY */}
                  {paymentMethod === "APPLEPAY" && (
                    <div className="space-y-4 text-center">
                      <div className="inline-flex h-9 justify-center items-center gap-1.5 px-4 py-1.5 bg-black text-white hover:bg-zinc-900 rounded-lg cursor-pointer mx-auto transition-transform active:scale-95 font-medium text-xs">
                        <span className="font-semibold text-sm"> Pay</span>With FaceID
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Validating credentials on iCloud Keychain storage. Under click parameters, double pressing power keys secures immediate dispatch.
                      </p>
                    </div>
                  )}

                  {/* COD */}
                  {paymentMethod === "COD" && (
                    <div className="space-y-2 text-center text-zinc-600 dark:text-zinc-300 py-2">
                      <Truck className="h-10 w-10 mx-auto text-emerald-700 animate-pulse" />
                      <p className="text-xs font-bold text-zinc-850 dark:text-zinc-100">Cash/UPI on Delivery</p>
                      <p className="text-[10px] text-zinc-400 leading-normal max-w-xs mx-auto">
                        Zero upfront transaction required. Directly settle bill amount in cash or scan dispatch courier's QR code when healthy items are safely handed over.
                      </p>
                    </div>
                  )}

                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-transform active:scale-[0.99] cursor-pointer"
                >
                  Confirm Payment • ₹{grandTotal} <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </form>
          )}

          {step === "verifying" && (
            <div className="py-16 text-center space-y-4">
              <div className="relative mx-auto h-16 w-16 items-center justify-center flex">
                <span className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse" />
                <span className="absolute inset-0 rounded-full border-b-4 border-emerald-750 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-mono">
                Authorizing Settle Request
              </h3>
              <p className="text-xs text-zinc-405 leading-relaxed max-w-xs mx-auto font-sans">
                Interfacing with secure banking coordinates. Settle details are being saved to your customer profiles history ledger...
              </p>
            </div>
          )}

          {step === "receipt" && createdOrder && (
            <div className="py-6 text-center space-y-8 animate-fade-in text-zinc-900 dark:text-zinc-100">
              
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-emerald-850 dark:text-emerald-400 tracking-tight">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Reference Code: <span className="font-extrabold text-zinc-900 dark:text-white">{createdOrder.id}</span>
                </p>
              </div>

              {/* Order summary list */}
              <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-150 dark:border-zinc-800/80 max-w-md mx-auto text-left space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono pb-2 border-b border-zinc-250 dark:border-zinc-800">
                  Receipt Summary
                </h4>
                
                <div className="max-h-24 overflow-y-auto space-y-2">
                  {createdOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                      <span>{item.name} <span className="text-zinc-400 text-[10px]">x{item.quantity}</span></span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-250 dark:border-zinc-800 flex justify-between text-xs text-zinc-800 dark:text-zinc-200">
                  <span>Shipping Address:</span>
                  <span className="font-medium max-w-[200px] truncate">{createdOrder.deliveryAddress}</span>
                </div>

                <div className="flex justify-between text-sm font-black pt-1">
                  <span>Settle Total:</span>
                  <span className="font-mono text-emerald-850 dark:text-emerald-400">₹{createdOrder.total}</span>
                </div>
              </div>

              {/* simulated courier progress card */}
              <div className="max-w-md mx-auto p-4 bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl flex items-center gap-3.5 text-left">
                <Truck className="h-10 w-10 text-emerald-800 dark:text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Culinary Dispatch Tracker</h5>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-normal">
                    A delicious fresh dispatch rider has been checked! Estimating arrival coordinates within <span className="font-bold font-mono">32 minutes</span>. Hot-locked insulation seals are fully secure!
                  </p>
                </div>
              </div>

              <div className="pt-4 max-w-xs mx-auto">
                <button
                  id="receipt-complete-close"
                  onClick={onClose}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Continue Dining
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
