<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

class SearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $locale = app()->getLocale();
        $query = $request->q;
        $resource = $request->resource;

        $allowedResources = ['organizations', 'directorates', 'employees', 'external_organizations'];

        if (! in_array($resource, $allowedResources)) {
            throw ValidationException::withMessages(['resource' => 'Invalid resource.']);
        }

        if (! Schema::hasTable($resource)) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        try {
            $searchColumn = $resource === 'directorates' ? "name_{$locale}" : 'name';

            $items = DB::table($resource)
                ->where($searchColumn, 'like', "%{$query}%")
                ->take(200)
                ->get();

            return $items->map(fn($item): array => [
                'id' => $item->id,
                'name' => $resource === 'directorates'
                    ? $item->{"name_{$locale}"}
                    : ($resource === 'employees'
                        ? "{$item->name} {$item->last_name}"
                        : $item->name),
            ]);
        } catch (\Exception) {
            return response()->json(['error' => 'Error processing request'], 500);
        }
    }
}
