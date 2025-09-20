<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function switch(Request $request)
    {
        $locale = $request->input('locale');

        if (! in_array($locale, ['en', 'fa', 'ps'])) {
            return response()->json(['message' => 'Invalid locale'], 400);
        }

        Session::put('locale', $locale);
        App::setLocale($locale);

        return null;
    }

    public function getLocale(Request $request)
    {
        return response()->json([
            'locale' => app()->getLocale(),
        ]);
    }
}
