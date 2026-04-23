import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    BadgeDollarSign,
    Clock,
    CreditCard,
    Landmark,
    PiggyBank,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyH1, TypographyLead } from '@/components/ui/typography';

// ── Hardcoded display data ──────────────────────────────────────────
const totalPortfolioUSD = 47_382.5;

const walletPools = [
    {
        currency: 'USD',
        label: 'Primary Reserve',
        amount: 24800.0,
        symbol: '$',
        changePercent: +3.2,
        color: 'primary',
        icon: BadgeDollarSign,
    },
    {
        currency: 'PHP',
        label: 'Payout Float',
        amount: 1_820_000.0,
        symbol: '₱',
        changePercent: -0.8,
        color: 'amber',
        icon: Wallet,
    },
    {
        currency: 'EUR',
        label: 'Travel Buffer',
        amount: 6_400.0,
        symbol: '€',
        changePercent: +1.4,
        color: 'sky',
        icon: CreditCard,
    },
];

const recentTransactions = [
    {
        id: 'txn-001',
        type: 'send',
        description: 'Transfer via Wise',
        pair: 'USD → PHP',
        amount: '-$2,500.00',
        received: '₱140,000.00',
        status: 'Settled',
        date: 'Apr 22, 2026',
        time: '09:14 AM',
    },
    {
        id: 'txn-002',
        type: 'receive',
        description: 'Incoming wire',
        pair: 'EUR → USD',
        amount: '+$5,420.00',
        received: '€5,000.00',
        status: 'Settled',
        date: 'Apr 21, 2026',
        time: '02:33 PM',
    },
    {
        id: 'txn-003',
        type: 'send',
        description: 'Transfer via Revolut',
        pair: 'USD → EUR',
        amount: '-$1,090.00',
        received: '€1,000.00',
        status: 'Settled',
        date: 'Apr 20, 2026',
        time: '11:05 AM',
    },
    {
        id: 'txn-004',
        type: 'send',
        description: 'Transfer via Remitly',
        pair: 'USD → PHP',
        amount: '-$900.00',
        received: '₱50,400.00',
        status: 'Processing',
        date: 'Apr 19, 2026',
        time: '04:47 PM',
    },
    {
        id: 'txn-005',
        type: 'receive',
        description: 'Client payout',
        pair: 'PHP → USD',
        amount: '+$1,800.00',
        received: '₱100,800.00',
        status: 'Settled',
        date: 'Apr 18, 2026',
        time: '10:22 AM',
    },
];

const insights = [
    {
        icon: TrendingUp,
        title: 'Portfolio Growth',
        value: '+8.4%',
        description: 'Net change over the last 30 days across all currency pools.',
    },
    {
        icon: PiggyBank,
        title: 'Projected Liquidity',
        value: '22 days runway',
        description:
            'Based on recent snapshot volume and provider fee assumptions.',
    },
    {
        icon: Landmark,
        title: 'Settlement Posture',
        value: 'Low risk',
        description:
            'Most recent modeled transfers maintain a healthy reserve after fees.',
    },
    {
        icon: ShieldCheck,
        title: 'Reserve Ratio',
        value: '52.3% USD',
        description: 'Majority held in base currency for maximum conversion flexibility.',
    },
];

