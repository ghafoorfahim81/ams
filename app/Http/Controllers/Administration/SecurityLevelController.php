<?php

namespace App\Http\Controllers\Administration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administration\SecurityLevelStoreRequest;
use App\Http\Requests\Administration\SecurityLevelUpdateRequest;
use App\Models\Administration\SecurityLevel;
use Illuminate\Http\Request;

class SecurityLevelController extends Controller
{
    public function index(Request $request)
    {
        $securityLevels = SecurityLevel::search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Administration/SecurityLevels/Index', [
            'securityLevels' => $securityLevels->toResourceCollection(),
        ]);
    }

    public function store(SecurityLevelStoreRequest $request)
    {
        SecurityLevel::create($request->validated());

        return redirect()->back();

    }

    public function show(Request $request, SecurityLevel $securityLevel): \App\Http\Resources\Administration\SecurityLevelResource
    {
        return $securityLevel->toResource();
    }

    public function update(SecurityLevelUpdateRequest $request, SecurityLevel $securityLevel)
    {
        $securityLevel->update($request->validated());

        return redirect()->back();

    }

    public function destroy(Request $request, SecurityLevel $securityLevel)
    {
        $securityLevel->delete();

        return redirect()->back();

    }
}
