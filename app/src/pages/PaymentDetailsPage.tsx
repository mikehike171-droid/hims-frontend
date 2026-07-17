"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronRight, CreditCard, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

// Type definitions for window.Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentDetailsPage = () => {
  const { t } = useLanguage();
  
  // Form states
  const [amount, setAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successDetails, setSuccessDetails] = useState<any>(null);

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Create order on the backend settings-service
      const parsedAmount = parseFloat(amount);
      const orderResponse = await settingsApi.createOnlinePayment({
        name,
        email,
        phone,
        amount: parsedAmount,
      });

      const { paymentId, orderId } = orderResponse;

      // 2. Configure and open Razorpay Checkout
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TD20XDfgDr0m4x";
      
      const options = {
        key: rzpKey,
        amount: Math.round(parsedAmount * 100),
        currency: "INR",
        name: "UniCare Homeopathy",
        description: "Online Treatment Payment",
        order_id: orderId,
        handler: async function (response: any) {
          setPaymentStatus("verifying");
          try {
            // 3. Verify signature on the backend
            const verificationRes = await settingsApi.verifyOnlinePayment({
              paymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verificationRes.success) {
              setPaymentStatus("success");
              setSuccessDetails({
                paymentId: response.razorpay_payment_id,
                amount: parsedAmount,
                name,
              });
            } else {
              setPaymentStatus("failed");
              setErrorMessage("Payment verification failed. Please contact support.");
            }
          } catch (err: any) {
            setPaymentStatus("failed");
            setErrorMessage(err.message || "Failed to verify payment signature");
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#00A8A8", // UniCare teal branding color
        },
        modal: {
          ondismiss: async function () {
            setIsSubmitting(false);
            // Optional: notify backend of modal close / cancellation
            try {
              await settingsApi.failOnlinePayment(paymentId, {
                reason: "User closed the payment modal",
              });
            } catch (err) {
              console.error("Failed to fail payment on modal close", err);
            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on("payment.failed", async function (response: any) {
        setPaymentStatus("failed");
        setIsSubmitting(false);
        setErrorMessage(response.error.description || "Payment failed");
        
        try {
          await settingsApi.failOnlinePayment(paymentId, {
            error: response.error,
          });
        } catch (err) {
          console.error("Failed to report payment failure to backend", err);
        }
      });

      razorpayInstance.open();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Something went wrong while initiating payment");
    }
  };

  const getFormattedAmount = () => {
    const val = parseFloat(amount);
    return isNaN(val) ? "0.00" : val.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full flex flex-col justify-center">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 self-start">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-primary">Payment Details</span>
        </div>

        {paymentStatus === "success" ? (
          <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
              <p className="text-slate-500 mt-2 text-sm">Thank you for your payment. Your transaction has been processed.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3 text-left border border-slate-100">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Name</span>
                <span className="text-slate-800">{successDetails?.name}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Amount Paid</span>
                <span className="text-slate-800 text-sm font-bold">₹ {successDetails?.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Transaction ID</span>
                <span className="text-slate-800 font-mono select-text">{successDetails?.paymentId}</span>
              </div>
            </div>
            <div className="pt-2">
              <Link 
                href="/" 
                className="w-full bg-[#00A8A8] text-white py-3.5 rounded-2xl font-bold hover:bg-[#008e8e] transition-colors flex items-center justify-center shadow-lg"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : paymentStatus === "verifying" ? (
          <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Verifying Payment...</h2>
              <p className="text-slate-500 mt-2 text-sm">Please do not close this browser or reload the page while we verify your transaction status.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual copy & Brand Promise */}
            <div className="lg:col-span-6 space-y-6 hidden lg:block">
              <span className="px-3 py-1 bg-[#00A8A8]/10 text-[#00A8A8] rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                Secure checkout
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight font-heading">
                Make Secure Online Payments Instantly
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Pay safely using your favorite methods like UPI, Cards, Netbanking, or Wallets. All payments are encrypted, PCI-compliant, and processed immediately.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">100% Encrypted Transactions</h4>
                    <p className="text-xs text-slate-400">Industry-standard 256-bit SSL encryption protects your details.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500 shrink-0">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Multiple Payment Options</h4>
                    <p className="text-xs text-slate-400">Pay using Google Pay, PhonePe, Cards, NetBanking and more.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Card matching original mockup */}
            <div className="lg:col-span-6 w-full max-w-lg mx-auto">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col justify-between">
                
                <form onSubmit={handlePayNow} className="p-8 space-y-6">
                  {/* Card Title & Blue line */}
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1A365D]">Payment Details</h2>
                    <div className="w-12 h-1 bg-[#3B82F6] rounded-full" />
                  </div>

                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 text-rose-600 text-xs font-semibold select-text">
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Form inputs */}
                  <div className="space-y-4">
                    
                    {/* Amount */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 flex justify-between">
                        <span>Amount *</span>
                        {errors.amount && <span className="text-rose-500 font-medium">{errors.amount}</span>}
                      </label>
                      <div className={`flex items-center bg-slate-50 border ${errors.amount ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'} rounded-2xl px-4 py-3.5 transition-all`}>
                        <span className="text-slate-400 font-semibold mr-2 text-sm">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                            if (errors.amount) setErrors(prev => ({ ...prev, amount: "" }));
                          }}
                          placeholder="Enter Amount"
                          disabled={isSubmitting}
                          className="bg-transparent w-full text-slate-800 text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal outline-none"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 flex justify-between">
                        <span>Name *</span>
                        {errors.name && <span className="text-rose-500 font-medium">{errors.name}</span>}
                      </label>
                      <div className={`flex items-center bg-slate-50 border ${errors.name ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'} rounded-2xl px-4 py-3.5 transition-all`}>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                          }}
                          placeholder="Your Name"
                          disabled={isSubmitting}
                          className="bg-transparent w-full text-slate-800 text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal outline-none"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 flex justify-between">
                        <span>Email *</span>
                        {errors.email && <span className="text-rose-500 font-medium">{errors.email}</span>}
                      </label>
                      <div className={`flex items-center bg-slate-50 border ${errors.email ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'} rounded-2xl px-4 py-3.5 transition-all`}>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                          }}
                          placeholder="Your Email"
                          disabled={isSubmitting}
                          className="bg-transparent w-full text-slate-800 text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal outline-none"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 flex justify-between">
                        <span>Phone *</span>
                        {errors.phone && <span className="text-rose-500 font-medium">{errors.phone}</span>}
                      </label>
                      <div className="flex gap-2">
                        {/* Prefix box */}
                        <div className="flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 select-none shrink-0">
                          <span className="text-slate-600 text-xs font-bold whitespace-nowrap">IN +91</span>
                        </div>
                        {/* Input */}
                        <div className={`flex items-center bg-slate-50 border ${errors.phone ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'} rounded-2xl px-4 py-3.5 transition-all w-full`}>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value.replace(/\D/g, ""));
                              if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                            }}
                            placeholder="10-digit number"
                            disabled={isSubmitting}
                            className="bg-transparent w-full text-slate-800 text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal outline-none"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </form>

                {/* Footer with checkout logos and button */}
                <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Checkout Logos */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">We Accept:</span>
                    <div className="flex items-center gap-2 opacity-75 grayscale hover:grayscale-0 transition-all select-none">
                      {/* UPI Logo */}
                      <span className="text-[9px] font-black tracking-tighter px-1.5 py-0.5 rounded border border-orange-400 text-orange-500 bg-white">UPI</span>
                      {/* VISA Logo */}
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-400 text-blue-600 bg-white font-serif">VISA</span>
                      {/* RuPay Logo */}
                      <span className="text-[9px] font-extrabold italic px-1.5 py-0.5 rounded border border-cyan-400 text-cyan-600 bg-white font-sans">RuPay</span>
                      {/* PCI Compliant Badge */}
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> PCI
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handlePayNow}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-400 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Pay ₹ {getFormattedAmount()}</span>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PaymentDetailsPage;
