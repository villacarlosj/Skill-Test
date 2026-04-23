<?php

use App\Http\Controllers\Api\CurrencyOptionsController;
use App\Http\Controllers\CurrencyPreferenceController;
use App\Http\Controllers\CurrencyRateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteCurrencyPairController;
use App\Http\Controllers\FavoritePairsPageController;
use App\Http\Controllers\ProvidersPageController;
use App\Http\Controllers\WalletPageController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('dashboard/providers', ProvidersPageController::class)->name('dashboard.providers');
    Route::get('dashboard/wallet', WalletPageController::class)->name('dashboard.wallet');
    Route::get('dashboard/favorites', FavoritePairsPageController::class)->name('dashboard.favorites');
    Route::get('api/currency/options', CurrencyOptionsController::class)->name('api.currency.options');
    Route::get('api/currency/rates', CurrencyRateController::class)->name('api.currency.rates');
    Route::put('dashboard/preferences', [CurrencyPreferenceController::class, 'update'])->name('dashboard.preferences.update');
    Route::post('dashboard/favorites', [FavoriteCurrencyPairController::class, 'store'])->name('dashboard.favorites.store');
    Route::put('dashboard/favorites/{favoriteCurrencyPair}', [FavoriteCurrencyPairController::class, 'update'])->name('dashboard.favorites.update');
    Route::patch('dashboard/favorites/reorder', [FavoriteCurrencyPairController::class, 'reorder'])->name('dashboard.favorites.reorder');
    Route::delete('dashboard/favorites/{favoriteCurrencyPair}', [FavoriteCurrencyPairController::class, 'destroy'])->name('dashboard.favorites.destroy');
});

require __DIR__.'/settings.php';
