<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CurrencyOptionsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'currencies' => config('currency.supported'),
        ]);
    }
}
