<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Contracts\Cookie\QueueingFactory as CookieFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Cookie as SymfonyCookie;

class CurrencyPreferences
{
    /**
     * @return array{
     *     amount: float|int,
     *     baseCurrency: string,
     *     quoteCurrency: string,
     *     recentConversions: array<int, array{
     *         id: string,
     *         baseCurrency: string,
     *         quoteCurrency: string,
     *         amount: float|int,
     *         convertedAmount: float|int,
     *         rate: float|int,
     *         provider: string,
     *         createdAt: string
     *     }>
     * }
     */
    public static function fromRequest(Request $request): array
    {
        $defaults = self::defaultsForUser($request->user());
        $stored = $request->cookie(config('currency.cookie.name'));

        if (! is_string($stored)) {
            return $defaults;
        }

        /** @var mixed $decoded */
        $decoded = json_decode($stored, true);

        if (! is_array($decoded)) {
            return $defaults;
        }

        return self::merge($defaults, $decoded);
    }

    /**
     * @param  array<string, mixed>  $current
     * @param  array<string, mixed>  $updates
     * @return array{
     *     amount: float|int,
     *     baseCurrency: string,
     *     quoteCurrency: string,
     *     recentConversions: array<int, array{
     *         id: string,
     *         baseCurrency: string,
     *         quoteCurrency: string,
     *         amount: float|int,
     *         convertedAmount: float|int,
     *         rate: float|int,
     *         provider: string,
     *         createdAt: string
     *     }>
     * }
     */
    public static function merge(array $current, array $updates): array
    {
        $defaultQuote = (string) Arr::get($current, 'quoteCurrency', config('currency.defaults.quoteCurrency'));

        $preferences = [
            'amount' => (float) Arr::get($updates, 'amount', Arr::get($current, 'amount', config('currency.defaults.amount'))),
            'baseCurrency' => (string) Arr::get($updates, 'baseCurrency', Arr::get($current, 'baseCurrency', config('currency.defaults.baseCurrency'))),
            'quoteCurrency' => (string) Arr::get($updates, 'quoteCurrency', $defaultQuote),
            'recentConversions' => collect(Arr::get($updates, 'recentConversions', Arr::get($current, 'recentConversions', [])))
                ->take(6)
                ->map(fn (array $conversion): array => [
                    'id' => (string) $conversion['id'],
                    'baseCurrency' => (string) $conversion['baseCurrency'],
                    'quoteCurrency' => (string) $conversion['quoteCurrency'],
                    'amount' => (float) $conversion['amount'],
                    'convertedAmount' => (float) $conversion['convertedAmount'],
                    'rate' => (float) $conversion['rate'],
                    'provider' => (string) $conversion['provider'],
                    'createdAt' => (string) $conversion['createdAt'],
                ])
                ->values()
                ->all(),
        ];

        if ($preferences['baseCurrency'] === $preferences['quoteCurrency']) {
            $preferences['quoteCurrency'] = $defaultQuote === $preferences['baseCurrency']
                ? config('currency.defaults.quoteCurrency')
                : $defaultQuote;
        }

        return $preferences;
    }

    /**
     * @return array{
     *     amount: float|int,
     *     baseCurrency: string,
     *     quoteCurrency: string,
     *     recentConversions: array<int, array{
     *         id: string,
     *         baseCurrency: string,
     *         quoteCurrency: string,
     *         amount: float|int,
     *         convertedAmount: float|int,
     *         rate: float|int,
     *         provider: string,
     *         createdAt: string
     *     }>
     * }
     */
    public static function defaultsForUser(?User $user): array
    {
        $defaults = config('currency.defaults');

        if (! $user instanceof User) {
            return $defaults;
        }

        $country = config('currency.countries.'.strtoupper((string) $user->country_code));

        if (! is_array($country)) {
            return $defaults;
        }

        return self::merge($defaults, [
            'baseCurrency' => (string) Arr::get($country, 'currency', $defaults['baseCurrency']),
            'quoteCurrency' => (string) Arr::get($country, 'quoteCurrency', $defaults['quoteCurrency']),
        ]);
    }

    /**
     * @param  array<string, mixed>  $preferences
     */
    public static function cookie(array $preferences): SymfonyCookie
    {
        /** @var CookieFactory $cookie */
        $cookie = Cookie::getFacadeRoot();

        return $cookie->make(
            config('currency.cookie.name'),
            json_encode($preferences, JSON_THROW_ON_ERROR),
            config('currency.cookie.minutes'),
            '/',
            null,
            config('session.secure'),
            true,
            false,
            config('session.same_site'),
        );
    }
}
