"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Robust import with fallback
import * as DistrictLib from "../../lib/districts";

const getDistrictsForCity: (city?: string | null) => string[] =
  (DistrictLib && (DistrictLib as any).getDistrictsForCity)
    ? (DistrictLib as any).getDistrictsForCity
    : (city?: string | null) => {
        if (!city) return [];
        if (city === "Solingen") {
          return [
            "Solingen-Mitte",
            "Ohligs",
            "Wald",
            "Gräfrath",
            "Merscheid",
            "Höhscheid",
            "Aufderhöhe",
            "Weyer",
            "Burg",
            "Dorp",
            "Stöcken",
          ];
        }
        return [];
      };

const AVAILABLE_CITIES = ["Solingen"];

const THEORY_TIME_OPTIONS = [
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];
const THEORY_DAY_OPTIONS = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

type TheorySlot = { enabled: boolean; from: string; to: string };

export default function Register() {
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    schoolName: "",
    address: "",
    city: "", // selected city
    plz: "",
    district: "", // selected district (text)
    phoneNumber: "",
    schoolEmail: "",
    website: "",
    grundGebuehr: "",
    theoryPruefung: "",
    praxisPruefung: "",
    drivingPrice: "",
  });

  // initial schedule
  const initialSchedule: Record<string, TheorySlot> = THEORY_DAY_OPTIONS.reduce(
    (acc, day) => {
      acc[day] = { enabled: false, from: "18:00", to: "19:30" };
      return acc;
    },
    {} as Record<string, TheorySlot>
  );

  const [theorySchedule, setTheorySchedule] = useState<Record<string, TheorySlot>>(
    initialSchedule
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setPasswordsMatch(
      formData.password === formData.confirmPassword && formData.password !== ""
    );
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setFormData((prev) => ({ ...prev, city, district: "" }));
  };

  const districtsForCity = getDistrictsForCity(formData.city);

  const toggleDayEnabled = (day: string) => {
    setTheorySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const setDayFrom = (day: string, from: string) => {
    setTheorySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], from },
    }));
  };

  const setDayTo = (day: string, to: string) => {
    setTheorySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], to },
    }));
  };

  const validateSchedule = (): { ok: boolean; message?: string } => {
    for (const day of THEORY_DAY_OPTIONS) {
      const slot = theorySchedule[day];
      if (slot.enabled) {
        const [fh, fm] = slot.from.split(":").map(Number);
        const [th, tm] = slot.to.split(":").map(Number);
        const fMin = fh * 60 + fm;
        const tMin = th * 60 + tm;
        if (tMin <= fMin) {
          return {
            ok: false,
            message: `Für ${day} muss die Endzeit später sein als die Startzeit.`,
          };
        }
      }
    }
    return { ok: true };
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    if (!AVAILABLE_CITIES.includes(formData.city)) {
      setError("Bitte wählen Sie eine gültige Stadt.");
      return;
    }

    if (districtsForCity.length > 0 && !formData.district) {
      setError("Bitte wählen Sie einen Stadtteil aus.");
      return;
    }

    const vs = validateSchedule();
    if (!vs.ok) {
      setError(vs.message || "Ungültiger Theoriezeitplan.");
      return;
    }

    setError(null);
    setLoading(true);

    const scheduleArray: { day: string; from: string; to: string }[] = [];
    const daysArray: string[] = [];
    const timesSet = new Set<string>();

    for (const day of THEORY_DAY_OPTIONS) {
      const slot = theorySchedule[day];
      if (slot.enabled) {
        scheduleArray.push({ day, from: slot.from, to: slot.to });
        daysArray.push(day);
        timesSet.add(slot.from);
        timesSet.add(slot.to);
      }
    }

    const theoryTimes = Array.from(timesSet).sort();
    const theoryDays = daysArray;

    const metadata: any = {
      full_name: formData.fullName,
      school_name: formData.schoolName,
      address: formData.address,
      city: formData.city,
      plz: formData.plz,
      district: formData.district || null,
      phone_number: formData.phoneNumber,
      school_email: formData.schoolEmail,
      website: formData.website,
      driving_price: formData.drivingPrice ? Number(formData.drivingPrice) : null,
      grundgebuehr: formData.grundGebuehr ? Number(formData.grundGebuehr) : null,
      theory_price: formData.theoryPruefung ? Number(formData.theoryPruefung) : null,
      praxis_price: formData.praxisPruefung ? Number(formData.praxisPruefung) : null,
      theory_schedule: scheduleArray,
      theory_days: theoryDays,
      theory_times: theoryTimes,
    };

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: metadata,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      alert("Registrierung erfolgreich! Bitte überprüfe deine E-Mails.");
      router.push("/login");
    } catch (err: any) {
      setError(err?.message || "Unbekannter Fehler beim Registrieren.");
      setLoading(false);
    }
  };

  const isFormComplete =
    !!formData.email &&
    !!formData.password &&
    !!formData.fullName &&
    !!formData.schoolName &&
    !!formData.address &&
    !!formData.city &&
    !!formData.plz &&
    !!formData.drivingPrice &&
    !!formData.grundGebuehr &&
    (districtsForCity.length === 0 || !!formData.district);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-2" /> Zur Startseite
      </Link>

      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg mt-10 md:mt-0">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Fahrschule Registrieren</h2>
        <form onSubmit={handleSignUp} className="space-y-4">

          <h3 className="text-xl font-semibold border-b pb-2 text-gray-700">Admin Login Daten</h3>
          <input name="fullName" type="text" placeholder="Dein vollständiger Name" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />
          <input name="email" type="email" placeholder="Login E-Mail Adresse" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />

          <div className="relative">
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Passwort (min. 6 Zeichen)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>

          <div className="relative">
            <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Passwort bestätigen" onChange={handleChange} className={`w-full p-3 border rounded text-gray-900 ${(!passwordsMatch && formData.confirmPassword.length > 0) ? 'border-red-500 focus:ring-red-500' : ''}`} required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>

          <div className="h-6">
            {passwordsMatch ? (
              <div className="flex items-center text-green-600 text-sm"><CheckCircle2 className="h-4 w-4 mr-2" /> Passwörter stimmen überein!</div>
            ) : (formData.confirmPassword.length > 0 && (
              <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-2" /> Passwörter stimmen nicht überein</div>
            ))}
          </div>

          <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">Fahrschul-Details</h3>
          <input name="schoolName" type="text" placeholder="Name der Fahrschule" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />
          <input name="address" type="text" placeholder="Straße & Hausnummer" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Stadt</label>
              <select name="city" value={formData.city} onChange={handleCitySelect} className="w-full p-3 border rounded text-gray-900 mt-1" required>
                <option value="">Stadt wählen</option>
                {AVAILABLE_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">PLZ</label>
              <input name="plz" type="text" placeholder="PLZ" onChange={handleChange} className="w-full p-3 border rounded text-gray-900 mt-1" required />
            </div>
          </div>

          {districtsForCity.length > 0 && (
            <div className="mt-2">
              <label className="text-sm font-semibold text-gray-600">Stadtteil</label>
              <select name="district" value={formData.district} onChange={handleChange} className="w-full p-3 border rounded text-gray-900 mt-1" required>
                <option value="">Stadtteil wählen</option>
                {districtsForCity.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">Theorie Zeitplan</label>

            <div className="overflow-x-auto mt-2">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 text-black font-semibold">Tag</th>
                    <th className="p-2 text-black font-semibold">Aktiv</th>
                    <th className="p-2 text-black font-semibold">Von</th>
                    <th className="p-2 text-black font-semibold">Bis</th>
                  </tr>
                </thead>
                <tbody>
                  {THEORY_DAY_OPTIONS.map((day) => {
                    const slot = theorySchedule[day];
                    return (
                      <tr key={day} className="border-t">
                        <td className="p-2 align-middle text-black">{day}</td>
                        <td className="p-2 align-middle">
                          <input
                            type="checkbox"
                            checked={slot.enabled}
                            onChange={() => toggleDayEnabled(day)}
                            aria-label={`Aktiviere ${day}`}
                          />
                        </td>
                        <td className="p-2">
                          {/* select: transparent background, black text and black border */}
                          <select
                            value={slot.from}
                            onChange={(e) => setDayFrom(day, e.target.value)}
                            disabled={!slot.enabled}
                            className="p-2 border border-black rounded bg-transparent text-black focus:outline-none focus:ring-1 focus:ring-black"
                          >
                            {THEORY_TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2">
                          <select
                            value={slot.to}
                            onChange={(e) => setDayTo(day, e.target.value)}
                            disabled={!slot.enabled}
                            className="p-2 border border-black rounded bg-transparent text-black focus:outline-none focus:ring-1 focus:ring-black"
                          >
                            {THEORY_TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">Wähle für jeden aktiven Tag die Start‑ und Endzeit. Ende muss nach Start liegen.</p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-semibold text-gray-600">Öffentliche Kontaktdaten</label>
            <input name="phoneNumber" type="tel" placeholder="Telefonnummer (z.B. 0176...)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" />
            <input name="schoolEmail" type="email" placeholder="Kontakt E-Mail (öffentlich)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" />
            <input name="website" type="text" placeholder="Webseite (www.beispiel.de)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" />
          </div>

          <h3 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700">Preise (€)</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="grundGebuehr" type="number" placeholder="Grundgebühr" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
            <input name="theoryPruefung" type="number" placeholder="Theorieprüfung" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
            <input name="praxisPruefung" type="number" placeholder="Praxisprüfung" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
            <input name="drivingPrice" type="number" placeholder="Fahrstunde (45min)" onChange={handleChange} className="w-full p-3 border rounded text-gray-900" required min="0" />
          </div>

          {error && <p className="text-red-600 bg-red-100 p-3 rounded text-center text-sm">{error}</p>}

          <button type="submit" disabled={loading || !passwordsMatch || !isFormComplete} className="w-full p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 mt-6 disabled:cursor-not-allowed">
            {loading ? 'Erstelle Account...' : 'Kostenlos Registrieren'}
          </button>
        </form>
      </div>
    </div>
  );
}