function formatCompact(value: number, symbol: string): string {
    if (value >= 1_000_000)
        return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(1)}K`;
    return `${symbol}${value.toFixed(2)}`;
}

export default function WalletPage() {
    return (
        <>
            <Head title="Wallet" />

            <div className="relative flex flex-1 flex-col gap-8 overflow-x-hidden p-4 md:p-6">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute inset-x-4 top-4 -z-10 h-64 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(129,252,156,0.14),_transparent_55%)] blur-2xl" />

                {/* ── Page header ───────────────────────────────── */}
                <section className="space-y-3">
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                        Wallet &amp; Balances
                    </Badge>
                    <TypographyH1 className="max-w-2xl text-3xl md:text-4xl">
                        Your multi-currency financial workspace.
                    </TypographyH1>
                    <TypographyLead className="max-w-2xl text-sm font-normal md:text-base">
                        Manage reserves, track payouts, and monitor your overall currency
                        health — all in one place.
                    </TypographyLead>
                </section>

                {/* ── Total portfolio banner ────────────────────── */}
                <Card className="relative overflow-hidden border-primary/25 bg-primary/10">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(129,252,156,0.15),_transparent_60%)]" />
                    <CardContent className="relative flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs tracking-[0.3em] text-primary/70 uppercase">
                                Total Portfolio Value
                            </p>
                            <p className="mt-2 text-4xl font-bold tracking-tight text-primary">
                                ${totalPortfolioUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                USD equivalent · 3 active currency pools
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="outline"
                                className="gap-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                            >
                                <ArrowUpRight className="size-4" />
                                Send funds
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10"
                            >
                                <ArrowDownLeft className="size-4" />
                                Receive
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10"
                            >
                                <RefreshCw className="size-4" />
                                Convert
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Currency pool cards ───────────────────────── */}
                <div className="grid gap-4 md:grid-cols-3">
                    {walletPools.map((pool) => {
                        const Icon = pool.icon;
                        const isPositive = pool.changePercent >= 0;
                        const colorMap: Record<
                            string,
                            { bg: string; border: string; icon: string; badge: string }
                        > = {
                            primary: {
                                bg: 'bg-primary/10',
                                border: 'border-primary/25',
                                icon: 'text-primary bg-primary/15 border-primary/20',
                                badge: 'bg-primary/15 text-primary',
                            },
                            amber: {
                                bg: 'bg-amber-500/8',
                                border: 'border-amber-500/20',
                                icon: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
                                badge: 'bg-amber-500/15 text-amber-400',
                            },
                            sky: {
                                bg: 'bg-sky-500/8',
                                border: 'border-sky-500/20',
                                icon: 'text-sky-400 bg-sky-500/15 border-sky-500/20',
                                badge: 'bg-sky-500/15 text-sky-400',
                            },
                        };
                        const c = colorMap[pool.color];

                        return (
                            <Card
                                key={pool.currency}
                                className={`border ${c.border} ${c.bg} backdrop-blur`}
                            >
                                <CardContent className="flex flex-col gap-4 px-5 py-5">
                                    {/* Top row */}
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`flex size-11 items-center justify-center rounded-xl border ${c.icon}`}
                                        >
                                            <Icon className="size-5" />
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.badge}`}
                                        >
                                            {isPositive ? '+' : ''}
                                            {pool.changePercent.toFixed(1)}% today
                                        </span>
                                    </div>

                                    {/* Currency & label */}
                                    <div>
                                        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                                            {pool.label}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground/70">
                                            {pool.currency}
                                        </p>
                                    </div>

                                    {/* Balance */}
                                    <p className="text-3xl font-bold tracking-tight">
                                        {formatCompact(pool.amount, pool.symbol)}
                                    </p>

                                    {/* Mini sparkline placeholder bar */}
                                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                                        <div
                                            className={`h-full rounded-full ${isPositive ? 'bg-primary' : 'bg-destructive'}`}
                                            style={{
                                                width: `${Math.min(Math.abs(pool.changePercent) * 20 + 40, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* ── Insights row ──────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {insights.map((insight) => {
                        const Icon = insight.icon;
                        return (
                            <Card
                                key={insight.title}
                                className="border-white/10 bg-card/90 backdrop-blur"
                            >
                                <CardContent className="flex flex-col gap-3 px-5 py-5">
                                    <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                                        <Icon className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                                            {insight.title}
                                        </p>
                                        <p className="mt-1 text-xl font-semibold">
                                            {insight.value}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {insight.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* ── Transaction history ───────────────────────── */}
                <Card className="border-white/10 bg-card/90">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 px-6 py-5">
                        <div>
                            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                                History
                            </p>
                            <CardTitle className="mt-1 text-xl">
                                Recent transactions
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                            View all
                            <ArrowRight className="size-3" />
                        </Button>
                    </CardHeader>

                    <CardContent className="divide-y divide-white/5 px-0 py-0">
                        {recentTransactions.map((txn) => {
                            const isSend = txn.type === 'send';
                            const isSettled = txn.status === 'Settled';

                            return (
                                <div
                                    key={txn.id}
                                    className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-white/3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full border ${
                                                isSend
                                                    ? 'border-destructive/25 bg-destructive/10 text-destructive'
                                                    : 'border-primary/25 bg-primary/10 text-primary'
                                            }`}
                                        >
                                            {isSend ? (
                                                <ArrowUpRight className="size-4" />
                                            ) : (
                                                <ArrowDownLeft className="size-4" />
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <p className="text-sm font-medium">
                                                {txn.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {txn.pair} · {txn.received}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                                        <p
                                            className={`text-sm font-semibold ${
                                                isSend
                                                    ? 'text-foreground'
                                                    : 'text-primary'
                                            }`}
                                        >
                                            {txn.amount}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                    isSettled
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'bg-amber-500/10 text-amber-400'
                                                }`}
                                            >
                                                <span
                                                    className={`size-1.5 rounded-full ${isSettled ? 'bg-primary' : 'bg-amber-400'}`}
                                                />
                                                {txn.status}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <Clock className="size-2.5" />
                                                {txn.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* ── Footer CTA ─────────────────────────────────── */}
                <div className="flex justify-end">
                    <Button
                        asChild
                        variant="outline"
                        className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                        <Link href="/dashboard">
                            Back to dashboard
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

WalletPage.layout = {
    breadcrumbs: [
        {
            title: 'Wallet',
            href: '/dashboard/wallet',
        },
    ],
};
