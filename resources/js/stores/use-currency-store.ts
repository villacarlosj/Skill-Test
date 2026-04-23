import { create } from 'zustand';
import type {
    CurrencyPreferences,
    FavoriteCurrencyPair,
    RecentConversion,
} from '@/types';

type CurrencyState = {
    amountInput: string;
    baseCurrency: string;
    favorites: FavoriteCurrencyPair[];
    quoteCurrency: string;
    recentConversions: RecentConversion[];
    selectedProviderId: string;
};

type CurrencyActions = {
    hydrate: (
        preferences: CurrencyPreferences,
        favorites: FavoriteCurrencyPair[],
    ) => void;
    removeFavorite: (favoriteId: number) => void;
    setAmountInput: (amountInput: string) => void;
    setBaseCurrency: (baseCurrency: string) => void;
    setFavorites: (favorites: FavoriteCurrencyPair[]) => void;
    setQuoteCurrency: (quoteCurrency: string) => void;
    setRecentConversions: (recentConversions: RecentConversion[]) => void;
    setSelectedProviderId: (selectedProviderId: string) => void;
    swapCurrencies: () => void;
};

export const useCurrencyStore = create<CurrencyState & CurrencyActions>(
    (set) => ({
        amountInput: '1000',
        baseCurrency: 'USD',
        favorites: [],
        quoteCurrency: 'PHP',
        recentConversions: [],
        selectedProviderId: 'wise',
        hydrate: (preferences, favorites) =>
            set({
                amountInput: String(preferences.amount),
                baseCurrency: preferences.baseCurrency,
                favorites,
                quoteCurrency: preferences.quoteCurrency,
                recentConversions: preferences.recentConversions,
            }),
        removeFavorite: (favoriteId) =>
            set((state) => ({
                favorites: state.favorites.filter(
                    (favorite) => favorite.id !== favoriteId,
                ),
            })),
        setAmountInput: (amountInput) => set({ amountInput }),
        setBaseCurrency: (baseCurrency) => set({ baseCurrency }),
        setFavorites: (favorites) => set({ favorites }),
        setQuoteCurrency: (quoteCurrency) => set({ quoteCurrency }),
        setRecentConversions: (recentConversions) => set({ recentConversions }),
        setSelectedProviderId: (selectedProviderId) =>
            set({ selectedProviderId }),
        swapCurrencies: () =>
            set((state) => ({
                baseCurrency: state.quoteCurrency,
                quoteCurrency: state.baseCurrency,
            })),
    }),
);
