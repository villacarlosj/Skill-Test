<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoritePairsPageController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('favorites', [
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
            'currencies' => config('currency.supported'),
        ]);
    }
}
