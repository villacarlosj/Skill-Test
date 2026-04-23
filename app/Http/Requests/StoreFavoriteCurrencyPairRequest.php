<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFavoriteCurrencyPairRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'baseCurrency' => ['required', 'string', Rule::in(array_keys(config('currency.supported')))],
            'quoteCurrency' => [
                'required',
                'string',
                'different:baseCurrency',
                Rule::in(array_keys(config('currency.supported'))),
            ],
            'nickname'  => ['nullable', 'string', 'max:60'],
            'savedRate' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
