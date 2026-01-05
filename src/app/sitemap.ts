import { MetadataRoute } from 'next';
// Hinweis: Du musst sicherstellen, dass 'getAllSchools' in deinen Actions existiert
// und eine Liste aller Fahrschulen (mindestens die IDs) zurückgibt.
import { getAllSchools } from "@/app/actions/schoolActions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Passe dies an deine echte Domain an oder nutze eine Umgebungsvariable
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://deine-domain.de';

    // 1. Statische Routen (Startseite, Suche, etc.)
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // Beispiel: Suchseite
        // {
        //     url: `${baseUrl}/search`,
        //     lastModified: new Date(),
        //     changeFrequency: 'daily',
        //     priority: 0.9,
        // },
    ];

    // 2. Dynamische Routen (Fahrschul-Profile)
    let schoolRoutes: MetadataRoute.Sitemap = [];

    try {
        const schools = await getAllSchools();
        
        if (Array.isArray(schools)) {
            schoolRoutes = schools.map((school: { id: string }) => ({
                url: `${baseUrl}/school/${school.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error("Sitemap Error: Konnte Schulen nicht laden", error);
    }

    return [...staticRoutes, ...schoolRoutes];
}
