<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Carbon\Carbon;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'mobile_number' => ['required', 'string', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'mobile_number' => $request->mobile_number,
            'password' => Hash::make($request->password),
        ]);

        // Generate and store OTP
        $otp_code = rand(100000, 999999);
        Otp::create([
            'user_id' => $user->id,
            'otp_code' => $otp_code,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // Store data in the session to be used on the next page
        session()->flash('otp_code', $otp_code);
        session()->put('mobile_number', $user->mobile_number);

        return redirect()->route('register.verify_otp');
    }

    /**
     * Show the OTP verification form (Inertia view).
     */
    public function showOtpVerificationForm(): \Inertia\Response
    {
        // Retrieve data from session and clear the flash data
        $mobile_number = session('mobile_number');
        $otp = session()->get('otp_code');

        if (!$mobile_number) {
            // If the user lands here without registering, redirect them back
            return redirect()->route('register');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'mobile_number' => $mobile_number,
            'otp' => $otp, // Pass the testing OTP to the frontend
        ]);
    }

    /**
     * Handle the OTP verification request.
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'digits:6'],
            'mobile_number' => ['required', 'string'],
        ]);

        $user = User::where('mobile_number', $request->mobile_number)->first();

        if (!$user) {
            return back()->withErrors(['otp' => 'User not found.']);
        }

        $otp = Otp::where('user_id', $user->id)
                  ->where('otp_code', $request->otp)
                  ->where('expires_at', '>', Carbon::now())
                  ->first();

        if (!$otp) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        }

        // Mark the user as verified
        $user->mobile_verified_at = Carbon::now();
        $user->save();

        // Delete the used OTP
        $otp->delete();

        // Log the user in and redirect
        Auth::login($user);
        event(new Registered($user));

        return redirect()->intended(route('dashboard', absolute: false));
    }
}