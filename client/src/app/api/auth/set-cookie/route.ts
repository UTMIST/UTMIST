import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { event, session } = await req.json();
    
    if (!session) {
      return NextResponse.json({ error: 'No session provided' }, { status: 400 });
    }

    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    if (event === 'SIGNED_IN') {
      await supabase.auth.setSession(session);
      console.log('Session cookies set successfully');
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error setting session cookies:', error);
    return NextResponse.json({ error: 'Failed to set session' }, { status: 500 });
  }
} 