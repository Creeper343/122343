// src/components/calculator/CalculatorClient.tsx
"use client";

import { useState } from "react";
import CityFilter from "@/components/calculator/CityFilter";
import SchoolList from "@/components/calculator/SchoolList";
import { getSchoolsByCity } from "@/app/actions/schoolActions";
import { ExperienceLevel, experienceLevels, calculatePrice } from "@/lib/priceCalculator";
import { AVAILABLE_TAGS } from "@/lib/tags";
import { AVAILABLE_LANGUAGES } from "@/lib/languages"; 
import { Search, Settings, ChevronDown, ChevronUp, Info, Wand2, Euro } from "lucide-react";

// Sicherheits-Fallback
const SAFE_LANGUAGES = AVAILABLE_LANGUAGES || ["Deutsch", "Englisch"];

export type School = {
    id: string;
    name: string;
    address: string;
    PLZ: string;
    city: string;
    grundgebuehr: number;
    driving_price: number;
    theorypruefung: number;
    praxispruefung: number;
    is_premium: boolean;
    tags?: string[];
    languages?: string[];
    score?: number; 
    matchCount?: number;
};

export type UserPreferences = {
    targetLanguage: string;
    priorityTags: string[];
};

export default function CalculatorClient({ cities }: { cities: string[] }) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>("beginner");
    const [showAdvanced, setShowAdvanced] = useState(false);

    // --- NEU: Sortier-Modus statt Boolean ---
    const [sortMode, setSortMode] = useState<'price' | 'smart'>('price');

    const [preferences, setPreferences] = useState<UserPreferences>({
        targetLanguage: "Deutsch",
        priorityTags: []
    });

    const handleFindSchools = async () => {
        if (!selectedCity) return;
        setIsLoading(true);
        setSearched(true);
        
        const result = await getSchoolsByCity(selectedCity);
        setSchools(result as School[]);
        setIsLoading(false);
    };

    // --- SORTIERUNG ---
    const getSortedSchools = () => {
        const schoolsCopy = [...schools];

        // 1. MODUS: NACH PREIS (Günstigste zuerst)
        if (sortMode === 'price') {
            return schoolsCopy.sort((a, b) => {
                const priceA = calculatePrice(a, selectedLevel);
                const priceB = calculatePrice(b, selectedLevel);
                return priceA - priceB;
            });
        }

        // 2. MODUS: SMART MATCH
        return schoolsCopy.map(school => {
            let score = 0;
            const totalPrice = calculatePrice(school, selectedLevel);

            // A. Sprache (K.O. Kriterium - Basis 10.000)
            const schoolLangs = school.languages || [];
            const hasLanguage = schoolLangs.includes(preferences.targetLanguage) || 
                                (preferences.targetLanguage === "Deutsch" && (schoolLangs.length === 0 || schoolLangs.includes("Deutsch")));
            
            if (hasLanguage) {
                score += 10000;
            } else {
                score -= 10000;
            }

            // B. Tags (Wichtigstes Kriterium - 1.000 pro Treffer)
            preferences.priorityTags.forEach(tag => {
                if (school.tags?.includes(tag)) {
                    score += 1000;
                }
            });

            // C. Preis (Tie-Breaker - 0 bis 500 Punkte)
            // Invertiert: Günstiger = mehr Punkte
            const priceScore = Math.max(0, 500 - (totalPrice / 10)); 
            score += priceScore;

            // D. Premium (Mini Bonus - 10 Punkte)
            if (school.is_premium) score += 10;

            return { ...school, score };
        }).sort((a, b) => (b.score || 0) - (a.score || 0));
    };

    const sortedSchools = getSortedSchools();

    const toggleTag = (tagId: string) => {
        setPreferences(prev => ({
            ...prev,
            priorityTags: prev.priorityTags.includes(tagId) 
                ? prev.priorityTags.filter(t => t !== tagId)
                : [...prev.priorityTags, tagId]
        }));
    };

    const levelLabels: Record<ExperienceLevel, string> = {
        beginner: "Anfänger (Keine Erfahrung)",
        someExperience: "Etwas Erfahrung",
        advanced: "Fortgeschritten",
        veryExperienced: "Profikurs (Umschreiber)",
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Finde die günstigste Fahrschule
                </h1>
                <p className="text-gray-500">Vergleiche Preise in deiner Stadt – schnell & transparent.</p>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="bg-white p-2 md:p-3 rounded-xl shadow-xl border border-gray-200 relative z-10">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase px-2 mb-1">Stadt</label>
                        <CityFilter cities={cities} onCitySelect={setSelectedCity} />
                    </div>
                    <div className="hidden md:block w-px bg-gray-200 my-2"></div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                        <label className="block text-xs font-bold text-gray-500 uppercase px-2 mb-1">Erfahrung</label>
                        <div className="px-2">
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value as ExperienceLevel)}
                                className="w-full bg-transparent text-gray-900 font-semibold focus:outline-none cursor-pointer py-1"
                            >
                                {Object.entries(experienceLevels).map(([key]) => (
                                    <option key={key} value={key}>
                                        {levelLabels[key as ExperienceLevel]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="md:w-auto">
                        <button
                            onClick={handleFindSchools}
                            disabled={!selectedCity || isLoading}
                            className="w-full h-full md:px-8 py-3 md:py-0 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <span className="animate-pulse">Suchen...</span> : <><Search size={20} /><span>Preise prüfen</span></>}
                        </button>
                    </div>
                </div>

                <div className="mt-2 px-2">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors py-2"
                    >
                        {showAdvanced ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
                        Erweiterte Einstellungen & Details
                    </button>
                    {showAdvanced && (
                        <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in slide-in-from-top-2 fade-in">
                            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center"><Settings size={14} className="mr-2" /> Berechnungsgrundlage</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Fahrstunden</span>
                                    <p className="text-lg font-bold text-gray-900">{experienceLevels[selectedLevel].drivingLessons} <span className="text-sm font-normal text-gray-500">Stunden</span></p>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Theorie</span>
                                    <p className="text-lg font-bold text-gray-900">{experienceLevels[selectedLevel].theoryExams} <span className="text-sm font-normal text-gray-500">Prüfung(en)</span></p>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Praxis</span>
                                    <p className="text-lg font-bold text-gray-900">{experienceLevels[selectedLevel].practicalExams} <span className="text-sm font-normal text-gray-500">Prüfung(en)</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- NEUES SORTIER- & FILTERSYSTEM --- */}
            {schools.length > 0 && (
                <div className="mt-10 mb-6">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        
                        {/* TABS */}
                        <div className="flex border-b border-gray-200">
                            <button 
                                onClick={() => setSortMode('price')}
                                className={`flex-1 py-4 text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors ${
                                    sortMode === 'price' 
                                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                <Euro size={18} /> Nach Preis (Günstigste)
                            </button>
                            <button 
                                onClick={() => setSortMode('smart')}
                                className={`flex-1 py-4 text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors ${
                                    sortMode === 'smart' 
                                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                <Wand2 size={18} /> Smart Match (Empfehlung)
                            </button>
                        </div>

                        {/* SMART MATCH FILTER CONTENT */}
                        {sortMode === 'smart' && (
                            <div className="p-6 bg-indigo-50/50 animate-in fade-in slide-in-from-top-1">
                                <p className="text-sm text-indigo-800 mb-4 font-medium">
                                    Passe die Suche an deine Wünsche an. Wir sortieren die Schulen, die am besten zu dir passen, ganz nach oben.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Sprache</label>
                                        <select 
                                            className="w-full p-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm outline-none"
                                            value={preferences.targetLanguage}
                                            onChange={(e) => setPreferences({...preferences, targetLanguage: e.target.value})}
                                        >
                                            {SAFE_LANGUAGES.map(lang => (
                                                <option key={lang} value={lang} className="text-gray-900">{lang}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Wichtige Extras (Mehrfachwahl)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {AVAILABLE_TAGS.slice(0, 8).map(tag => (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => toggleTag(tag.id)}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                                                        preferences.priorityTags.includes(tag.id)
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-700'
                                                    }`}
                                                >
                                                    {tag.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* RESULTS */}
            {searched && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <SchoolList 
                        schools={sortedSchools} 
                        selectedLevel={selectedLevel} 
                        activePreferences={sortMode === 'smart' ? preferences : undefined}
                    />
                </div>
            )}
        </div>
    );
}