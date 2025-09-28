<?php

namespace App\Models\Service;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\HasSearch;
use App\Traits\HasSorting;

class ServiceCategory extends Model
{
    use HasFactory, HasSearch, HasSorting;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    protected static function searchableColumns(): array
    {
        return [
            'name',
            'slug',
            'description',
        ];
    }

    /**
     * Relationships
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}


