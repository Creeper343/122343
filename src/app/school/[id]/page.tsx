// src/app/school/[id]/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SchoolProfileDisplay from "@/components/school/SchoolProfileDisplay";
import { getSchoolById } from "@/app/actions/schoolActions";
import { notFound } from "next/navigation";
import { Metadata } from "next"; // Wichtig für SEO

// Interface für die Props
interface SchoolProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

// 1. SEO: Metadaten dynamisch generieren (Titel & Beschreibung für Google)
export async function generateMetadata({ params }: SchoolProfilePageProps): Promise<Metadata> {
    const { id } = await params;
    
    // Wir holen kurz die Schuldaten für den Titel
    // Hinweis: Next.js dedupliziert gleiche Requests automatisch, also keine Sorge wegen Performance
    const school = await getSchoolById(id);

    if (!school) {
        return {
            title: "Fahrschule nicht gefunden",
        };
    }

    return {
        title: `Fahrschule ${school.name} in ${school.city} - Preise & Infos`,
        description: `Aktuelle Preise und Infos zur Fahrschule ${school.name} in ${school.city}. Grundgebühr: ${school.grundgebuehr}€, Fahrstunde: ${school.driving_price}€. Jetzt vergleichen!`,
        openGraph: {
            title: `${school.name} - Fahrschulfinder`,
            description: `Preise vergleichen für ${school.name} in ${school.city}.`,
            // images: ['/opengraph-image.png'], // Optional, falls du spezifische Bilder hast
        }
    };
}

// 2. Die eigentliche Page-Komponente
export default async function SchoolProfilePage({ params }: SchoolProfilePageProps) {
    const { id } = await params; 
    const schoolId = id;

    // UUID Validierung
    const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;

    if (!schoolId || !uuidRegex.test(schoolId)) {
        console.error("Invalid school ID format received:", schoolId);
        notFound();
    }
    
    const school = await getSchoolById(schoolId);

    if (!school) {
        notFound();
    }

    // 3. SEO: JSON-LD (Strukturierte Daten für "Local Business" bei Google Maps/Search)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DrivingSchool', // Spezifischer Typ für Fahrschulen
        name: school.name,
        address: {
            '@type': 'PostalAddress',
            streetAddress: school.address,
            addressLocality: school.city,
            postalCode: school.PLZ,
            addressCountry: 'DE',
        },
        priceRange: `${school.driving_price}€`, // Google mag Preisindikationen
        telephone: school.phone_number,
        url: `https://deine-domain.de/school/${school.id}`, // HIER DEINE ECHTE DOMAIN EINTRAGEN!
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Das Script fügt die strukturierten Daten unsichtbar in den Head ein */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header />
            <main className="flex-grow w-full flex justify-center items-start py-12 px-4">
                <SchoolProfileDisplay school={school} />
            </main>
            <Footer />
        </div>
    );
}