<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('first_name', 100)->nullable()->after('name');
            $table->string('middle_name', 100)->nullable()->after('first_name');
            $table->string('last_name', 100)->nullable()->after('middle_name');
            $table->string('phone_number', 20)->nullable()->after('email');
            $table->string('country_code', 2)->nullable()->after('phone_number');
        });

        DB::table('users')->orderBy('id')->eachById(function (object $user): void {
            $name = trim((string) $user->name);
            $parts = preg_split('/\s+/', $name) ?: [];
            $firstName = $parts[0] ?? null;
            $lastName = count($parts) > 1 ? array_pop($parts) : null;
            $middleName = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : null;

            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'first_name' => $firstName,
                    'middle_name' => $middleName,
                    'last_name' => $lastName,
                    'country_code' => 'US',
                ]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'phone_number',
                'country_code',
            ]);
        });
    }
};
