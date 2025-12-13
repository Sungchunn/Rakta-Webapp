import { getToken } from './auth';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Function to sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function apiRequest(endpoint: string, method: string = 'GET', body?: unknown, token?: string, retryCount = 0): Promise<any> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Use provided token or get from cookies/localStorage
    const authToken = token ?? getToken();
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            // Check for 500 - Server Error (Retry Candidates)
            if (response.status >= 500) {
                if (retryCount < MAX_RETRIES && method === 'GET') {
                    // Only retry idempotent GET requests automatically
                    console.warn(`Request failed (${response.status}). Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                    await sleep(RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff: 1s, 2s, 4s
                    return apiRequest(endpoint, method, body, token, retryCount + 1);
                } else {
                    // Retries exhausted or non-safe method
                    const message = "Server is processing intensely. Please try again in a moment.";
                    toast.error(message);
                    throw new Error(message);
                }
            }

            // Handle specific HTTP status codes
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
                throw new Error('Session expired. Please log in again.');
            }
            if (response.status === 403) {
                throw new Error('Access denied.');
            }

            // Generic error parsing
            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData.message || `Request failed (${response.status})`;

            // Only toast if it's NOT a 404 (404s are often handled by UI)
            if (response.status !== 404) {
                toast.error(errMsg);
            }

            throw new Error(errMsg);
        }

        // Handle empty responses gracefully
        const text = await response.text();
        if (!text) {
            return null;
        }
        return JSON.parse(text);

    } catch (error: any) {
        // Network errors (fetch failed entirely)
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            if (retryCount < MAX_RETRIES) {
                console.warn(`Network error. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                await sleep(RETRY_DELAY);
                return apiRequest(endpoint, method, body, token, retryCount + 1);
            }
            const msg = "Could not connect to server. Please check your internet.";
            toast.error(msg);
            throw new Error(msg);
        }
        throw error;
    }
}

