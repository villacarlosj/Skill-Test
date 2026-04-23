<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFavoriteCurrencyPairRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
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
        ];
    }
}
