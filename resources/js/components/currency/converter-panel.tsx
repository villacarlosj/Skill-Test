import {
    ArrowDownUp,
    ArrowRight,
    BookmarkPlus,
    RefreshCcw,
    Star,
    Tag,
} from 'lucide-react';
import CurrencySelect from '@/components/currency/currency-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    formatCurrency,
    formatNumber,
    formatRateDate,
    formatRelativeTime,
    presetAmounts,
} from '@/lib/currency';
import type { ProviderQuote } from '@/lib/currency';
import type {
    CurrencyOption,
    CurrencyRateResponse,
    FavoriteCurrencyPair,
} from '@/types';

type ConverterPanelProps = {
    amountInput: string;
    baseCurrency: string;
    currencies: Record<string, CurrencyOption>;
    isFavorite: boolean;
    isSavingFavorite: boolean;
    onAddFavorite: () => void;
    onAmountChange: (value: string) => void;
    onBaseCurrencyChange: (value: string) => void;
    onQuoteCurrencyChange: (value: string) => void;
    onSaveSnapshot: () => void;
    onSwap: () => void;
    isRateLoading: boolean;
    isRateError: boolean;
    nickname: string;
    onNicknameChange: (value: string) => void;
    providerQuotes: ProviderQuote[];
    quoteCurrency: string;
    rateResponse?: CurrencyRateResponse;
    selectedProviderId: string;
    topFavorite?: FavoriteCurrencyPair;
};

