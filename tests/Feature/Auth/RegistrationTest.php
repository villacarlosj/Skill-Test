<?php

use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'first_name' => 'Jeskin',
        'middle_name' => 'Sample',
        'last_name' => 'Villacarlos',
        'email' => 'test@example.com',
        'phone_number' => '+63 (917) 123-4567',
        'country_code' => 'PH',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = \App\Models\User::query()->firstWhere('email', 'test@example.com');

    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Jeskin Sample Villacarlos');
    expect($user->phone_number)->toBe('+639171234567');
    expect($user->country_code)->toBe('PH');
});
