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
            'currencies' => config('currency.supported'),
        ]);
    }
}
