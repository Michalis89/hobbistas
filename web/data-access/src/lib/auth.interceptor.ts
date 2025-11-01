import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor
 *
 * Αυτόματη προσθήκη του JWT token σε κάθε HTTP request
 * που πηγαίνει στο backend API.
 *
 * Χρησιμοποιεί το functional interceptor API του Angular 17+
 *
 * ΣΗΜΑΝΤΙΚΟ: Διαβάζει το token απευθείας από το localStorage
 * για να αποφύγουμε circular dependency με το AuthService.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Διάβασε το token απευθείας από το localStorage
  // Αποφεύγουμε να inject-άρουμε το AuthService για να μην έχουμε circular dependency
  const TOKEN_KEY = 'hobbistas_access_token';
  const token = localStorage.getItem(TOKEN_KEY);

  // Αν υπάρχει token και το request πηγαίνει στο API μας
  if (token && req.url.includes('localhost:3333')) {
    // Clone το request και πρόσθεσε το Authorization header
    // ΣΗΜΑΝΤΙΚΟ: Για FormData requests, ΜΗΝ αλλάζεις το Content-Type
    // Ο browser το ορίζει αυτόματα με το σωστό boundary
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`🔐 Adding auth token to request: ${req.method} ${req.url}`, {
      hasBody: !!req.body,
      bodyType: req.body?.constructor?.name,
      headers: clonedRequest.headers.keys(),
    });

    return next(clonedRequest);
  }

  // Αλλιώς στείλε το request όπως είναι
  return next(req);
};
