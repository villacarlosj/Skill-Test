import { Head, Link } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import { Heart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TypographyH1,
    TypographyLead,
    TypographyP,
    TypographySmall,
} from '@/components/ui/typography';
import api from '@/lib/axios';
import type { FavoriteCurrencyPair, FavoritesPageProps } from '@/types';

export default function Favorites({
    currencies,
    favorites,
}: FavoritesPageProps) {
    const [items, setItems] = useState(favorites);

    const deleteMutation = useMutation({
        mutationFn: async (favorite: FavoriteCurrencyPair) => {
            await api.delete(`/dashboard/favorites/${favorite.id}`);

            return favorite;
        },
        onSuccess: (favorite) => {
            setItems((current) =>
                current.filter((item) => item.id !== favorite.id),
            );
            toast.success(
                `${favorite.baseCurrency}/${favorite.quoteCurrency} removed`,
            );
        },
        onError: () => {
            toast.error('Could not remove that favorite pair right now.');
        },
    });

    return (
        <>
            <Head title="Favorites" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="space-y-4">
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                        Saved corridors
                    </Badge>
                    <TypographyH1>
                        Manage favorite currency pairs in a dedicated page.
                    </TypographyH1>
                    <TypographyLead className="max-w-3xl">
                        Favorites are stored in PostgreSQL per account, which
                        makes this page the cleanest place to review and prune
                        the corridors you care about most.
                    </TypographyLead>
                </section>

                <Card className="border-white/10 bg-card/90">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <TypographySmall>Favorites library</TypographySmall>
                            <CardTitle className="mt-2 text-2xl">
                                {items.length} saved pairs
                            </CardTitle>
                        </div>
                        <Heart className="size-5 text-primary" />
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {items.length > 0 ? (
                            items.map((favorite) => (
                                <div
                                    key={favorite.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold tracking-tight">
                                            {favorite.baseCurrency}/
                                            {favorite.quoteCurrency}
                                        </p>
                                        <TypographyP>
                                            {
                                                currencies[
                                                    favorite.baseCurrency
                                                ]?.name
                                            }{' '}
                                            to{' '}
                                            {
                                                currencies[
                                                    favorite.quoteCurrency
                                                ]?.name
                                            }
                                        </TypographyP>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="border-white/10 bg-white/5 text-white"
                                        >
                                            <Link href="/dashboard">
                                                Use in converter
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-white"
                                            disabled={deleteMutation.isPending}
                                            onClick={() =>
                                                deleteMutation.mutate(favorite)
                                            }
                                            type="button"
                                        >
                                            <Trash2 className="size-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8">
                                <TypographySmall>
                                    No favorites yet
                                </TypographySmall>
                                <TypographyP className="mt-3 max-w-2xl">
                                    Save pairs from the dashboard converter and
                                    they will show up here for quick review and
                                    maintenance.
                                </TypographyP>
                                <Button
                                    asChild
                                    className="mt-5 bg-primary text-primary-foreground"
                                >
                                    <Link href="/dashboard">
                                        Open dashboard
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Favorites.layout = {
    breadcrumbs: [
        {
            title: 'Favorites',
            href: '/dashboard/favorites',
        },
    ],
};
