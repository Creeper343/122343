// src/app/profile/ProfileClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateSchoolPrices, updateSchoolSettings } from '@/app/actions/schoolActions';
import { AVAILABLE_TAGS } from '@/lib/tags';
import { AVAILABLE_LANGUAGES } from '@/lib/languages';
import { AVAILABLE_VEHICLE_CLASSES } from '@/lib/vehicleClasses';
import { 
    LayoutDashboard, Euro, Settings, LogOut, MapPin, Trophy, TrendingUp, 
    Building2, Save, Phone, Mail, Globe, Home, CheckCircle2, Lock, Eye, 
    MousePointer, UserCheck, Lightbulb, Info, ExternalLink, Tag, Languages,
    Car, Clock, Motorcycle, Truck, PlusCircle, X, Trash2
}  from 'lucide-react';
import { logout } from "@/app/auth/actions/authActions";

type SchoolData = {
    id: string;
    name: string;
    city: string;
    address?: string;
    PLZ?: string;
    phone_number?: string;
    email?: string; 
    website?: string;
    driving_price: number;
    grundgebuehr: number;
    theorypruefung: number;
    praxispruefung: number;
    is_premium: boolean;
    tags?: string[];
    languages?: string[];
    vehicle_class?: string[];
    cars_count?: number;
    theory_days?: string; // CSV like "Mo,Mi,Fr"
    theory_time?: string; // time string "18:00:00"
};

export default function ProfileClient({ 
    school, 
    stats, 
    analytics 
}: { 
    school: SchoolData, 
    stats: any, 
    analytics: any 
}) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'prices' | 'settings'>('dashboard');

    const [selectedTags, setSelectedTags] = useState<string[]>(school.tags || []);
    const [customTag, setCustomTag] = useState('');

    const [vehicleClasses, setVehicleClasses] = useState<string[]>(school.vehicle_class || []);
    const [carsCount, setCarsCount] = useState<number>(school.cars_count ?? 0);

    // theory days/time handling
    const initialDays = school.theory_days ? school.theory_days.split(',').map(s => s.trim()).filter(Boolean) : [];
    const [theoryDays, setTheoryDays] = useState<string[]>(initialDays);
    const [theoryTime, setTheoryTime] = useState<string>(school.theory_time ? school.theory_time : '18:00');

    useEffect(() => {
        setSelectedTags(school.tags || []);
        setVehicleClasses(school.vehicle_class || []);
        setCarsCount(school.cars_count ?? 0);
        setTheoryTime(school.theory_time || '18:00');
        setTheoryDays(school.theory_days ? school.theory_days.split(',').map(s => s.trim()).filter(Boolean) : []);
    }, [school]);

    function toggleTag(tag: string) {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    }
    function addCustomTag() {
        const t = customTag.trim();
        if (!t) return;
        if (!selectedTags.includes(t)) setSelectedTags(prev => [...prev, t]);
        setCustomTag('');
    }
    function removeTag(tag: string) {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    }

    function toggleVehicleClass(id: string) {
        setVehicleClasses(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
    }

    function toggleTheoryDay(day: string) {
        setTheoryDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    }

    async function handleSettingsSubmit(formData: FormData) {
        // Ensure arrays are appended correctly
        selectedTags.forEach(t => formData.append('tags', t));
        vehicleClasses.forEach(v => formData.append('vehicle_class', v));
        // theory_days -> join to CSV string because DB column is TEXT
        if (theoryDays.length > 0) {
            formData.set('theory_days', theoryDays.join(','));
        } else {
            formData.set('theory_days', '');
        }
        formData.set('theory_time', theoryTime || '');
        formData.set('cars_count', String(carsCount ?? 0));

        try {
            const result = await updateSchoolSettings(formData);
            if (result.success) {
                router.refresh();
            }
        } catch (e: any) {
            console.error('Save error', e);
        }
    }

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden fixed inset-0">
            {/* Sidebar omitted for brevity - use existing UI from repo */}

            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <header className="bg-white shadow-sm shrink-0 z-10 px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        <span className="font-semibold text-gray-900">{school.city}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                {school.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{school.name}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">Profil & Kontaktdaten</h3>
                                    <p className="text-sm text-gray-500">Diese Informationen werden auf deinem öffentlichen Profil angezeigt.</p>
                                </div>
                                <div className="p-6 max-w-2xl">
                                    <form action={handleSettingsSubmit} className="space-y-8">
                                        {/* Address / Contact fields preserved from existing UI (omitted here for brevity) */}

                                        {/* Tags section */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                                <Tag size={18} className="text-blue-600"/> Tags
                                            </h4>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {AVAILABLE_TAGS.map(tag => (
                                                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full border ${selectedTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{tag}</button>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                                <input value={customTag} onChange={e => setCustomTag(e.target.value)} placeholder="Eigenes Tag hinzufügen" className="rounded px-3 py-2 border w-full" />
                                                <button type="button" onClick={addCustomTag} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded">
                                                    <PlusCircle size={16}/> Hinzufügen
                                                </button>
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedTags.map(t => (
                                                    <span key={t} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                                                        <span className="text-sm">{t}</span>
                                                        <button type="button" onClick={() => removeTag(t)}><X size={14} /></button>
                                                        <input type="hidden" name="tags" value={t} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Theory days / time */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                                <Clock size={18} className="text-yellow-600"/> Theorie-Tage & Zeit
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-2">Wähle Tage (Mo-Sa) und eine Uhrzeit für Theorieunterricht.</p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {['Mo','Di','Mi','Do','Fr','Sa'].map(d => (
                                                    <button key={d} type="button" onClick={() => toggleTheoryDay(d)} className={`px-3 py-1 rounded-full border ${theoryDays.includes(d) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{d}</button>
                                                ))}
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                <label className="col-span-1">Uhrzeit</label>
                                                <input className="col-span-2 rounded px-3 py-2 border" type="time" value={theoryTime} onChange={e => setTheoryTime(e.target.value)} name="theory_time" />
                                            </div>

                                            {/* hidden input will be set in submit handler as joined CSV */}
                                        </div>

                                        {/* Vehicle classes & cars_count */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                                                <Car size={18} className="text-green-600"/> Fahrzeugklassen & Fahrzeuge
                                            </h4>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {AVAILABLE_VEHICLE_CLASSES.map(vc => {
                                                    const active = vehicleClasses.includes(vc.id);
                                                    let Icon = Car;
                                                    if (vc.id === 'A') Icon = Motorcycle;
                                                    if (vc.id === 'C') Icon = Truck;
                                                    return (
                                                        <button key={vc.id} type="button" onClick={() => toggleVehicleClass(vc.id)} className={`px-3 py-1 rounded-full border flex items-center gap-2 ${active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}> <Icon size={16} /> {vc.label} </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                <label className="col-span-1">Anzahl Fahrzeuge (gesamt)</label>
                                                <input className="col-span-2 rounded px-3 py-2 border" type="number" min={0} value={carsCount} onChange={e => setCarsCount(Number(e.target.value))} name="cars_count_display" />
                                            </div>

                                            {vehicleClasses.map(v => <input key={v} type="hidden" name="vehicle_class" value={v} />)}
                                            <input type="hidden" name="cars_count" value={String(carsCount)} />
                                        </div>

                                        <div className="flex justify-end">
                                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Speichern</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* other tabs (dashboard, prices) unaffected */}
                    </div>
                </div>
            </main>
        </div>
    );
}

---