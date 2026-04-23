import type { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { CurrencyRateResponse } from '@/types';

export function useCurrencyRateQuery(amount: number, from: string, to: string) {
    return useQuery({
        queryKey: ['currency-rate', amount, from, to],
        queryFn: async () => {
            const response = await api.get<CurrencyRateResponse>(
                '/api/currency/rates',
                {
                    params: {
                        amount,
                        from,
                        to,
                    },
                },
            );

            return response.data;
        },
        enabled: amount > 0 && from !== to,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            const status = (error as AxiosError)?.response?.status;
            if (status === 422 || status === 401 || status === 403) return false;
            return failureCount < 2;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    });
}

