export const AUTH_ROUTES = ["/auth/login"] as const;

export const PUBLIC_ROUTES = [
  "/auth/login",
  "/api/auth",
  "/api/public",
  "/auth/error",
] as const;

export const DEFAULT_AUTH_REDIRECT = "/";

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export function getSafeCallbackUrl(value?: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }
  return value;
}
