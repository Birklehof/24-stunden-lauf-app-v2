import { NextResponse } from 'next/server';

export function proxy(request: { url: string | URL | undefined; }) {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    const maintenanceUrl = new URL('/maintenance', request.url);
    return NextResponse.rewrite(maintenanceUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
