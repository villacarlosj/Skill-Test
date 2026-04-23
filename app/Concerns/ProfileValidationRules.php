<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'first_name' => $this->firstNameRules(),
            'middle_name' => $this->middleNameRules(),
            'last_name' => $this->lastNameRules(),
            'email' => $this->emailRules($userId),
            'phone_number' => $this->phoneNumberRules(),
            'country_code' => $this->countryCodeRules(),
        ];
    }

    /**
     * Normalize profile input so forgiving fields can still validate cleanly.
     *
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    protected function normalizeProfileInput(array $input): array
    {
        $firstName = trim((string) Arr::get($input, 'first_name', ''));
        $middleName = trim((string) Arr::get($input, 'middle_name', ''));
        $lastName = trim((string) Arr::get($input, 'last_name', ''));

        return [
            ...$input,
            'first_name' => $firstName,
            'middle_name' => $middleName === '' ? null : $middleName,
            'last_name' => $lastName,
            'phone_number' => $this->normalizePhoneNumber(Arr::get($input, 'phone_number')),
            'country_code' => Str::upper(trim((string) Arr::get($input, 'country_code', ''))),
            'name' => $this->composeFullName($firstName, $middleName, $lastName),
        ];
    }

    /**
     * Get the validation rules used to validate user first names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function firstNameRules(): array
    {
        return ['required', 'string', 'max:100'];
    }

    /**
     * Get the validation rules used to validate user middle names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function middleNameRules(): array
    {
        return ['nullable', 'string', 'max:100'];
    }

    /**
     * Get the validation rules used to validate user last names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function lastNameRules(): array
    {
        return ['required', 'string', 'max:100'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * Get the validation rules used to validate phone numbers.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function phoneNumberRules(): array
    {
        return ['required', 'string', 'min:7', 'max:20', 'regex:/^\+?[0-9]{7,15}$/'];
    }

    /**
     * Get the validation rules used to validate countries.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function countryCodeRules(): array
    {
        return ['required', 'string', Rule::in(array_keys(config('currency.countries', [])))];
    }

    protected function normalizePhoneNumber(mixed $phoneNumber): ?string
    {
        if (! is_string($phoneNumber)) {
            return null;
        }

        $trimmed = trim($phoneNumber);

        if ($trimmed === '') {
            return null;
        }

        $hasPlusPrefix = Str::startsWith($trimmed, '+');
        $digits = preg_replace('/\D+/', '', $trimmed);

        if (! is_string($digits) || $digits === '') {
            return null;
        }

        return $hasPlusPrefix ? '+'.$digits : $digits;
    }

    protected function composeFullName(string $firstName, string $middleName, string $lastName): string
    {
        return trim(collect([$firstName, $middleName, $lastName])->filter()->implode(' '));
    }
}
