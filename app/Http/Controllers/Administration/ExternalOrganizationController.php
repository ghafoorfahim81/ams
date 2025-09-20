<?php

namespace App\Http\Controllers\Administration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administration\ExternalOrganizationStoreRequest;
use App\Http\Requests\Administration\ExternalOrganizationUpdateRequest;
use App\Models\Administration\ExternalOrganization;
use Illuminate\Http\Request;

class ExternalOrganizationController extends Controller
{
    public function index(Request $request)
    {
        $externalOrganizations = ExternalOrganization::search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Administration/ExternalOrganization/Index', [
            'externalOrganizations' => $externalOrganizations->toResourceCollection(),
        ]);
    }

    public function store(ExternalOrganizationStoreRequest $request)
    {
        ExternalOrganization::create($request->validated());

        return redirect()->back();

    }

    public function show(Request $request, ExternalOrganization $externalOrganization): \App\Http\Resources\Administration\ExternalOrganizationResource
    {
        return $externalOrganization->toResource();
    }

    public function update(ExternalOrganizationUpdateRequest $request, ExternalOrganization $externalOrganization)
    {
        $externalOrganization->update($request->validated());

        return redirect()->back();

    }

    public function destroy(Request $request, ExternalOrganization $externalOrganization)
    {
        $externalOrganization->delete();

        return redirect()->back();
    }
}
