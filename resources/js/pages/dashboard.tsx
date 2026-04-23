import { Head } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useDeferredValue, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import ConverterPanel from '@/components/currency/converter-panel';
import FavoritesPanel from '@/components/currency/favorites-panel';
import GlobalHeatmap from '@/components/currency/global-heatmap';
import ProviderComparison from '@/components/currency/provider-comparison';
import { Badge } from '@/components/ui/badge';
import {
    TypographyH1,
    TypographyLead,
    TypographyP,
} from '@/components/ui/typography';
import { useCurrencyRateQuery } from '@/hooks/use-currency-rate-query';
import api from '@/lib/axios';
import { buildRecentConversionId, getProviderQuotes } from '@/lib/currency';
import { dashboard } from '@/routes';
import { useCurrencyStore } from '@/stores/use-currency-store';
import type {
    CurrencyPageProps,
    CurrencyPreferences,
    FavoriteCurrencyPair,
} from '@/types';

export default function Dashboard({
    currencies,
    favorites,
    preferences,
}: CurrencyPageProps) {
    const {
        amountInput,
        baseCurrency,
        favorites: storedFavorites,
        quoteCurrency,
        recentConversions,
        selectedProviderId,
        hydrate,
        removeFavorite,
        setAmountInput,
        setBaseCurrency,
        setFavorites,
        setQuoteCurrency,
        setRecentConversions,
        setSelectedProviderId,
        swapCurrencies,
    } = useCurrencyStore();

    useEffect(() => {
        hydrate(preferences, favorites);
    }, [favorites, hydrate, preferences]);

    const deferredAmountInput = useDeferredValue(amountInput);
    const parsedAmount = Number(deferredAmountInput) || 0;
    const rateQuery = useCurrencyRateQuery(
        parsedAmount,
        baseCurrency,
        quoteCurrency,
    );

    const providerQuotes = useMemo(
        () => getProviderQuotes(parsedAmount, rateQuery.data),
        [parsedAmount, rateQuery.data],
    );

    const isFavorite = storedFavorites.some(
        (favorite) =>
            favorite.baseCurrency === baseCurrency &&
            favorite.quoteCurrency === quoteCurrency,
    );

    const persistPreferences = useCallback(
        async (payload: Partial<CurrencyPreferences>) => {
            const response = await api.put<{
                preferences: CurrencyPreferences;
            }>('/dashboard/preferences', payload);

            setRecentConversions(response.data.preferences.recentConversions);
        },
        [setRecentConversions],
    );

    useEffect(() => {
        if (parsedAmount <= 0) {
            return;
        }

        const timeout = window.setTimeout(() => {
            void persistPreferences({
                amount: parsedAmount,
                baseCurrency,
                quoteCurrency,
            }).catch(() => {
                toast.error('Preferences could not be synced right now.');
            });
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [baseCurrency, parsedAmount, persistPreferences, quoteCurrency]);

    const saveFavoriteMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post<{ favorite: FavoriteCurrencyPair }>(
                '/dashboard/favorites',
                {
                    baseCurrency,
                    quoteCurrency,
                },
            );

            return response.data.favorite;
        },
        onSuccess: (favorite) => {
            setFavorites(
                storedFavorites.some(
                    (item) =>
                        item.baseCurrency === favorite.baseCurrency &&
                        item.quoteCurrency === favorite.quoteCurrency,
                )
                    ? storedFavorites
                    : [...storedFavorites, favorite],
            );

            toast.success(
                `${favorite.baseCurrency}/${favorite.quoteCurrency} saved`,
            );
        },
        onError: () => {
            toast.error('Could not save that favorite pair right now.');
        },
    });

    const deleteFavoriteMutation = useMutation({
        mutationFn: async (favorite: FavoriteCurrencyPair) => {
            await api.delete(`/dashboard/favorites/${favorite.id}`);

            return favorite;
        },
        onSuccess: (favorite) => {
            removeFavorite(favorite.id);

            toast.success(
                `${favorite.baseCurrency}/${favorite.quoteCurrency} removed`,
            );
        },
        onError: () => {
            toast.error('Could not remove that favorite pair right now.');
        },
    });

    const handleSaveSnapshot = async () => {
        if (!rateQuery.data) {
            toast.error('A fresh rate is needed before saving a snapshot.');

            return;
        }

        const selectedProvider =
            providerQuotes.find(
                (provider) => provider.id === selectedProviderId,
            ) ?? providerQuotes[0];

        if (!selectedProvider) {
            toast.error('Provider comparison is not ready yet.');

            return;
        }

        const updatedRecentConversions = [
            {
                id: buildRecentConversionId(),
                amount: rateQuery.data.amount,
                baseCurrency,
                convertedAmount: selectedProvider.receivedAmount,
                createdAt: new Date().toISOString(),
                provider: selectedProvider.name,
                quoteCurrency,
                rate: selectedProvider.effectiveRate,
            },
            ...recentConversions,
        ].slice(0, 6);

        setRecentConversions(updatedRecentConversions);

        await persistPreferences({
            amount: parsedAmount,
            baseCurrency,
            quoteCurrency,
            recentConversions: updatedRecentConversions,
        });

        toast.success('Conversion snapshot saved to your secure preferences.');
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="relative flex h-full flex-1 flex-col gap-6 overflow-x-hidden p-4 md:p-6">
                <div className="absolute inset-x-4 top-4 -z-10 h-48 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(129,252,156,0.22),_transparent_62%)] blur-2xl md:inset-x-6 md:top-6" />

                <section className="space-y-3">
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                        Money flow control
                    </Badge>
                    <TypographyH1 className="max-w-3xl text-3xl md:text-4xl">
                        Secure currency conversion with favorites, fee-aware
                        comparisons, and account-level tracking.
                    </TypographyH1>
                    <TypographyLead className="max-w-2xl text-sm font-normal italic md:text-base">
                        Move with patience. The strongest hand is rarely the
                        fastest; it is the one that knows where value is quietly
                        gathering.
                    </TypographyLead>
                    <TypographyP className="text-sm text-muted-foreground italic">
                        -Florito Doyohim
                    </TypographyP>
                </section>

                <GlobalHeatmap />

                <ConverterPanel
                    amountInput={amountInput}
                    baseCurrency={baseCurrency}
                    currencies={currencies}
                    isFavorite={isFavorite}
                    isRateLoading={rateQuery.isFetching}
                    isRateError={rateQuery.isError}
                    isSavingFavorite={saveFavoriteMutation.isPending}
                    onAddFavorite={() => saveFavoriteMutation.mutate()}
                    onAmountChange={setAmountInput}
                    onBaseCurrencyChange={setBaseCurrency}
                    onQuoteCurrencyChange={setQuoteCurrency}
                    onSaveSnapshot={() => void handleSaveSnapshot()}
                    onSwap={swapCurrencies}
                    providerQuotes={providerQuotes}
                    quoteCurrency={quoteCurrency}
                    rateResponse={rateQuery.data}
                    selectedProviderId={selectedProviderId}
                    topFavorite={storedFavorites[0]}
                />

                <ProviderComparison
                    baseCurrency={baseCurrency}
                    onSelectProvider={setSelectedProviderId}
                    providers={providerQuotes}
                    quoteCurrency={quoteCurrency}
                    selectedProviderId={selectedProviderId}
                />

                <FavoritesPanel
                    amount={
                        parsedAmount ||
                        Number(amountInput) ||
                        preferences.amount
                    }
                    favorites={storedFavorites}
                    onApplyFavorite={(favorite) => {
                        setBaseCurrency(favorite.baseCurrency);
                        setQuoteCurrency(favorite.quoteCurrency);
                    }}
                    onDeleteFavorite={(favorite) =>
                        deleteFavoriteMutation.mutate(favorite)
                    }
                    recentConversions={recentConversions}
                />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
