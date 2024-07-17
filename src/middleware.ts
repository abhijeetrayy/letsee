import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from './utils/supabase/server';

export async function middleware(request: NextRequest) {

  
  const url = request.nextUrl.clone();
  const supabase = createClient();
  
  const { error } = await supabase.auth.getUser();
  
  
  if (url.pathname === '/') {
    
    url.pathname = '/app';
    return NextResponse.redirect(url);
  }
  if ((url.pathname === '/login' || url.pathname === "/error" )&& !error ) {
    
    url.pathname = '/app';
    return NextResponse.redirect(url);
  }
  
  
  return await updateSession(request);
  
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
