import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function apiRequest(endpoint: string, method: string = 'GET', body?: unknown, token?: string) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Use provided token or get from cookies/localStorage
    const authToken = token ?? getToken();
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
            // Clear potentially stale auth token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            throw new Error('Session expired. Please log in again.');
        }
        if (response.status === 403) {
            throw new Error('Access denied.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed (${response.status})`);
    }

    // Handle empty responses gracefully
    const text = await response.text();
    if (!text) {
        return null;
    }
    return JSON.parse(text);
}

