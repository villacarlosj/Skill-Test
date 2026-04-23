<?php

namespace App\Http\Controllers;

use App\Support\CurrencyPreferences;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('dashboard', [
            'favorites' => $request->user()
                ->favoriteCurrencyPairs()
                ->orderBy('base_currency')
                ->orderBy('quote_currency')
                ->get()
                ->map(fn ($favorite): array => [
                    'id' => $favorite->id,
                    'baseCurrency' => $favorite->base_currency,
                    'quoteCurrency' => $favorite->quote_currency,
                ]),
            'preferences' => CurrencyPreferences::fromRequest($request),
            'currencies' => config('currency.supported'),
        ]);
    }
}
