<?php

namespace App\Models\Document;

use App\Models\Administration\DocumentType;
use App\Models\Administration\SecurityLevel;
use App\Models\Scopes\DocumentUserScope;
use App\Traits\HasSearch;
use App\Traits\HasSorting;
use App\Traits\HasUserAuditable;
use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Morilog\Jalali\Jalalian;
use Spatie\Permission\Traits\HasRoles;

class Document extends Model
{
    use HasFactory, HasRoles, HasSearch, HasSorting, HasUserAuditable, HasUserTracking, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected static function booted()
    {
        static::addGlobalScope(new DocumentUserScope);
    }

    protected $fillable = [
        'title',
        'remark',
        'created_by',
        'created_at',
        'updated_by',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    protected function createdAt(): Attribute
    {
        $currentRoute = Route::current();
        $isEditRoute = $currentRoute && $currentRoute->getName() === 'documents.edit';

        return Attribute::make(
            get: fn($value) => $isEditRoute
                ? $value
                : Jalalian::fromDateTime($value),
        );
    }

    protected static function searchableColumns(): array
    {
        return [
            'title',
            'remark',
        ];
    }

    public function trackers()
    {
        return $this->hasMany(Tracker::class);
    }

    public function latestTracker()
    {
        return $this->trackers()->one()->latestOfMany();
    }

    public function oldestTracker()
    {
        return $this->trackers()->one()->oldestOfMany();
    }

    public function getDocumentByType($type = null, $filter = null)
    {
        $dateFilter = $filter ?? now()->toDateString();
        $column = 'name_' . app()->getLocale();

        $query = SecurityLevel::crossJoin('document_types')
            ->leftJoin('trackers', function ($join) use ($dateFilter): void {
                $join->on('security_levels.id', '=', 'trackers.security_level_id')
                    ->on('document_types.id', '=', 'trackers.document_type_id')
                    ->where('trackers.created_at', '>=', $dateFilter);
            })
            ->where('document_types.slug', $type)
            ->selectRaw("security_levels.{$column} as securityLevel, COUNT(trackers.id) as total_count, document_types.{$column} as docTypeName")
            ->groupBy('security_levels.id', "document_types.{$column}");

        return $query->get();
    }

    public function getSaderaAndWareda($filter = null)
    {
        $today = now()->toDateString();
        $dateFilter = $filter ?: $today;
        $column = 'name_' . app()->getLocale();

        return DocumentType::leftJoin(DB::raw("(SELECT document_type_id,
                SUM(CASE WHEN in_num IS NOT NULL THEN 1 ELSE 0 END) as wareda,
                SUM(CASE WHEN out_num IS NOT NULL THEN 1 ELSE 0 END) as sadera
                FROM trackers
                WHERE created_at >= '$dateFilter'
                GROUP BY document_type_id) AS tracker_counts"), function ($join): void {
            $join->on('document_types.id', '=', 'tracker_counts.document_type_id');
        })
            ->selectRaw("document_types.{$column} as docType,
                 COALESCE(tracker_counts.wareda, 0) as wareda,
                 COALESCE(tracker_counts.sadera, 0) as sadera")
            ->orderBy('document_types.id', 'asc')
            ->get();
    }

    public function action()
    {
        return $this->hasOne(Action::class);
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
