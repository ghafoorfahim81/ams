<?php

namespace App\Http\Controllers;

use App\Models\User;

class DirectorateController extends Controller
{
    public function getUsersByDirectorate($directorateId)
    {
        $users = User::whereHas('employee', function ($query) use ($directorateId): void {
            $query->where('directorate_id', $directorateId);
        })->select('id', 'user_name as name')->get();

        return response()->json($users);
    }
}
