// src/app/profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProfileClient from './ProfileClient';
import { redirect } from 'next/navigation';
import { getAnalyticsStats } from '@/app/actions/analytics';

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: school, error } = await supabase
        .from('driving_school')
        .select(`
            id,
            name,
            city,
            address,
            PLZ,
            phone_number,
            email,
            website,
            driving_price,
            grundgebuehr,
            praxispruefung,
            theorypruefung,
            is_premium,
            tags,
            languages,
            vehicle_class,
            cars_count,
            theory_days,
            theory_time
        `)
        .eq('admin_id', user.id)
        .single();

    if (error || !school) return <div className="p-8 text-center">Keine Daten gefunden.</div>;

    const analytics = await getAnalyticsStats(school.id);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
            <ProfileClient school={school} stats={null} analytics={analytics} />
        </div>
    );
}