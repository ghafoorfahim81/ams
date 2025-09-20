<?php

namespace App\Models\Scopes;

use App\Models\HR\Directorate;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class DocumentUserScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = auth()->user();

        if (!$user) return;

        $userId = $user->id;
        $userDirectorateId = optional($user->employee)->directorate_id;

        // Global super admin (e.g. ministry-level) sees all
        if ($user->hasRole('super_admin') && !$userDirectorateId) {
            return;
        }

        // Directorate-level super admin
        if ($user->hasRole('super_admin') && $userDirectorateId) {
            // Get all related directorate IDs (current + children)
            $directorateIds = Directorate::where('parent_id', $userDirectorateId)
                ->orWhere('id', $userDirectorateId)
                ->pluck('id');

            $builder->whereHas('trackers', function ($query) use ($directorateIds) {
                $query->whereIn('sender_directorate_id', $directorateIds)
                    ->orWhereHas('receiverUser.employee', function ($q) use ($directorateIds) {
                        $q->whereIn('directorate_id', $directorateIds);
                    })
                    ->orWhereHas('creator.employee', function ($q) use ($directorateIds) {
                        $q->whereIn('directorate_id', $directorateIds);
                    });
            })->distinct();

            return;
        }

        // Normal user: see own created, received documents, or documents from same directorate
        $builder->where(function ($query) use ($userId, $userDirectorateId) {
            $query->where('documents.created_by', $userId)
                ->orWhereHas('trackers', function ($q) use ($userId) {
                    $q->where('receiver_user_id', $userId);
                });

            // Add condition for users in the same directorate
            if ($userDirectorateId) {
                $query->orWhereHas('creator.employee', function ($q) use ($userDirectorateId) {
                    $q->where('directorate_id', $userDirectorateId);
                });
            }
        })->distinct();
    }
}
