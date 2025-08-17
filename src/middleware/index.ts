// // middleware.ts
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   // Define public routes
//   const publicRoutes = ['/login', '/register', '/verify-email'];
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

//   // Redirect logged-in users from auth pages to home
//   if (isLoggedIn && isPublicRoute) {
//     return NextResponse.redirect(new URL('/home', nextUrl.origin));
//   }

//   // Redirect unauthenticated users from protected routes to login
//   if (!isLoggedIn && !isPublicRoute) {
//     return NextResponse.redirect(new URL('/login', nextUrl.origin));
//   }

//   return NextResponse.next();
// });

// // Match all routes except static files and API routes
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

// function auth(arg0: (req: any) => NextResponse<unknown>) {
//     throw new Error('Function not implemented.');
// }
