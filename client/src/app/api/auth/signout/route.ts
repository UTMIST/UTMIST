import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST() {
  try {
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
    
    // Sign out the user on the server side to clear cookies
    await supabase.auth.signOut();
    
    console.log('User signed out and cookies cleared');
    
    return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during sign out:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
} 