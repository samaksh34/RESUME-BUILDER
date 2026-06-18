import axios from 'axios';

// Environment-aware API URL detection
const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
            return 'http://localhost:5000/api';
        }
    }
    return 'https://resume-builder-backend-six-lac.vercel.app/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🚀 API Base URL:', API_BASE_URL);


// Create axios instance with defaults
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies (refresh token)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 with TOKEN_EXPIRED and we haven't retried yet
        if (
            error.response?.status === 401 &&
            error.response?.data?.code === 'TOKEN_EXPIRED' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the access token
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.data.accessToken;
                localStorage.setItem('accessToken', newToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed — force logout
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ── Auth API calls ──────────────────────────────────────────────────

// ── Resume API calls ────────────────────────────────────────────────
export const resumeAPI = {
    getAll: () => api.get('/resumes'),
    getById: (id) => api.get(`/resumes/${id}`),
    create: (data) => api.post('/resumes', { data }),
    update: (id, data, title) => api.put(`/resumes/${id}`, { data, title }),
    delete: (id) => api.delete(`/resumes/${id}`),
    exportPDF: (html) => api.post('/resumes/export', { html }, { responseType: 'blob' }),
};

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    verifyOTP: (data) => api.post('/auth/verify-otp', data),
    login: (data) => api.post('/auth/login', data),
    refresh: () => api.post('/auth/refresh'),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    resendOTP: (data) => api.post('/auth/resend-otp', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
};

export const aiAPI = {

    analyze: (resumeData, jobDescription) => api.post('/ai/analyze', { resumeData, jobDescription }),
    optimizeBullet: (bulletPoint, jobDescription) => api.post('/ai/optimize-bullet', { bulletPoint, jobDescription }),
    generateCoverLetterStream: async (resumeData, jobDescription, onChunk, onError, onDone) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/ai/generate-cover-letter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ resumeData, jobDescription }),
            });

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.message || `HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep trailing partial line in the buffer

                for (const line of lines) {
                    const cleaned = line.trim();
                    if (!cleaned) continue;
                    
                    if (cleaned.startsWith('data: ')) {
                        const dataStr = cleaned.slice(6);
                        if (dataStr === '[DONE]') {
                            onDone();
                            return;
                        }
                        
                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.error) {
                                onError(new Error(parsed.error));
                                return;
                            }
                            if (parsed.chunk) {
                                onChunk(parsed.chunk);
                            }
                        } catch (e) {
                            console.error('Failed to parse SSE line:', cleaned, e);
                        }
                    }
                }
            }
            onDone();
        } catch (error) {
            onError(error);
        }
    }
};

export default api;

