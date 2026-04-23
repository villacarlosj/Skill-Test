export type CurrencyOption = {
    name: string;
    symbol: string;
};

export type FavoriteCurrencyPair = {
    id: number;
    baseCurrency: string;
    quoteCurrency: string;
    nickname: string | null;
    savedRate: number | null;
    sortOrder: number;
};

export type RecentConversion = {
    id: string;
    baseCurrency: string;
    quoteCurrency: string;
    amount: number;
    convertedAmount: number;
    rate: number;
    provider: string;
    createdAt: string;
};

export type CurrencyPreferences = {
    amount: number;
    baseCurrency: string;
    quoteCurrency: string;
    recentConversions: RecentConversion[];
};

export type CurrencyRateResponse = {
    amount: number;
    baseCurrency: string;
    quoteCurrency: string;
    convertedAmount: number;
    rate: number;
    inverseRate: number;
    date: string;
};

export type CurrencyPageProps = {
    currencies: Record<string, CurrencyOption>;
    favorites: FavoriteCurrencyPair[];
    preferences: CurrencyPreferences;
};

export type FavoritesPageProps = {
    currencies: Record<string, CurrencyOption>;
    favorites: FavoriteCurrencyPair[];
};
