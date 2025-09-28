<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\ServiceStoreRequest;
use App\Http\Requests\Service\ServiceUpdateRequest;
use App\Http\Resources\Service\ServiceCollection;
use App\Http\Resources\Service\ServiceResource;
use App\Models\Service\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $services = Service::with('serviceCategory')
            ->search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Admin/Services/Index', [
            'services' => $services->toResourceCollection(),
        ]);
    }

    public function store(ServiceStoreRequest $request)
    {
        $service = Service::create($request->validated());
        return redirect()->back();
    }

    public function show(Request $request, Service $service)
    {
        return $service->load('serviceCategory')->toResource(ServiceResource::class);
    }

    public function update(ServiceUpdateRequest $request, Service $service)
    {
        $service->update($request->validated());

        return redirect()->back();
    }

    public function destroy(Request $request, Service $service)
    {
        $service->delete();

        return redirect()->back();
    }
}
