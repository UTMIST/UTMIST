import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/profile'

  if (code) {
    const cookieStore = await cookies()
    
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
    )
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(new URL('/auth?error=confirmation_failed', requestUrl.origin))
      }
      
      if (data.session) {
        // Check if this is a password reset flow
        if (type === 'recovery' || requestUrl.searchParams.has('recovery')) {
          console.log('Password reset flow detected, redirecting to reset form')
          return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
        }
        
        console.log('Email confirmation successful, session established')
        
        // Session is automatically set via cookies - no need for database profile creation
        // All user data is stored in Supabase Auth metadata
        
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }
    } catch (error) {
      console.error('Error during email confirmation:', error)
      return NextResponse.redirect(new URL('/auth?error=confirmation_failed', requestUrl.origin))
    }
  }

  // If no code or confirmation failed
  return NextResponse.redirect(new URL('/auth?error=no_code', requestUrl.origin))
} 