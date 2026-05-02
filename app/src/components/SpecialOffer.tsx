"use client";

import React, { useState, useEffect } from "react";
import { X, Gift, Users, Heart, Shield, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

/**
 * UPDATE THE CONTENT HERE
 * You can change the text and lists below to update the offer.
 */
const OFFER_CONFIG = {
  mainTitle: "6",
  subTitle: "MONTHS",
  highlightText: "FREE",
  tagline: "TREATMENT*",
  modalHeader: "Get complimentary treatment for a family member",
  modalSubHeader: "when you opt for treatment with us",
  specialityTreatments: [
    "Diabetes", "Thyroid", "Hormone Problems", "PCOD", "Infertility", "Uterine Fibroids",
    "Sexual Problems", "Obesity", "Spondylosis", "Disc Problems", "Joint Pains", "Allergy",
    "Asthma", "Sinusitis", "Eczema", "Leucoderma", "Psoriasis", "Hair Fall", "Dandruff",
    "Adenoids", "Tonsilitis", "Kidney Stones", "Piles", "Fissures", "Fistula", "Skin Problems", "Goitre"
  ],
  features: [
    { icon: Users, text: "Care for\nYour Loved Ones" },
    { icon: Heart, text: "Expert Care,\nYou Can Trust" },
    { icon: Shield, text: "Safe, Natural &\nEffective" },
    { icon: Star, text: "Trusted by\nThousands" }
  ]
};

const SpecialOffer = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-special-offer", handleOpen);
    return () => window.removeEventListener("open-special-offer", handleOpen);
  }, []);

  return (
    <div className="fixed bottom-6 right-24 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button 
            className="group relative flex items-center justify-between gap-3 bg-gradient-to-r from-orange-600 to-orange-400 text-white px-4 py-2 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse-slow cursor-pointer border-2 border-white overflow-hidden"
            title="Special Offer"
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center leading-none">
                <span className="text-xl font-black">6</span>
                <span className="text-[8px] font-bold">MONTHS</span>
              </div>
              <div className="h-8 w-[1px] bg-white/30"></div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-black tracking-tight">FREE</span>
                <span className="text-[10px] font-bold opacity-90">TREATMENT*</span>
              </div>
            </div>
            <div className="bg-white/20 p-1.5 rounded-full">
              <Gift className="w-4 h-4 text-white" />
            </div>
            
            {/* Blinking Badge */}
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white font-bold">!</span>
            </div>
          </button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl">
          <div className="relative w-full bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 p-8 text-white">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-20"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Side: Big Promotion */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <span className="text-8xl md:text-9xl font-black leading-none drop-shadow-lg">{OFFER_CONFIG.mainTitle}</span>
                  <div className="absolute -right-4 top-0 bg-white text-orange-600 px-3 py-1 rounded-lg font-black text-xl rotate-12 shadow-md">
                    {OFFER_CONFIG.subTitle}
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase drop-shadow-md">
                    {OFFER_CONFIG.highlightText}
                  </h2>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                    <p className="text-xl md:text-2xl font-bold uppercase tracking-widest">
                      {OFFER_CONFIG.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="md:col-span-7 space-y-6">
                <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-orange-100 rounded-bl-2xl">
                    <Gift className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-orange-600 mb-2 leading-tight pr-10">
                    {OFFER_CONFIG.modalHeader}
                  </h3>
                  <p className="text-slate-600 font-medium">
                    {OFFER_CONFIG.modalSubHeader}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-12 bg-white rounded-full"></div>
                    <h4 className="text-lg font-bold tracking-wider uppercase">Speciality Treatments</h4>
                    <div className="h-1 w-12 bg-white rounded-full"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                    {OFFER_CONFIG.specialityTreatments.map((item, i) => (
                      <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold hover:bg-white hover:text-orange-600 transition-colors cursor-default border border-white/10">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Features */}
            <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4">
              {OFFER_CONFIG.features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-white/20 p-3 rounded-full">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] md:text-xs font-bold leading-tight whitespace-pre-line">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecialOffer;
