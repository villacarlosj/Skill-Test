import { cn } from '@/lib/utils';

export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img
            src="/branding/ratehorse-running-icon.jpg"
            alt="Ratehorse"
            className={cn('rounded-md object-cover', className)}
        />
    );
}
