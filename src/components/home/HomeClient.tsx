// src/components/home/HomeClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calculator, 
  MapPin, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";
import { faqItems } from "@/lib/faqData";

export default function HomeClient() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="w-full overflow-hidden bg-white">
      
      {/* --- 1. HERO SECTION (Mobile Optimized) --- */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 px-4 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40 sm:opacity-100">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl mix-blend-multiply animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 text-xs sm:text-sm font-bold mb-8 border border-blue-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Jetzt live in Solingen & Umgebung
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Dein Führerschein. <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Dein Preis.
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Vergleiche Fahrschulen in deiner Nähe, berechne deine individuellen Kosten und spare bares Geld. Transparent & unabhängig.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <Link 
              href="/calculator" 
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Calculator className="w-5 h-5" />
              Kosten berechnen
            </Link>
            <Link 
              href="/calculator" 
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center text-lg"
            >
              Fahrschulen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. FEATURES --- */}
      <section className="py-16 px-4 bg-slate-50/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-600" />}
              title="Blitzschnell"
              desc="Erhalte dein persönliches Preisangebot in unter 60 Sekunden."
              bg="bg-amber-100"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
              title="100% Unabhängig"
              desc="Wir zeigen dir alle Preise transparent. Keine versteckten Kosten."
              bg="bg-emerald-100"
            />
            <FeatureCard 
              icon={<MapPin className="w-6 h-6 text-indigo-600" />}
              title="Lokal in Solingen"
              desc="Echte Daten von echten Fahrschulen direkt aus deiner Nachbarschaft."
              bg="bg-indigo-100"
            />
          </div>
        </div>
      </section>

      {/* --- 3. INTEGRATED FAQ SECTION --- */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-4">
              <HelpCircle size={28} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Häufige Fragen</h2>
            <p className="text-slate-500">Alles was du wissen musst, kurz erklärt.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaqIndex === index 
                    ? 'bg-white border-blue-200 ring-4 ring-blue-50 shadow-sm' 
                    : 'bg-slate-50 border-transparent hover:bg-slate-100'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg ${openFaqIndex === index ? 'text-blue-800' : 'text-slate-700'}`}>
                    {item.question}
                  </span>
                  <span className={`ml-4 p-1 rounded-full transition-all duration-200 ${
                    openFaqIndex === index ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden px-5">
                    <p className="text-slate-600 leading-relaxed text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. CTA FOOTER --- */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2rem] p-8 md:p-16 relative overflow-hidden text-center shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bereit durchzustarten?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Finde jetzt die Fahrschule, die zu dir passt und spare Zeit & Geld.
            </p>
            <Link 
              href="/calculator"
              className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-xl group"
            >
              Jetzt starten <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none"></div>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc, bg }: { icon: any, title: string, desc: string, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${bg}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}