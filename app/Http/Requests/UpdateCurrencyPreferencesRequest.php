<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCurrencyPreferencesRequest extends FormRequest
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
            'amount' => ['nullable', 'numeric', 'min:0.01', 'max:100000000'],
            'baseCurrency' => ['nullable', 'string', Rule::in(array_keys(config('currency.supported')))],
            'quoteCurrency' => [
                'nullable',
                'string',
                'different:baseCurrency',
                Rule::in(array_keys(config('currency.supported'))),
            ],
            'recentConversions' => ['nullable', 'array', 'max:6'],
            'recentConversions.*.id' => ['required_with:recentConversions', 'string', 'max:80'],
            'recentConversions.*.baseCurrency' => ['required_with:recentConversions', 'string', Rule::in(array_keys(config('currency.supported')))],
            'recentConversions.*.quoteCurrency' => ['required_with:recentConversions', 'string', Rule::in(array_keys(config('currency.supported')))],
            'recentConversions.*.amount' => ['required_with:recentConversions', 'numeric', 'min:0.01', 'max:100000000'],
            'recentConversions.*.convertedAmount' => ['required_with:recentConversions', 'numeric', 'min:0'],
            'recentConversions.*.rate' => ['required_with:recentConversions', 'numeric', 'min:0'],
            'recentConversions.*.provider' => ['required_with:recentConversions', 'string', 'max:40'],
            'recentConversions.*.createdAt' => ['required_with:recentConversions', 'date'],
        ];
    }
}
