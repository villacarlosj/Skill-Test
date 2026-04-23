import { Head } from '@inertiajs/react';
import { BadgePercent, Clock3, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    TypographyH1,
    TypographyLead,
} from '@/components/ui/typography';
import { providerCatalog } from '@/lib/currency';

// Derived from the catalog so it always stays in sync
const fastestEta = 'Within minutes';
const lowestFixed = Math.min(...providerCatalog.map((p) => p.fixedFee));

const providerSignals = [
    {
        label: 'Tracked providers',
        value: `${providerCatalog.length} lanes`,
    },
    {
        label: 'Fastest arrival',
        value: fastestEta,
    },
    {
        label: 'Lowest fixed fee',
        value: lowestFixed === 0 ? 'No fixed fee' : `$${lowestFixed.toFixed(2)}`,
    },
];

// Color-code ETA badge
function etaBadgeClass(eta: string): string {
    if (eta.toLowerCase().includes('minute')) return 'bg-primary/15 text-primary';
    if (eta.toLowerCase().includes('same')) return 'bg-sky-500/15 text-sky-400';
    if (eta.toLowerCase().includes('1')) return 'bg-amber-500/15 text-amber-400';
    return 'bg-white/10 text-white/70';
}

export default function Providers() {
    return (
        <>
            <Head title="Providers" />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                {/* ── Page header ──────────────────────────────────── */}
                <section className="space-y-2">
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                        Provider intelligence
                    </Badge>
                    <TypographyH1 className="max-w-2xl text-2xl md:text-3xl">
                        Compare transfer providers at a glance.
                    </TypographyH1>
                    <TypographyLead className="max-w-2xl text-sm font-normal">
                        Fee models and FX spreads for every supported lane — so
                        you know the cost before you convert.
                    </TypographyLead>
                </section>

                {/* ── Signal summary row ───────────────────────────── */}
                <div className="grid gap-3 md:grid-cols-3">
                    {providerSignals.map((signal) => (
                        <Card
                            key={signal.label}
                            className="border-white/10 bg-card/90"
                        >
                            <CardContent className="flex flex-col gap-1 px-5 py-4">
                                <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                                    {signal.label}
                                </p>
                                <p className="text-lg font-semibold tracking-tight">
                                    {signal.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ── Provider cards grid ──────────────────────────── */}
                <div className="grid gap-3 xl:grid-cols-2">
                    {providerCatalog.map((provider) => (
                        <Card
                            key={provider.id}
                            className="border-white/10 bg-card/90 transition-colors hover:border-white/20"
                        >
                            <CardContent className="px-5 py-4">
                                {/* Card header row */}
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                                            <Zap className="size-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                                                Provider
                                            </p>
                                            <p className="text-sm font-semibold leading-tight">
                                                {provider.name}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`text-[10px] font-medium ${etaBadgeClass(provider.eta)}`}
                                    >
                                        {provider.eta}
                                    </Badge>
                                </div>

                                {/* Fee metrics — compact inline row */}
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Fixed fee */}
                                    <div className="rounded-lg border border-white/8 bg-white/4 px-3 py-2.5">
                                        <div className="mb-1 flex items-center gap-1 text-primary">
                                            <BadgePercent className="size-3" />
                                            <span className="text-[10px] font-medium uppercase tracking-wide">
                                                Fixed
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {provider.fixedFee === 0
                                                ? 'None'
                                                : `$${provider.fixedFee.toFixed(2)}`}
                                        </p>
                                    </div>

                                    {/* Percentage fee */}
                                    <div className="rounded-lg border border-white/8 bg-white/4 px-3 py-2.5">
                                        <div className="mb-1 flex items-center gap-1 text-primary">
                                            <ShieldCheck className="size-3" />
                                            <span className="text-[10px] font-medium uppercase tracking-wide">
                                                % Fee
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {(provider.percentageFee * 100).toFixed(2)}%
                                        </p>
                                    </div>

                                    {/* FX margin */}
                                    <div className="rounded-lg border border-white/8 bg-white/4 px-3 py-2.5">
                                        <div className="mb-1 flex items-center gap-1 text-primary">
                                            <Clock3 className="size-3" />
                                            <span className="text-[10px] font-medium uppercase tracking-wide">
                                                FX margin
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {(provider.rateMargin * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>

                                {/* Short description */}
                                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                                    {provider.name} runs a{' '}
                                    {provider.eta.toLowerCase()} corridor with a{' '}
                                    {provider.fixedFee === 0
                                        ? 'no fixed fee'
                                        : `$${provider.fixedFee.toFixed(2)} flat charge`}
                                    {' '}and a{' '}
                                    {(provider.rateMargin * 100).toFixed(2)}% FX
                                    spread. Used by the converter for estimated
                                    received-amount calculations.
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

Providers.layout = {
    breadcrumbs: [
        {
            title: 'Providers',
            href: '/dashboard/providers',
        },
    ],
};
