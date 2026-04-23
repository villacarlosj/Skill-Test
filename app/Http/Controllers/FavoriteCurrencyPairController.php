<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReorderFavoriteCurrencyPairRequest;
use App\Http\Requests\StoreFavoriteCurrencyPairRequest;
use App\Http\Requests\UpdateFavoriteCurrencyPairRequest;
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
        // Determine the next sort_order for this user
        $maxOrder = $request->user()
            ->favoriteCurrencyPairs()
            ->max('sort_order') ?? -1;

        $favorite = $request->user()->favoriteCurrencyPairs()->firstOrCreate(
            [
                'base_currency'  => $request->validated('baseCurrency'),
                'quote_currency' => $request->validated('quoteCurrency'),
            ],
            [
                'nickname'   => $request->validated('nickname'),
                'saved_rate' => $request->validated('savedRate'),
                'sort_order' => $maxOrder + 1,
            ],
        );

        return response()->json([
            'favorite' => [
                'id'           => $favorite->id,
                'baseCurrency' => $favorite->base_currency,
                'quoteCurrency' => $favorite->quote_currency,
                'nickname'     => $favorite->nickname,
                'savedRate'    => $favorite->saved_rate,
                'sortOrder'    => $favorite->sort_order,
            ],
        ], 201);
    }

    public function show(FavoriteCurrencyPair $favoriteCurrencyPair): Response
    {
        abort(404);
    }

    public function update(UpdateFavoriteCurrencyPairRequest $request, FavoriteCurrencyPair $favoriteCurrencyPair): JsonResponse
    {
        abort_unless($favoriteCurrencyPair->user_id === $request->user()?->id, 403);

        $favoriteCurrencyPair->update([
            'nickname' => $request->validated('nickname'),
        ]);

        return response()->json([
            'favorite' => [
                'id'           => $favoriteCurrencyPair->id,
                'baseCurrency' => $favoriteCurrencyPair->base_currency,
                'quoteCurrency' => $favoriteCurrencyPair->quote_currency,
                'nickname'     => $favoriteCurrencyPair->nickname,
                'savedRate'    => $favoriteCurrencyPair->saved_rate,
                'sortOrder'    => $favoriteCurrencyPair->sort_order,
            ],
        ]);
    }

    public function reorder(ReorderFavoriteCurrencyPairRequest $request): Response
    {
        $user = $request->user();
        $ids  = $request->validated('ids'); // ordered array of IDs

        foreach ($ids as $order => $id) {
            $user->favoriteCurrencyPairs()
                ->where('id', $id)
                ->update(['sort_order' => $order]);
        }

        return response()->noContent();
    }

    public function destroy(FavoriteCurrencyPair $favoriteCurrencyPair): Response
    {
        abort_unless($favoriteCurrencyPair->user_id === request()->user()?->id, 403);

        $favoriteCurrencyPair->delete();

        return response()->noContent();
    }
}
