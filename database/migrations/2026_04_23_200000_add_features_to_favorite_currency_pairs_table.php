<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('favorite_currency_pairs', function (Blueprint $table) {
            $table->string('nickname', 60)->nullable()->after('quote_currency');
            $table->decimal('saved_rate', 18, 8)->nullable()->after('nickname');
            $table->unsignedInteger('sort_order')->default(0)->after('saved_rate');
        });
    }

    public function down(): void
    {
        Schema::table('favorite_currency_pairs', function (Blueprint $table) {
            $table->dropColumn(['nickname', 'saved_rate', 'sort_order']);
        });
    }
};
