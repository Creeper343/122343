// src/app/school/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import SchoolProfileDisplay from '@/components/school/SchoolProfileDisplay';
import { notFound } from "next/navigation";

// Wichtig: Die params müssen als Promise definiert sein in Next.js 15 (oder neueren 14 Versionen)
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SchoolDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fahrschule anhand der ID aus der URL laden
    const { data: school, error } = await supabase
        .from('driving_school')
        .select('*')
        .eq('id', id)
        // .eq('is_published', true) // Optional: Nur veröffentlichte anzeigen
        .single();

    if (error || !school) {
        return notFound();
    }

    // 2. Öffentliche Komponente rendern (NICHT ProfileClient)
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow py-8 px-4">
                <SchoolProfileDisplay school={school} />
            </main>
        </div>
    );
}