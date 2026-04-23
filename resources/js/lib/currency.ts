import type { CurrencyRateResponse } from '@/types';

type ProviderDefinition = {
    eta: string;
    fixedFee: number;
    id: string;
    name: string;
    percentageFee: number;
    rateMargin: number;
};

export type ProviderQuote = ProviderDefinition & {
    effectiveRate: number;
    feeAmount: number;
    receivedAmount: number;
};

export const providerCatalog: ProviderDefinition[] = [
    {
        id: 'wise',
        name: 'Wise',
        fixedFee: 1.25,
        percentageFee: 0.0045,
        rateMargin: 0.002,
        eta: 'Same day',
    },
    {
        id: 'revolut',
        name: 'Revolut',
        fixedFee: 0.5,
        percentageFee: 0.002,
        rateMargin: 0.004,
        eta: 'Same day',
    },
    {
        id: 'western-union',
        name: 'Western Union',
        fixedFee: 1.99,
        percentageFee: 0.008,
        rateMargin: 0.017,
        eta: 'Within minutes',
    },
    {
        id: 'remitly',
        name: 'Remitly',
        fixedFee: 2.99,
        percentageFee: 0.006,
        rateMargin: 0.012,
        eta: 'Minutes to hours',
    },
    {
        id: 'paypal',
        name: 'PayPal',
        fixedFee: 3.49,
        percentageFee: 0.012,
        rateMargin: 0.028,
        eta: 'Within 24 hours',
    },
    {
        id: 'moneygram',
        name: 'MoneyGram',
        fixedFee: 1.99,
        percentageFee: 0.009,
        rateMargin: 0.015,
        eta: 'Within minutes',
    },
    {
        id: 'xe-money',
        name: 'XE Money',
        fixedFee: 0.0,
        percentageFee: 0.005,
        rateMargin: 0.005,
        eta: '1–2 business days',
    },
    {
        id: 'skrill',
        name: 'Skrill',
        fixedFee: 0.99,
        percentageFee: 0.013,
        rateMargin: 0.033,
        eta: 'Same day',
    },
    {
        id: 'ofx',
        name: 'OFX',
        fixedFee: 0.0,
        percentageFee: 0.007,
        rateMargin: 0.008,
        eta: '1–2 business days',
    },
    {
        id: 'xoom',
        name: 'Xoom',
        fixedFee: 2.99,
        percentageFee: 0.011,
        rateMargin: 0.022,
        eta: 'Within minutes',
    },
];

export const presetAmounts = [100, 500, 1000, 5000];

export function getProviderQuotes(
    amount: number,
    rateResponse?: CurrencyRateResponse,
): ProviderQuote[] {
    if (!rateResponse || amount <= 0) {
        return [];
    }

    return providerCatalog
        .map((provider) => {
            const transferableAmount = Math.max(amount - provider.fixedFee, 0);
            const percentageFeeAmount =
                transferableAmount * provider.percentageFee;
            const effectiveRate = rateResponse.rate * (1 - provider.rateMargin);
            const receivedAmount =
                Math.max(transferableAmount - percentageFeeAmount, 0) *
                effectiveRate;

            return {
                ...provider,
                effectiveRate,
                feeAmount: provider.fixedFee + percentageFeeAmount,
                receivedAmount,
            };
        })
        .sort((left, right) => right.receivedAmount - left.receivedAmount);
}

export function formatCurrency(value: number, currency: string): string {
    try {
        return new Intl.NumberFormat('en-US', {
            currency,
            maximumFractionDigits: 2,
            style: 'currency',
        }).format(value);
    } catch {
        return `${formatNumber(value)} ${currency}`;
    }
}

export function formatNumber(value: number, maximumFractionDigits = 4): string {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits,
    }).format(value);
}

export function formatRateDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    }).format(new Date(date));
}

export function formatRelativeTime(date: string): string {
    const diffInHours = Math.round(
        (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60),
    );

    return new Intl.RelativeTimeFormat('en', {
        numeric: 'auto',
    }).format(diffInHours, 'hour');
}

export function buildRecentConversionId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    return `conversion-${Date.now()}`;
}
