<?php

namespace App\Models\Document;

use App\Enums\FollowupType;
use App\Enums\Status;
use App\Enums\Type;
use App\Models\Administration\ExternalOrganization;
use App\Models\HR\Directorate;
use App\Models\User;
use App\Traits\HasSearch;
use App\Traits\HasSorting;
use App\Traits\HasUserAuditable;
use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Tracker extends Model
{
    use HasFactory, HasRoles, HasSearch, HasSorting, HasUserAuditable, HasUserTracking, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'document_id',
        'sender_directorate_id',
        'receiver_user_id',
        'status',
        'document_type_id',
        'in_num',
        'in_date',
        'out_num',
        'out_date',
        'type',
        'inout_flag',
        'request_deadline',
        'focal_point_name',
        'focal_point_phone',
        'conclusion',
        'actions',
        'security_level_id',
        'followup_type',
        'created_at',
        'created_by',
        'updated_by',
    ];


    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'status' => Status::class,
        'type' => Type::class,
        'followup_type' => FollowupType::class,
        'document_id' => 'integer',
        'sender_directorate_id' => 'integer',
        'receiver_user_id' => 'integer',
        'document_type_id' => 'integer',
        'in_date' => 'date',
        'out_date' => 'date',
        'security_level_id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function senderDirectorate(): BelongsTo
    {
        return $this->belongsTo(Directorate::class);
    }

    public function externalOrganizationSender(): BelongsTo
    {
        return $this->belongsTo(ExternalOrganization::class, 'sender_directorate_id');
    }

    public function externalOrganizationReceiver(): BelongsTo
    {
        return $this->belongsTo(ExternalOrganization::class, 'receiver_directorate_id');
    }


    public function receiverUser(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
    public function senderUser()
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }



    public function documentType(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Administration\DocumentType::class);
    }

    public function securityLevel(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Administration\SecurityLevel::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
