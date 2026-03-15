import { createClient } from '@supabase/supabase-js';

// Warning: This uses the service role key and bypasses RLS.
// Use ONLY in secure server environments like API routes or Server Actions
// where you need to perform actions on behalf of the admin.
export const createAdminClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};
