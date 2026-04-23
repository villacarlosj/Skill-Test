import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
        const status = error.response?.status;

        if (status === 401) {
            // Session expired — hard-redirect to login
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (status === 422) {
            // Laravel validation error — surface the first message
            const errors = error.response?.data?.errors;
            const firstMessage = errors
                ? Object.values(errors).flat()[0]
                : (error.response?.data?.message ?? 'Validation failed.');
            return Promise.reject(new Error(firstMessage));
        }

        if (status !== undefined && status >= 500) {
            toast.error('A server error occurred. Please try again shortly.');
        }

        return Promise.reject(error);
    },
);

export default api;
