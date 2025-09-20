<?php

namespace App\Http\Controllers\Administration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administration\DocumentTypeStoreRequest;
use App\Http\Requests\Administration\DocumentTypeUpdateRequest;
use App\Models\Administration\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DocumentTypeController extends Controller
{
    public function index(Request $request)
    {

        $documentTypes = DocumentType::search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Administration/DocumentTypes/Index', [
            'documentTypes' => $documentTypes->toResourceCollection(),
        ]);
    }

    public function store(DocumentTypeStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['name_en']);
        DocumentType::create($validated);

        return redirect()->back();
    }

    public function show(Request $request, DocumentType $documentType): \App\Http\Resources\Administration\DocumentTypeResource
    {
        return $documentType->toResource();
    }

    public function update(DocumentTypeUpdateRequest $request, DocumentType $documentType)
    {
        $validated = $request->validated();
        //        $validated['slug'] = Str::slug($validated['name_en']);
        $documentType->update($validated);

        return redirect()->back();

    }

    public function destroy(Request $request, DocumentType $documentType)
    {
        $documentType->delete();

        return redirect()->back();

    }
}
