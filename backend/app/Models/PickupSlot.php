<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PickupSlot extends Model
{
    use HasFactory;

    protected $fillable = ['slot_time', 'max_orders', 'is_open'];

    protected function casts(): array
    {
        return ['max_orders' => 'integer', 'is_open' => 'boolean'];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
