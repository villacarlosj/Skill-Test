import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function TypographyH1({
    className,
    ...props
}: ComponentPropsWithoutRef<'h1'>) {
    return (
        <h1
            className={cn(
                'scroll-m-20 text-4xl font-semibold tracking-tight text-balance md:text-5xl',
                className,
            )}
            {...props}
        />
    );
}

export function TypographyH2({
    className,
    ...props
}: ComponentPropsWithoutRef<'h2'>) {
    return (
        <h2
            className={cn(
                'scroll-m-20 border-b border-border/60 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                className,
            )}
            {...props}
        />
    );
}

export function TypographyH3({
    className,
    ...props
}: ComponentPropsWithoutRef<'h3'>) {
    return (
        <h3
            className={cn(
                'scroll-m-20 text-2xl font-semibold tracking-tight',
                className,
            )}
            {...props}
        />
    );
}

export function TypographyLead({
    className,
    ...props
}: ComponentPropsWithoutRef<'p'>) {
    return (
        <p
            className={cn('text-lg text-muted-foreground md:text-xl', className)}
            {...props}
        />
    );
}

export function TypographyP({
    className,
    ...props
}: ComponentPropsWithoutRef<'p'>) {
    return (
        <p
            className={cn('leading-7 text-muted-foreground', className)}
            {...props}
        />
    );
}

export function TypographySmall({
    className,
    ...props
}: ComponentPropsWithoutRef<'p'>) {
    return (
        <p
            className={cn(
                'text-sm leading-none font-medium tracking-[0.28em] text-muted-foreground uppercase',
                className,
            )}
            {...props}
        />
    );
}
