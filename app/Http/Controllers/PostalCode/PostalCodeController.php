<?php

namespace App\Http\Controllers\PostalCode;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostalCode\PostalCodeStoreRequest;
use App\Http\Requests\PostalCode\PostalCodeUpdateRequest;
use App\Http\Resources\PostalCode\PostalCodeCollection;
use App\Http\Resources\PostalCode\PostalCodeResource;
use App\Models\PostalCode\PostalCode;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PostalCodeController extends Controller
{
    public function index(Request $request)
    {
        $postalCodes = PostalCode::search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Admin/PostalCodes/Index', [
            'postalCodes' => $postalCodes->toResourceCollection(),
        ]);
    }

    public function store(PostalCodeStoreRequest $request)
    {
        PostalCode::create($request->validated());
        return redirect()->back();
    }

    public function show(Request $request, PostalCode $postalCode)
    {
        return $postalCode->toResource();
    }

    public function update(PostalCodeUpdateRequest $request, PostalCode $postalCode)
    {
        $postalCode->update($request->validated());
        return redirect()->back();
    }

    public function destroy(Request $request, PostalCode $postalCode)
    {
        $postalCode->delete();
        return redirect()->back();
    }
}
