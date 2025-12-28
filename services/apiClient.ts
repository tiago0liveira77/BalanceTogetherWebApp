export const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = {
    /**
     * Performs a GET request to the specified endpoint.
     * @param endpoint - The endpoint to fetch (e.g., '/users').
     */
    async get<T>(endpoint: string): Promise<T> {
        const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API GET request failed for ${url}: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Performs a POST request to the specified endpoint with the provided data.
     * @param endpoint - The endpoint to post to (e.g., '/users').
     * @param data - The payload to send.
     */
    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API POST request failed for ${url}: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }
};
