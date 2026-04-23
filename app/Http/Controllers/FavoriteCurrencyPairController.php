<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFavoriteCurrencyPairRequest;
use App\Models\FavoriteCurrencyPair;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class FavoriteCurrencyPairController extends Controller
{
    public function index(): Response
    {
        abort(404);
    }

    public function store(StoreFavoriteCurrencyPairRequest $request): JsonResponse
    {
        $favorite = $request->user()->favoriteCurrencyPairs()->firstOrCreate([
            'base_currency' => $request->validated('baseCurrency'),
            'quote_currency' => $request->validated('quoteCurrency'),
        ]);

        return response()->json([
            'favorite' => [
                'id' => $favorite->id,
                'baseCurrency' => $favorite->base_currency,
                'quoteCurrency' => $favorite->quote_currency,
            ],
        ], 201);
    }

    public function show(FavoriteCurrencyPair $favoriteCurrencyPair): Response
    {
        abort(404);
    }

    public function update(FavoriteCurrencyPair $favoriteCurrencyPair): Response
    {
        abort(404);
    }

    public function destroy(FavoriteCurrencyPair $favoriteCurrencyPair): Response
    {
        abort_unless($favoriteCurrencyPair->user_id === request()->user()?->id, 403);

        $favoriteCurrencyPair->delete();

        return response()->noContent();
    }
}
