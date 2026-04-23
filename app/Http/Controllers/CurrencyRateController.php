<?php

namespace App\Http\Controllers;

use App\Http\Requests\FetchCurrencyRateRequest;
use App\Services\FrankfurterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CurrencyRateController extends Controller
{
    public function __invoke(FetchCurrencyRateRequest $request, FrankfurterService $frankfurter): JsonResponse
    {
        $validated = $request->validated();
        $amount = (float) $validated['amount'];
        $baseCurrency = $validated['from'];
        $quoteCurrency = $validated['to'];

        $payload = Cache::remember(
            sprintf('currency-rate:%s:%s:%s', $baseCurrency, $quoteCurrency, number_format($amount, 2, '.', '')),
            now()->addMinutes(10),
            fn (): array => $frankfurter->latest($baseCurrency, $quoteCurrency, $amount),
        );

        $convertedAmount = (float) ($payload['rates'][$quoteCurrency] ?? 0);
        $rate = $amount > 0 ? $convertedAmount / $amount : 0.0;

        return response()->json([
            'baseCurrency' => $payload['base'],
            'quoteCurrency' => $quoteCurrency,
            'amount' => $payload['amount'],
            'convertedAmount' => $convertedAmount,
            'rate' => $rate,
            'inverseRate' => $rate > 0 ? 1 / $rate : 0,
            'date' => $payload['date'],
        ]);
    }
}
