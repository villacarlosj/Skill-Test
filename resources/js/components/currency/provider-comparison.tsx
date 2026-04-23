import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/currency';
import type { ProviderQuote } from '@/lib/currency';

type ProviderComparisonProps = {
    baseCurrency: string;
    onSelectProvider: (providerId: string) => void;
    providers: ProviderQuote[];
    quoteCurrency: string;
    selectedProviderId: string;
};

export default function ProviderComparison({
    baseCurrency,
    onSelectProvider,
    providers,
    quoteCurrency,
    selectedProviderId,
}: ProviderComparisonProps) {
    return (
        <Card className="border-white/10 bg-card/90">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">
                        Fee-adjusted outcomes
                    </p>
                    <CardTitle className="mt-2 text-2xl">
                        Compare providers
                    </CardTitle>
                </div>
                <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                    5 providers
                </Badge>
            </CardHeader>

            <CardContent className="grid gap-4">
                {providers.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            No comparison available yet
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                            Enter an amount and select a currency pair above to
                            see fee-adjusted quotes across all providers.
                        </p>
                    </div>
                ) : (
                    providers.map((provider, index) => {
                    const isSelected = provider.id === selectedProviderId;

                    return (
                        <button
                            key={provider.id}
                            className={`grid gap-4 rounded-2xl border px-5 py-4 text-left transition md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] ${
                                isSelected
                                    ? 'border-primary/60 bg-primary/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                            onClick={() => onSelectProvider(provider.id)}
                            type="button"
                        >
                            <div>
                                <div className="flex items-center gap-3">
                                    <p className="text-lg font-semibold">
                                        {provider.name}
                                    </p>
                                    {index === 0 ? (
                                        <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                                            Best net
                                        </Badge>
                                    ) : null}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Arrival time: {provider.eta}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                                    Recipient gets
                                </p>
                                <p className="mt-2 text-lg font-semibold">
                                    {formatCurrency(
                                        provider.receivedAmount,
                                        quoteCurrency,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                                    Fees
                                </p>
                                <p className="mt-2 text-lg font-semibold">
                                    {formatCurrency(
                                        provider.feeAmount,
                                        baseCurrency,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                                    Effective rate
                                </p>
                                <p className="mt-2 text-lg font-semibold">
                                    {formatNumber(provider.effectiveRate)}{' '}
                                    {quoteCurrency}
                                </p>
                            </div>
                        </button>
                    );
                }))}
            </CardContent>
        </Card>
    );
}
