import { Activity, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/lib/currency';

type MarketOverviewProps = {
    activePair: string;
    favoriteCount: number;
    inverseRate: number;
    totalCurrencies: number;
};

const items = [
    {
        icon: Activity,
        key: 'pair',
        label: 'Active pair',
    },
    {
        icon: ShieldCheck,
        key: 'favoriteCount',
        label: 'Tracked pairs',
    },
    {
        icon: TrendingUp,
        key: 'coverage',
        label: 'Supported currencies',
    },
];

export default function MarketOverview({
    activePair,
    favoriteCount,
    inverseRate,
    totalCurrencies,
}: MarketOverviewProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => {
                const Icon = item.icon;
                const value =
                    item.key === 'pair'
                        ? activePair
                        : item.key === 'favoriteCount'
                          ? `${favoriteCount} saved`
                          : `${totalCurrencies} options`;
                const subtitle =
                    item.key === 'pair'
                        ? `Inverse rate: ${formatNumber(inverseRate)}`
                        : item.key === 'favoriteCount'
                          ? 'Stored in PostgreSQL per account'
                          : 'Backed by Frankfurter latest rates';

                return (
                    <Card
                        key={item.key}
                        className="border-white/10 bg-white/5 backdrop-blur"
                    >
                        <CardContent className="flex items-start gap-4 px-5 py-5">
                            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                                <Icon className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">
                                    {item.label}
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    {value}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {subtitle}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
