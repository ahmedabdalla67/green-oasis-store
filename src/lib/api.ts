
import { toast } from '@/hooks/use-toast';

// Dynamically determine the API URL based on the current hostname
const getBaseUrl = () => {
    const { hostname } = window.location;
    // If running solely on localhost or 127.0.0.1, use localhost:3000
    // If running on a network IP (e.g., 192.168.x.x), use that IP:3000
    return `http://${hostname}:3000/api`;
};

const API_URL = import.meta.env.VITE_API_URL || getBaseUrl();

interface RequestOptions extends RequestInit {
    token?: string;
}

export async function apiRequest(endpoint: string, options: RequestOptions = {}) {
    const { token, ...fetchOptions } = options;
    const headers = new Headers(fetchOptions.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    } else {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            headers.set('Authorization', `Bearer ${storedToken}`);
        }
    }

    // Set Content-Type to application/json by default if not sending FormData
    if (!(fetchOptions.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
        ...fetchOptions,
        headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
        }

        // Check if the response has content before parsing JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            return response.text();
        }

    } catch (error: any) {
        console.error('API Request Error:', error);
        toast({
            title: "Error",
            description: error.message || "Something went wrong",
            variant: "destructive"
        })
        throw error;
    }
}
