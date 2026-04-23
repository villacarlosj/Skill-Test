<?php

namespace Database\Factories;

use App\Models\FavoriteCurrencyPair;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FavoriteCurrencyPair>
 */
class FavoriteCurrencyPairFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'base_currency' => fake()->randomElement(['USD', 'EUR', 'GBP', 'JPY', 'AUD']),
            'quote_currency' => fake()->randomElement(['PHP', 'CAD', 'SGD', 'CHF', 'NZD']),
        ];
    }
}
