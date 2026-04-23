<?php

return [
    'cookie' => [
        'name' => 'currency_preferences',
        'minutes' => 60 * 24 * 30,
    ],

    'defaults' => [
        'amount' => 1000,
        'baseCurrency' => 'USD',
        'quoteCurrency' => 'PHP',
        'recentConversions' => [],
    ],

    'countries' => [
        'AU' => ['name' => 'Australia', 'currency' => 'AUD', 'quoteCurrency' => 'USD'],
        'CA' => ['name' => 'Canada', 'currency' => 'CAD', 'quoteCurrency' => 'USD'],
        'CH' => ['name' => 'Switzerland', 'currency' => 'CHF', 'quoteCurrency' => 'EUR'],
        'CN' => ['name' => 'China', 'currency' => 'CNY', 'quoteCurrency' => 'USD'],
        'DE' => ['name' => 'Germany', 'currency' => 'EUR', 'quoteCurrency' => 'USD'],
        'FR' => ['name' => 'France', 'currency' => 'EUR', 'quoteCurrency' => 'USD'],
        'GB' => ['name' => 'United Kingdom', 'currency' => 'GBP', 'quoteCurrency' => 'USD'],
        'HK' => ['name' => 'Hong Kong', 'currency' => 'HKD', 'quoteCurrency' => 'USD'],
        'JP' => ['name' => 'Japan', 'currency' => 'JPY', 'quoteCurrency' => 'USD'],
        'NZ' => ['name' => 'New Zealand', 'currency' => 'NZD', 'quoteCurrency' => 'AUD'],
        'PH' => ['name' => 'Philippines', 'currency' => 'PHP', 'quoteCurrency' => 'USD'],
        'SG' => ['name' => 'Singapore', 'currency' => 'SGD', 'quoteCurrency' => 'USD'],
        'TH' => ['name' => 'Thailand', 'currency' => 'THB', 'quoteCurrency' => 'USD'],
        'US' => ['name' => 'United States', 'currency' => 'USD', 'quoteCurrency' => 'PHP'],
    ],

    'supported' => [
        'AUD' => ['name' => 'Australian Dollar', 'symbol' => 'A$'],
        'CAD' => ['name' => 'Canadian Dollar', 'symbol' => 'C$'],
        'CHF' => ['name' => 'Swiss Franc', 'symbol' => 'CHF'],
        'CNY' => ['name' => 'Chinese Yuan', 'symbol' => 'CNY'],
        'EUR' => ['name' => 'Euro', 'symbol' => 'EUR'],
        'GBP' => ['name' => 'British Pound', 'symbol' => 'GBP'],
        'HKD' => ['name' => 'Hong Kong Dollar', 'symbol' => 'HK$'],
        'JPY' => ['name' => 'Japanese Yen', 'symbol' => 'JPY'],
        'NZD' => ['name' => 'New Zealand Dollar', 'symbol' => 'NZ$'],
        'PHP' => ['name' => 'Philippine Peso', 'symbol' => 'PHP'],
        'SGD' => ['name' => 'Singapore Dollar', 'symbol' => 'S$'],
        'THB' => ['name' => 'Thai Baht', 'symbol' => 'THB'],
        'USD' => ['name' => 'US Dollar', 'symbol' => '$'],
    ],
];
