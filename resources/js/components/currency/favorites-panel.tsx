import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import type { FavoriteCurrencyPair, RecentConversion } from '@/types';

type FavoritesPanelProps = {
    amount: number;
    favorites: FavoriteCurrencyPair[];
    onApplyFavorite: (favorite: FavoriteCurrencyPair) => void;
    onDeleteFavorite: (favorite: FavoriteCurrencyPair) => void;
    recentConversions: RecentConversion[];
};

export default function FavoritesPanel({
    amount,
    favorites,
    onApplyFavorite,
    recentConversions,
}: FavoritesPanelProps) {
    // Show only the 3 most recently added favorites (last items in array = newest)
    const recentFavorites = [...favorites].reverse().slice(0, 3);

    return (
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            {/* ── Recently Added Favorites ──────────────────────── */}
            <Card className="border-white/10 bg-card/90">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">
                            Recently added
                        </p>
                        <CardTitle className="mt-2 text-2xl">
                            Favorite pairs
                        </CardTitle>
                    </div>
                    <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                        <Sparkles className="size-4" />
                    </div>
                </CardHeader>

                <CardContent className="grid gap-3">
                    {recentFavorites.length > 0 ? (
                        <>
                            {recentFavorites.map((favorite, index) => (
                                <button
                                    key={favorite.id}
                                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                                    onClick={() => onApplyFavorite(favorite)}
                                    type="button"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Recency indicator — newest glows brightest */}
                                        <span
                                            className={`size-2 flex-shrink-0 rounded-full ${
                                                index === 0
                                                    ? 'bg-primary shadow-[0_0_6px_rgba(129,252,156,0.7)]'
                                                    : index === 1
                                                      ? 'bg-primary/50'
                                                      : 'bg-primary/25'
                                            }`}
                                        />
                                        <div>
                                            <p className="text-sm font-semibold transition-colors group-hover:text-primary">
                                                {favorite.nickname ?? `${favorite.baseCurrency}/${favorite.quoteCurrency}`}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {favorite.nickname
                                                    ? `${favorite.baseCurrency}/${favorite.quoteCurrency} · `
                                                    : ''}
                                                Quick-load{' '}
                                                {formatCurrency(
                                                    amount,
                                                    favorite.baseCurrency,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            ))}

                            {/* Link to full favorites page */}
                            <Button
                                asChild
                                variant="ghost"
                                className="mt-1 w-full justify-between border border-dashed border-white/10 text-xs text-muted-foreground hover:border-primary/20 hover:text-primary"
                            >
                                <Link href="/dashboard/favorites">
                                    <span>
                                        View all {favorites.length} saved pair
                                        {favorites.length !== 1 ? 's' : ''}
                                    </span>
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-muted-foreground">
                                Save corridors like USD/PHP or EUR/JPY from the
                                converter above — they'll appear here for
                                one-click recall.
                            </p>
                            <Button
                                asChild
                                variant="ghost"
                                className="self-start border border-white/10 text-xs text-muted-foreground hover:border-primary/20 hover:text-primary"
                            >
                                <Link href="/dashboard/favorites">
                                    Go to favorites
                                    <ArrowRight className="ml-1.5 size-3.5" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Recent Conversions ────────────────────────────── */}
            <Card className="border-white/10 bg-card/90">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">
                                Cookie-backed activity
                            </p>
                            <CardTitle className="mt-2 text-2xl">
                                Recent conversions
                            </CardTitle>
                        </div>
                        <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                            <Clock className="size-4" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                    {recentConversions.length > 0 ? (
                        recentConversions.map((conversion) => (
                            <div
                                key={conversion.id}
                                className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_1fr_auto]"
                            >
                                <div>
                                    <p className="text-sm font-semibold">
                                        {conversion.baseCurrency}/
                                        {conversion.quoteCurrency}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        via {conversion.provider}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-primary">
                                        {formatCurrency(
                                            conversion.convertedAmount,
                                            conversion.quoteCurrency,
                                        )}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        from{' '}
                                        {formatCurrency(
                                            conversion.amount,
                                            conversion.baseCurrency,
                                        )}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    }).format(new Date(conversion.createdAt))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-muted-foreground">
                            Saved snapshots stay in an encrypted cookie so the
                            dashboard remembers your latest decision points
                            without using localStorage.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
