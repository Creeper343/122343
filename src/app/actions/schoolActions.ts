// src/app/actions/schoolActions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Aktualisiert die allgemeinen Einstellungen und Kontaktdaten der Fahrschule.
 */
export async function updateSchoolSettings(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Nicht autorisiert.");
    }

    // Basisfelder
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;
    const address = formData.get("address") as string;
    const plz = formData.get("plz") as string;
    const city = formData.get("city") as string;

    // Tags & Sprachen (arrays)
    const tags = formData.getAll("tags") as string[];
    const languages = formData.getAll("languages") as string[];

    // Vehicle classes (array text in DB)
    const vehicleClasses = formData.getAll("vehicle_class") as string[]; // matches DB column vehicle_class (text[])

    // cars_count (integer)
    const carsCountRaw = formData.get("cars_count") as string | null;
    const carsCount = carsCountRaw ? Number(carsCountRaw) : null;

    // theory_days is a TEXT column on your DB - we'll store as CSV string (e.g. "Mo,Mi,Fr")
    // the UI sends the joined string under 'theory_days'
    const theoryDays = formData.get("theory_days") as string | null;
    // theory_time is a TIME column (single value)
    const theoryTime = formData.get("theory_time") as string | null;

    // Build updates
    const updates: any = {
        phone_number: phoneNumber || undefined,
        email: email || undefined,
        address: address || undefined,
        PLZ: plz || undefined,
        city: city || undefined,
        tags: tags.length > 0 ? tags : undefined,
        languages: languages.length > 0 ? languages : undefined,
        vehicle_class: vehicleClasses.length > 0 ? vehicleClasses : undefined,
    };

    if (carsCount !== null) updates.cars_count = carsCount;
    if (theoryDays !== null && theoryDays !== "") updates.theory_days = theoryDays;
    if (theoryTime !== null && theoryTime !== "") updates.theory_time = theoryTime;

    const { error } = await supabase
        .from("driving_school")
        .update(updates)
        .eq("admin_id", user.id);

    if (error) {
        console.error("Supabase update error", error);
        throw new Error("Fehler beim Speichern der Einstellungen.");
    }

    revalidatePath('/profile');
    return { success: true, message: "Einstellungen erfolgreich gespeichert!" };
}

// rest of file stays unchanged (other actions like getSchoolsByCity etc.)

export async function getSchoolsByCity(city: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("driving_school")
        .select(
            `id, name, address, PLZ, city, driving_price, grundgebuehr, theorypruefung, praxispruefung, is_premium, languages, features, tags, vehicle_class, theory_days, theory_time, cars_count`
        )
        .eq("city", city)
        .eq("is_published", true);

    if (error) return [];
    return data || [];
}

export async function getSchoolById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('driving_school')
        .select('*')
        .eq('id', id)
        .eq("is_published", true)
        .single();

    if (error) return null;
    return data;
}

export async function updateSchoolPrices(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be logged in.");

    const drivingPrice = formData.get("drivingPrice");
    const grundgebuehr = formData.get("grundgebuehr");
    const theorypruefung = formData.get("theorypruefung");
    const praxispruefung = formData.get("praxispruefung");

    if (drivingPrice === null || grundgebuehr === null || theorypruefung === null || praxispruefung === null) {
        throw new Error("All price fields are required.");
    }

    const { error } = await supabase
        .from("driving_school")
        .update({
            driving_price: Number(drivingPrice),
            grundgebuehr: Number(grundgebuehr),
            theorypruefung: Number(theorypruefung),
            praxispruefung: Number(praxispruefung),
        })
        .eq("admin_id", user.id);

    if (error) throw new Error("Could not update the school prices.");
    revalidatePath("/profile");
    return { success: true, message: "Prices updated successfully!" };
}

// other helper functions omitted for brevity (leave existing implementations)