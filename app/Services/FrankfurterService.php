<?php

namespace App\Services;

use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;

class FrankfurterService
{
    public function __construct(private readonly HttpFactory $http) {}

    /**
     * @return array{
     *     amount: float,
     *     base: string,
     *     date: string,
     *     rates: array<string, float>
     * }
     *
     * @throws RequestException
     */
    public function latest(string $baseCurrency, string $quoteCurrency, float $amount): array
    {
        $response = $this->http
            ->baseUrl(config('services.frankfurter.base_url'))
            ->timeout(config('services.frankfurter.timeout'))
            ->acceptJson()
            ->get('/latest', [
                'base' => $baseCurrency,
                'symbols' => $quoteCurrency,
                'amount' => $amount,
            ])
            ->throw();

        /** @var array{amount: mixed, base: mixed, date: mixed, rates: array<string, mixed>} $payload */
        $payload = $response->json();

        return [
            'amount' => (float) Arr::get($payload, 'amount', $amount),
            'base' => (string) Arr::get($payload, 'base', $baseCurrency),
            'date' => (string) Arr::get($payload, 'date'),
            'rates' => collect(Arr::get($payload, 'rates', []))
                ->map(fn (mixed $value): float => (float) $value)
                ->all(),
        ];
    }
}
