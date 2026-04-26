const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getToken = () => localStorage.getItem("token");

export async function apiFetch(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        Accept: "application/json",
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });


    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error ${response.status}`);
        }

        return data;
    }

    const text = await response.text();

    if (!response.ok) {
        throw new Error(
            `Server returned non-JSON response (status ${response.status}). ${text.slice(0, 200)}`
        );
    }

    throw new Error("Server returned unexpected non-JSON response.");
}