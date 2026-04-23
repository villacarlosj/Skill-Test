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
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn ($favorite): array => [
                    'id'           => $favorite->id,
                    'baseCurrency' => $favorite->base_currency,
                    'quoteCurrency' => $favorite->quote_currency,
                    'nickname'     => $favorite->nickname,
                    'savedRate'    => $favorite->saved_rate,
                    'sortOrder'    => $favorite->sort_order,
                ]),
            'preferences' => CurrencyPreferences::fromRequest($request),
            'currencies'  => config('currency.supported'),
        ]);
    }
}
