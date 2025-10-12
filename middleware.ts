import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
import { updateSession } from './lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  // Update Supabase session
  let response = await updateSession(request)
  
  // Check if user is accessing dashboard
  const pathname = request.nextUrl.pathname
  const isDashboardRoute = pathname.match(/^\/(en|tr)\/dashboard/)
  
  if (isDashboardRoute) {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If not authenticated, redirect to auth page
    if (!user) {
      const locale = pathname.match(/^\/(en|tr)/)?.[1] || 'en'
      const authUrl = new URL(`/${locale}/auth`, request.url)
      return NextResponse.redirect(authUrl)
    }
  }
  
  // Apply i18n middleware
  const intlResponse = intlMiddleware(request)
  
  // Merge headers and cookies
  if (response.headers.get('set-cookie')) {
    intlResponse.headers.set('set-cookie', response.headers.get('set-cookie')!)
  }
  
  // Copy cookies from response to intlResponse
  response.cookies.getAll().forEach(cookie => {
    intlResponse.cookies.set(cookie)
  })
  
  return intlResponse
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