export default function ConverterPanel({
    amountInput,
    baseCurrency,
    currencies,
    isFavorite,
    isSavingFavorite,
    onAddFavorite,
    onAmountChange,
    onBaseCurrencyChange,
    onQuoteCurrencyChange,
    onSaveSnapshot,
    onSwap,
    isRateLoading,
    isRateError,
    nickname,
    onNicknameChange,
    providerQuotes,
    quoteCurrency,
    rateResponse,
    selectedProviderId,
    topFavorite,
}: ConverterPanelProps) {
    const selectedProvider =
        providerQuotes.find((provider) => provider.id === selectedProviderId) ??
        providerQuotes[0];

    return (
        <Card className="overflow-hidden border-white/10 bg-card/90 shadow-[0_24px_80px_-32px_rgba(114,255,164,0.45)]">
            <CardHeader className="border-b border-white/10 pb-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs tracking-[0.35em] text-primary/70 uppercase">
                            Currency Workspace
                        </p>
                        <CardTitle className="mt-2 text-2xl font-semibold tracking-tight">
                            Convert with live reference rates
                        </CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-9 border-white/10 bg-white/5 text-white hover:bg-white/10"
                            onClick={onSaveSnapshot}
                            type="button"
                        >
                            <RefreshCcw className="size-4" />
                            Save snapshot
                        </Button>

                        {/* Nickname input — only visible when pair is not yet saved */}
                        {!isFavorite && (
                            <div className="relative flex items-center">
                                <Tag className="absolute left-3 size-3.5 text-muted-foreground" />
                                <Input
                                    className="h-9 w-44 rounded-xl border-white/10 bg-white/5 pl-8 text-xs placeholder:text-muted-foreground/60"
                                    maxLength={60}
                                    onChange={(e) => onNicknameChange(e.target.value)}
                                    placeholder='Label this pair… (optional)'
                                    type="text"
                                    value={nickname}
                                />
                            </div>
                        )}

                        <Button
                            className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={isSavingFavorite || isFavorite}
                            onClick={onAddFavorite}
                            type="button"
                        >
                            {isFavorite ? (
                                <Star className="size-4 fill-current" />
                            ) : (
                                <BookmarkPlus className="size-4" />
                            )}
                            {isFavorite ? 'Saved pair' : 'Save favorite'}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="grid gap-6 px-5 py-5 lg:grid-cols-[1.3fr_0.9fr]">
                <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
                        <div className="space-y-2">
                            <label
                                className="text-xs tracking-[0.3em] text-muted-foreground uppercase"
                                htmlFor="amount"
                            >
                                Send amount
                            </label>
                            <Input
                                id="amount"
                                inputMode="decimal"
                                className="h-12 rounded-xl border-white/10 bg-white/5 text-base font-semibold"
                                onChange={(event) =>
                                    onAmountChange(event.target.value)
                                }
                                value={amountInput}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                                From
                            </label>
                            <CurrencySelect
                                currencies={currencies}
                                onValueChange={onBaseCurrencyChange}
                                value={baseCurrency}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                                To
                            </label>
                            <CurrencySelect
                                currencies={currencies}
                                onValueChange={onQuoteCurrencyChange}
                                value={quoteCurrency}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="h-12 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 md:w-12"
                                onClick={onSwap}
                                size="icon"
                                type="button"
                            >
                                {isRateLoading ? (
                                    <Spinner className="size-4" />
                                ) : (
                                    <ArrowDownUp className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {presetAmounts.map((amount) => (
                            <button
                                key={amount}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-white"
                                onClick={() => onAmountChange(String(amount))}
                                type="button"
                            >
                                {formatCurrency(amount, baseCurrency)}
                            </button>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-primary/80">
                                    Latest converted amount
                                </p>
                                <div className="mt-2 flex items-center gap-3">
                                    {isRateLoading ? (
                                        <Spinner className="size-5 text-primary" />
                                    ) : null}
                                    {isRateError ? (
                                        <span className="text-lg font-semibold text-amber-400">
                                            Rate unavailable
                                        </span>
                                    ) : (
                                        <span className="text-3xl font-semibold tracking-tight">
                                            {rateResponse
                                                ? formatCurrency(
                                                      rateResponse.convertedAmount,
                                                      quoteCurrency,
                                                  )
                                                : `${quoteCurrency} —`}
                                        </span>
                                    )}
                                    <ArrowRight className="size-5 text-primary/70" />
                                </div>
                            </div>

                            {selectedProvider ? (
                                <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-right">
                                    <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                                        Best net option
                                    </p>
                                    <p className="mt-2 text-base font-semibold">
                                        {selectedProvider.name}
                                    </p>
                                    <p className="text-sm text-primary">
                                        {formatCurrency(
                                            selectedProvider.receivedAmount,
                                            quoteCurrency,
                                        )}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {rateResponse ? (
                            <div className="mt-4 grid gap-3 text-xs text-muted-foreground md:grid-cols-3">
                                <div>
                                    <p className="tracking-[0.25em] uppercase">
                                        Mid-market rate
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                        1 {baseCurrency} ={' '}
                                        {formatNumber(rateResponse.rate)}{' '}
                                        {quoteCurrency}
                                    </p>
                                </div>
                                <div>
                                    <p className="tracking-[0.25em] uppercase">
                                        Inverse rate
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                        1 {quoteCurrency} ={' '}
                                        {formatNumber(rateResponse.inverseRate)}{' '}
                                        {baseCurrency}
                                    </p>
                                </div>
                                <div>
                                    <p className="tracking-[0.25em] uppercase">
                                        Rate timestamp
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                        {formatRateDate(rateResponse.date)}{' '}
                                        <span className="text-muted-foreground">
                                            (
                                            {formatRelativeTime(
                                                rateResponse.date,
                                            )}
                                            )
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div>
                        <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">
                            Quick pulse
                        </p>
                        <p className="mt-2 text-xl font-semibold tracking-tight">
                            {baseCurrency}/{quoteCurrency}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                            <p className="text-sm text-muted-foreground">
                                Provider spread benchmark
                            </p>
                            <p className="mt-2 text-lg font-semibold">
                                {selectedProvider
                                    ? `${(selectedProvider.rateMargin * 100).toFixed(2)}% margin`
                                    : 'Awaiting rate'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                            <p className="text-sm text-muted-foreground">
                                Estimated provider fees
                            </p>
                            <p className="mt-2 text-lg font-semibold">
                                {selectedProvider
                                    ? formatCurrency(
                                          selectedProvider.feeAmount,
                                          baseCurrency,
                                      )
                                    : `${baseCurrency} 0.00`}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                            <p className="text-sm text-muted-foreground">
                                Favorite pair in focus
                            </p>
                            <p className="mt-2 text-lg font-semibold">
                                {topFavorite
                                    ? `${topFavorite.baseCurrency}/${topFavorite.quoteCurrency}`
                                    : 'No favorites yet'}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
