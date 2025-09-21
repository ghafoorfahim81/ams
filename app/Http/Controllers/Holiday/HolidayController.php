<?php

namespace App\Http\Controllers\Holiday;

use App\Http\Controllers\Controller;
use App\Http\Requests\Holiday\HolidayStoreRequest;
use App\Http\Requests\Holiday\HolidayUpdateRequest;
use App\Models\Holiday\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index(Request $request)
    {
        $holidays = Holiday::search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Admin/Holidays/Index', [
            'holidays' => $holidays->toResourceCollection(),
        ]);
    }

    public function store(HolidayStoreRequest $request)
    {
        Holiday::create($request->validated());
        return redirect()->back();
    }

    public function show(Request $request, Holiday $holiday)
    {
        return $holiday->toResource();
    }

    public function update(HolidayUpdateRequest $request, Holiday $holiday)
    {
        $holiday->update($request->validated());
        return redirect()->back();
    }

    public function destroy(Request $request, Holiday $holiday)
    {
        $holiday->delete();
        return redirect()->back();
    }
}
