/**
 * Auth utilities for cookie-based JWT authentication.
 * Used by both client components and API routes.
 */

const TOKEN_COOKIE_NAME = 'token';
const USER_COOKIE_NAME = 'user';

// Cookie options
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day in seconds

/**
 * User type matching backend AuthResponse
 */
export interface AuthUser {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
}

/**
 * Set authentication cookies after login/signup.
 * Called from client-side after successful API response.
 */
export function setAuthCookies(token: string, user: AuthUser) {
    // Set token cookie (accessible to middleware)
    document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    // Set user cookie (for UI hydration)
    document.cookie = `${USER_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    // Also keep in localStorage for backward compatibility
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear authentication cookies and storage on logout.
 */
export function clearAuthCookies() {
    // Clear cookies by setting expired date
    document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
    document.cookie = `${USER_COOKIE_NAME}=; path=/; max-age=0`;

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

/**
 * Get token from cookie (client-side).
 */
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // First check localStorage (backward compatibility)
    const localToken = localStorage.getItem('token');
    if (localToken) return localToken;

    // Then check cookie
    const match = document.cookie.match(new RegExp(`(^| )${TOKEN_COOKIE_NAME}=([^;]+)`));
    return match ? match[2] : null;
}

/**
 * Get user from cookie (client-side).
 */
export function getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    // First check localStorage
    const localUser = localStorage.getItem('user');
    if (localUser) {
        try {
            return JSON.parse(localUser);
        } catch {
            return null;
        }
    }

    // Then check cookie
    const match = document.cookie.match(new RegExp(`(^| )${USER_COOKIE_NAME}=([^;]+)`));
    if (match) {
        try {
            return JSON.parse(decodeURIComponent(match[2]));
        } catch {
            return null;
        }
    }

    return null;
}

/**
 * Get the full name of the current user.
 */
export function getUserFullName(): string | null {
    const user = getUser();
    if (!user) return null;
    return `${user.firstName} ${user.lastName}`;
}

/**
 * Check if user is authenticated (client-side).
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

