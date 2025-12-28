export const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = {
    /**
     * Performs a GET request to the specified endpoint.
     * @param endpoint - The endpoint to fetch (e.g., '/users').
     */
    async get<T>(endpoint: string): Promise<T> {
        const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        console.log(`[API REQUEST] GET ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API GET request failed for ${url}: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[API RESPONSE] GET ${url}`, data);
        return data;
    },

    /**
     * Performs a POST request to the specified endpoint with the provided data.
     * @param endpoint - The endpoint to post to (e.g., '/users').
     * @param data - The payload to send.
     */
    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        console.log(`[API REQUEST] POST ${url}`, JSON.stringify(data, null, 2));

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

        const result = await response.json();
        console.log(`[API RESPONSE] POST ${url}`, result);
        return result;
    },

    /**
     * Performs a DELETE request to the specified endpoint.
     * @param endpoint - The endpoint to delete (e.g., '/users/1').
     */
    async delete(endpoint: string): Promise<void> {
        const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        console.log(`[API REQUEST] DELETE ${url}`);

        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`API DELETE request failed for ${url}: ${response.status} ${response.statusText}`);
        }
        console.log(`[API RESPONSE] DELETE ${url} - Success`);
    }
};
