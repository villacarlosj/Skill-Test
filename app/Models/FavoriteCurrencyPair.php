<?php

namespace App\Models;

use Database\Factories\FavoriteCurrencyPairFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['base_currency', 'quote_currency', 'user_id', 'nickname', 'saved_rate', 'sort_order'])]
class FavoriteCurrencyPair extends Model
{
    /** @use HasFactory<FavoriteCurrencyPairFactory> */
    use HasFactory;

    protected $casts = [
        'saved_rate'  => 'float',
        'sort_order'  => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
