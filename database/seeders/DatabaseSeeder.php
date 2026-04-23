<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate([
            'email' => 'jeskintest@email.com',
        ], [
            'name' => 'Jeskin Villacarlos',
            'first_name' => 'Jeskin',
            'middle_name' => null,
            'last_name' => 'Villacarlos',
            'phone_number' => '+639171234567',
            'country_code' => 'PH',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);
    }
}
