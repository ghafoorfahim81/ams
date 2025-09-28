<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\ServiceCategoryStoreRequest;
use App\Http\Requests\Service\ServiceCategoryUpdateRequest;
use App\Http\Resources\Service\ServiceCategoryResource;
use App\Models\Service\ServiceCategory;
use Illuminate\Http\Request;

class ServiceCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = ServiceCategory::search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Admin/ServiceCategories/Index', [
            'serviceCategories' => $categories->toResourceCollection(),
        ]);
    }

    public function store(ServiceCategoryStoreRequest $request)
    {
        ServiceCategory::create($request->validated());
        return redirect()->back();
    }

    public function show(Request $request, ServiceCategory $serviceCategory)
    {
        return $serviceCategory->toResource(ServiceCategoryResource::class);
    }

    public function update(ServiceCategoryUpdateRequest $request, ServiceCategory $serviceCategory)
    {
        $serviceCategory->update($request->validated());
        return redirect()->back();
    }

    public function destroy(Request $request, ServiceCategory $serviceCategory)
    {
        $serviceCategory->delete();
        return redirect()->back();
    }
}


