import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { CurrencyOption } from '@/types';

type CurrencySelectProps = {
    currencies: Record<string, CurrencyOption>;
    onValueChange: (value: string) => void;
    value: string;
};

export default function CurrencySelect({
    currencies,
    onValueChange,
    value,
}: CurrencySelectProps) {
    return (
        <Select onValueChange={onValueChange} value={value}>
            <SelectTrigger className="w-full rounded-xl border-white/10 bg-white/5 px-4 py-6 text-left text-sm">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-neutral-950 text-white">
                {Object.entries(currencies).map(([code, details]) => (
                    <SelectItem key={code} value={code}>
                        <span className="flex w-full items-center justify-between gap-3">
                            <span>{code}</span>
                            <span className="text-xs text-muted-foreground">
                                {details.name}
                            </span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
