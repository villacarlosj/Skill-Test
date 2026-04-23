import { Heart, LayoutGrid, ShieldCheck, WalletCards } from 'lucide-react';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export const platformNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Providers',
        href: '/dashboard/providers',
        icon: ShieldCheck,
    },
    {
        title: 'Wallet',
        href: '/dashboard/wallet',
        icon: WalletCards,
    },
    {
        title: 'Favorites',
        href: '/dashboard/favorites',
        icon: Heart,
    },
];
