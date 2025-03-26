// src/services/apiClient.ts
// TODO: add env variable for this
const API_BASE_URL = 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
    data?: any;
}

async function apiClient<T>(
    endpoint: string,
    {
        data,
        method,
        headers: customHeaders,
        ...customConfig
    }: RequestOptions = {},
): Promise<T> {
    const config: RequestInit = {
        method: method || (data ? 'POST' : 'GET'),
        headers: {
            'Content-Type': data ? 'application/json' : '',
            ...customHeaders,
        },
        ...customConfig,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const fetch_endpoint = `${API_BASE_URL}${endpoint}`;
    console.log('fetch_endpoint:', fetch_endpoint);
	console.log("config", config);
    const response = await fetch(fetch_endpoint, config);

    if (!response.ok) {
        const errorData: any = await response
            .json()
            .catch(() => ({ message: response.statusText }));
        const error = new Error(
            `API Error: ${response.status} ${errorData.message || response.statusText}`,
        );
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
    }

    // No content to return, resolve with undefined
    if (response.status === 204) {
        return Promise.resolve(undefined as T);
    }

    const result: any = await response.json();

    return result;
}

export default apiClient;
