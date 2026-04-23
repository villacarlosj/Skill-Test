<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $normalizedInput = $this->normalizeProfileInput($input);

        Validator::make($normalizedInput, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $normalizedInput['name'],
            'first_name' => $normalizedInput['first_name'],
            'middle_name' => $normalizedInput['middle_name'],
            'last_name' => $normalizedInput['last_name'],
            'email' => $normalizedInput['email'],
            'phone_number' => $normalizedInput['phone_number'],
            'country_code' => $normalizedInput['country_code'],
            'password' => $normalizedInput['password'],
        ]);
    }
}
