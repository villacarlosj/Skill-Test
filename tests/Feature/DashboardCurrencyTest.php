<?php

use App\Models\FavoriteCurrencyPair;
use App\Models\User;
use Illuminate\Support\Facades\Http;

test('guests are redirected away from the dashboard', function () {
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
});

test('dashboard shows favorites and preferences can be updated through cookies', function () {
    $user = User::factory()->create([
        'country_code' => 'PH',
    ]);

    FavoriteCurrencyPair::factory()->for($user)->create([
        'base_currency' => 'USD',
        'quote_currency' => 'PHP',
    ]);

    $dashboardResponse = $this
        ->actingAs($user)
        ->get(route('dashboard'));

    $dashboardResponse
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('preferences.amount', 1000)
            ->where('preferences.baseCurrency', 'PHP')
            ->where('preferences.quoteCurrency', 'USD')
            ->has('favorites', 1)
            ->where('favorites.0.baseCurrency', 'USD')
            ->where('favorites.0.quoteCurrency', 'PHP'));

    $preferencesResponse = $this
        ->actingAs($user)
        ->putJson(route('dashboard.preferences.update'), [
            'amount' => 2500,
            'baseCurrency' => 'EUR',
            'quoteCurrency' => 'JPY',
            'recentConversions' => [],
        ]);

    $preferencesResponse
        ->assertOk()
        ->assertCookie(config('currency.cookie.name'))
        ->assertJsonPath('preferences.amount', 2500)
        ->assertJsonPath('preferences.baseCurrency', 'EUR')
        ->assertJsonPath('preferences.quoteCurrency', 'JPY');
});

test('currency rates are fetched through the proxy endpoint', function () {
    Http::fake([
        'https://api.frankfurter.dev/*' => Http::response([
            'amount' => 100,
            'base' => 'USD',
            'date' => '2026-04-23',
            'rates' => [
                'PHP' => 5750,
            ],
        ]),
    ]);

    $response = $this
        ->actingAs(User::factory()->create())
        ->getJson(route('api.currency.rates', [
            'amount' => 100,
            'from' => 'USD',
            'to' => 'PHP',
        ]));

    $response
        ->assertOk()
        ->assertJson([
            'baseCurrency' => 'USD',
            'quoteCurrency' => 'PHP',
            'amount' => 100,
            'convertedAmount' => 5750,
            'rate' => 57.5,
            'date' => '2026-04-23',
        ]);
});

test('favorites can be created and deleted by the owning user', function () {
    $user = User::factory()->create();

    $favoriteResponse = $this
        ->actingAs($user)
        ->postJson(route('dashboard.favorites.store'), [
            'baseCurrency' => 'USD',
            'quoteCurrency' => 'EUR',
        ]);

    $favoriteResponse
        ->assertCreated()
        ->assertJsonPath('favorite.baseCurrency', 'USD')
        ->assertJsonPath('favorite.quoteCurrency', 'EUR');

    $favoriteId = $favoriteResponse->json('favorite.id');

    $this->assertDatabaseHas('favorite_currency_pairs', [
        'id' => $favoriteId,
        'user_id' => $user->id,
        'base_currency' => 'USD',
        'quote_currency' => 'EUR',
    ]);

    $this
        ->actingAs($user)
        ->delete(route('dashboard.favorites.destroy', $favoriteId))
        ->assertNoContent();

    $this->assertDatabaseMissing('favorite_currency_pairs', [
        'id' => $favoriteId,
    ]);
});
