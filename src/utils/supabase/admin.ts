// src/utils/supabase/admin.ts

const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_SERVICE_ROLE) {
    throw new Error('Environment variable SUPABASE_SERVICE_ROLE is missing.');
}

import { createClient } from '@supabase/supabase-js';

export const createAdminClient = () => {
    return createClient('https://your-supabase-url.supabase.co', SUPABASE_SERVICE_ROLE);
};
