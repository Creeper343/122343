// src/components/calculator/SchoolList.tsx
import Link from 'next/link';
import { calculatePrice, ExperienceLevel, experienceLevels } from "@/lib/priceCalculator";
import { ChevronRight, CheckCircle2, Trophy, Star, Languages, Zap } from 'lucide-react';
import { School } from './CalculatorClient'; // Importiere den Typen

interface SchoolListProps {
    schools: School[];
    selectedLevel: ExperienceLevel;
}

export default function SchoolList({ schools, selectedLevel }: SchoolListProps) {
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    // 1. Daten anreichern
    const schoolsWithPrices = schools.map(school => ({
        ...school,
        totalPrice: calculatePrice(school, selectedLevel)
    }));

    // 2. Sortieren: Premium zuerst, dann nach Preis
    // Dadurch stehen ALLE Premium-Schulen oben (nicht nur eine)
    const sortedSchools = schoolsWithPrices.sort((a, b) => {
        if (a.is_premium && !b.is_premium) return -1;
        if (!a.is_premium && b.is_premium) return 1;
        return a.totalPrice - b.totalPrice;
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end mb-4 px-2">
                <h2 className="text-lg font-bold text-gray-700">Suchergebnisse</h2>
                <span className="text-sm text-gray-500">{schools.length} Fahrschulen gefunden</span>
            </div>

            <div className="grid gap-4">
                {sortedSchools.map((school) => {
                    const isPremium = school.is_premium;

                    return (
                        <Link href={`/school/${school.id}`} key={school.id} className="group block">
                            <div className={`
                                relative p-6 rounded-2xl transition-all duration-300 flex flex-col md:flex-row gap-6
                                ${isPremium 
                                    ? 'bg-gradient-to-r from-white to-blue-50/50 border-2 border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-300 transform hover:-translate-y-1' 
                                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                                }
                            `}>
                                {/* --- PREMIUM BADGE --- */}
                                {isPremium && (
                                    <div className="absolute -top-3 left-6">
                                        <span className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                            <Trophy size={10} className="text-yellow-300" /> Empfehlung
                                        </span>
                                    </div>
                                )}

                                {/* --- MAIN CONTENT --- */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                                {school.name}
                                                {isPremium && <CheckCircle2 size={18} className="text-blue-500" />}
                                            </h3>
                                            <p className="text-gray-500 text-sm">{school.address}, {school.city}</p>
                                        </div>
                                    </div>

                                    {/* --- TAGS & FEATURES (Neu) --- */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {/* Mock Data Fallback falls DB leer */}
                                        {((school.languages && school.languages.length > 0) ? school.languages : (isPremium ? ["Deutsch", "Englisch"] : ["Deutsch"])).map(lang => (
                                            <span key={lang} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                                <Languages size={12} /> {lang}
                                            </span>
                                        ))}
                                        
                                        {isPremium && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md font-medium border border-amber-100">
                                                <Star size={12} className="fill-amber-400 text-amber-400" /> Top Bewertet
                                            </span>
                                        )}
                                        {isPremium && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-medium border border-green-100">
                                                <Zap size={12} /> Schnellkurs
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* --- PRICE SECTION --- */}
                                <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 md:gap-1 md:w-48 md:border-l md:border-gray-100 md:pl-6">
                                    <div className="text-left md:text-right">
                                        <span className="text-xs text-gray-400 uppercase font-semibold block mb-0.5">
                                            {experienceLevels[selectedLevel].label}
                                        </span>
                                        <span className={`text-2xl font-black ${isPremium ? 'text-blue-600' : 'text-gray-900'}`}>
                                            {formatPrice(school.totalPrice)}
                                        </span>
                                        {isPremium && <p className="text-[10px] text-green-600 font-bold">Bestpreis Garantie</p>}
                                    </div>
                                    
                                    <div className={`
                                        h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isPremium 
                                            ? 'bg-blue-600 text-white shadow-lg group-hover:scale-110' 
                                            : 'bg-gray-100 text-gray-400 group-hover:bg-gray-900 group-hover:text-white'
                                        }
                                    `}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}