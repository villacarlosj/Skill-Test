import { Head, Link } from '@inertiajs/react';
import { useMutation } from '@tanstack/react-query';
import {
    ArrowDownUp,
    Check,
    ChevronDown,
    ChevronUp,
    Heart,
    Pencil,
    Tag,
    Trash2,
    TrendingDown,
    TrendingUp,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    TypographyH1,
    TypographyLead,
    TypographyP,
    TypographySmall,
} from '@/components/ui/typography';
import api from '@/lib/axios';
import type { FavoriteCurrencyPair, FavoritesPageProps } from '@/types';

// ── helpers ────────────────────────────────────────────────────────────────
function rateDeltaBadge(savedRate: number | null, currentRate?: number) {
    if (!savedRate || !currentRate) return null;

    const deltaPct = ((currentRate - savedRate) / savedRate) * 100;
    const isPositive = deltaPct >= 0;
    const label = `${isPositive ? '+' : ''}${deltaPct.toFixed(2)}% since saved`;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isPositive
                    ? 'bg-primary/15 text-primary'
                    : 'bg-destructive/15 text-destructive'
            }`}
        >
            {isPositive ? (
                <TrendingUp className="size-3" />
            ) : (
                <TrendingDown className="size-3" />
            )}
            {label}
        </span>
    );
}

export default function Favorites({ currencies, favorites }: FavoritesPageProps) {
    const [items, setItems] = useState(favorites);

    // Track which row is in edit mode for nickname
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);

    // ── Delete ────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (favorite: FavoriteCurrencyPair) => {
            await api.delete(`/dashboard/favorites/${favorite.id}`);
            return favorite;
        },
        onSuccess: (favorite) => {
            setItems((current) => current.filter((item) => item.id !== favorite.id));
            const label = favorite.nickname ?? `${favorite.baseCurrency}/${favorite.quoteCurrency}`;
            toast.success(`"${label}" removed`);
        },
        onError: () => toast.error('Could not remove that favorite pair right now.'),
    });

    // ── Nickname update ───────────────────────────────────────────────────
    const updateMutation = useMutation({
        mutationFn: async ({ id, nickname }: { id: number; nickname: string | null }) => {
            const res = await api.put<{ favorite: FavoriteCurrencyPair }>(
                `/dashboard/favorites/${id}`,
                { nickname },
            );
            return res.data.favorite;
        },
        onSuccess: (updated) => {
            setItems((current) =>
                current.map((item) => (item.id === updated.id ? { ...item, nickname: updated.nickname } : item)),
            );
            setEditingId(null);
            toast.success(updated.nickname ? `Label set to "${updated.nickname}"` : 'Label cleared');
        },
        onError: () => toast.error('Could not update the label right now.'),
    });

    // ── Reorder ───────────────────────────────────────────────────────────
    const reorderMutation = useMutation({
        mutationFn: async (orderedIds: number[]) => {
            await api.patch('/dashboard/favorites/reorder', { ids: orderedIds });
        },
        onError: () => toast.error('Could not save the new order right now.'),
    });

    function moveItem(index: number, direction: 'up' | 'down') {
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= items.length) return;

        const next = [...items];
        [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
        setItems(next);
        reorderMutation.mutate(next.map((item) => item.id));
    }

    function startEdit(favorite: FavoriteCurrencyPair) {
        setEditingId(favorite.id);
        setEditValue(favorite.nickname ?? '');
        setTimeout(() => editInputRef.current?.focus(), 50);
    }

    function commitEdit(id: number) {
        const trimmed = editValue.trim() || null;
        updateMutation.mutate({ id, nickname: trimmed });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValue('');
    }

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
                        Favorites are stored in PostgreSQL per account. Label
                        them, track rate movement since you saved them, and
                        reorder by priority.
                    </TypographyLead>
                </section>

                <Card className="border-white/10 bg-card/90">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <TypographySmall>Favorites library</TypographySmall>
                            <CardTitle className="mt-2 text-2xl">
                                {items.length} saved pair{items.length !== 1 ? 's' : ''}
                            </CardTitle>
                        </div>
                        <Heart className="size-5 text-primary" />
                    </CardHeader>

                    <CardContent className="grid gap-3">
                        {items.length > 0 ? (
                            items.map((favorite, index) => {
                                const isEditing = editingId === favorite.id;

                                return (
                                    <div
                                        key={favorite.id}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/15"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            {/* ── Left: pair info ─────────────── */}
                                            <div className="flex items-start gap-3">
                                                {/* Reorder buttons */}
                                                <div className="flex flex-col gap-0.5 pt-0.5">
                                                    <button
                                                        type="button"
                                                        disabled={index === 0 || reorderMutation.isPending}
                                                        onClick={() => moveItem(index, 'up')}
                                                        className="rounded p-0.5 text-muted-foreground transition hover:text-white disabled:opacity-30"
                                                    >
                                                        <ChevronUp className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={index === items.length - 1 || reorderMutation.isPending}
                                                        onClick={() => moveItem(index, 'down')}
                                                        className="rounded p-0.5 text-muted-foreground transition hover:text-white disabled:opacity-30"
                                                    >
                                                        <ChevronDown className="size-3.5" />
                                                    </button>
                                                </div>

                                                {/* Pair details */}
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-base font-semibold tracking-tight">
                                                            {favorite.baseCurrency}/{favorite.quoteCurrency}
                                                        </p>
                                                        {/* Rate delta badge — placeholder; real rate would come from a live query */}
                                                        {rateDeltaBadge(favorite.savedRate, undefined)}
                                                        {favorite.savedRate && (
                                                            <span className="text-[10px] text-muted-foreground/70">
                                                                Saved @ {favorite.savedRate.toFixed(4)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <TypographyP className="text-xs text-muted-foreground">
                                                        {currencies[favorite.baseCurrency]?.name}{' '}
                                                        to{' '}
                                                        {currencies[favorite.quoteCurrency]?.name}
                                                    </TypographyP>

                                                    {/* Nickname row */}
                                                    {isEditing ? (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="relative">
                                                                <Tag className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                                                                <Input
                                                                    ref={editInputRef}
                                                                    className="h-7 w-48 rounded-lg border-white/10 bg-white/5 pl-7 text-xs"
                                                                    maxLength={60}
                                                                    onChange={(e) => setEditValue(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') commitEdit(favorite.id);
                                                                        if (e.key === 'Escape') cancelEdit();
                                                                    }}
                                                                    placeholder="Enter a label…"
                                                                    value={editValue}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => commitEdit(favorite.id)}
                                                                disabled={updateMutation.isPending}
                                                                className="rounded p-1 text-primary hover:bg-primary/10"
                                                            >
                                                                <Check className="size-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={cancelEdit}
                                                                className="rounded p-1 text-muted-foreground hover:text-white"
                                                            >
                                                                <X className="size-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(favorite)}
                                                            className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/70 transition hover:text-muted-foreground"
                                                        >
                                                            <Tag className="size-3" />
                                                            {favorite.nickname
                                                                ? `"${favorite.nickname}"`
                                                                : 'Add a label'}
                                                            <Pencil className="size-2.5 opacity-50" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ── Right: actions ──────────────── */}
                                            <div className="flex shrink-0 items-center gap-2">
                                                <Badge
                                                    className="gap-1 bg-white/5 text-[10px] text-muted-foreground"
                                                >
                                                    <ArrowDownUp className="size-2.5" />
                                                    #{index + 1}
                                                </Badge>

                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-white/10 bg-white/5 text-white"
                                                >
                                                    <Link href="/dashboard">
                                                        Use in converter
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    disabled={deleteMutation.isPending}
                                                    onClick={() => deleteMutation.mutate(favorite)}
                                                    type="button"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8">
                                <TypographySmall>No favorites yet</TypographySmall>
                                <TypographyP className="mt-3 max-w-2xl">
                                    Save pairs from the dashboard converter — label
                                    them, track rate shifts, and organize them in
                                    the order that matters to you.
                                </TypographyP>
                                <Button
                                    asChild
                                    className="mt-5 bg-primary text-primary-foreground"
                                >
                                    <Link href="/dashboard">Open dashboard</Link>
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
        { title: 'Favorites', href: '/dashboard/favorites' },
    ],
};
