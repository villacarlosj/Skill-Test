<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCurrencyPreferencesRequest;
use App\Support\CurrencyPreferences;
use Illuminate\Http\JsonResponse;

class CurrencyPreferenceController extends Controller
{
    public function update(UpdateCurrencyPreferencesRequest $request): JsonResponse
    {
        $preferences = CurrencyPreferences::merge(
            CurrencyPreferences::fromRequest($request),
            $request->safe()->all(),
        );

        return response()
            ->json(['preferences' => $preferences])
            ->cookie(CurrencyPreferences::cookie($preferences));
    }
}
