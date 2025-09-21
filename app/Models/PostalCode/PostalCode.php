<?php

namespace App\Models\PostalCode;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasSearch;
use App\Traits\HasSorting;

class PostalCode extends Model
{
    use HasFactory, HasSearch, HasSorting;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'region_name',
        'is_permitted',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'is_permitted' => 'boolean',
        ];
    }

    protected static function searchableColumns(): array
    {
        return [
            'code',
            'region_name',
        ];
    }
}
