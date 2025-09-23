import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function VerifyOtp({ mobile_number, errors, otp }) {
    const { data, setData, post, processing } = useForm({
        otp: '',
        mobile_number: mobile_number, // Passed from the session by the controller
    });

    const submit = (e) => {
        e.preventDefault();
        // The fix: Using the correct named route 'verify.otp'
        post(route('verify.otp'));
    };

    return (
        <div className="relative min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 overflow-hidden font-sans">
            {/* Background elements with a subtle gradient and a noise pattern */}
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 z-0">
                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 opacity-80 animate-pulse-subtle"></div>
                <div className="absolute inset-0 z-10 opacity-5 dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')]"></div>
            </div>

            {/* The main content container with a glass-like effect */}
            <div className="relative z-10 w-full sm:max-w-md mt-6 px-8 py-8 bg-white/50 dark:bg-gray-800/50 backdrop-filter backdrop-blur-lg shadow-3xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 transform hover:scale-[1.01]">
                <Head title="Verify OTP" />

                <div className="flex flex-col items-center text-center p-4">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight animate-fade-in-down">
                        Verify Your Account
                    </h2>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto animate-fade-in-up delay-100">
                        A **One-Time Password (OTP)** has been sent to your mobile number. Please enter it below to verify your account.
                    </p>
                </div>

                {/* Optional: The test OTP block is now styled to be more distinct */}
                {otp && (
                    <div className="mb-6 font-medium text-sm text-blue-600 dark:text-blue-400 text-center p-4 bg-blue-100 dark:bg-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-700 shadow-md transition-all duration-300 transform hover:scale-105">
                        <p>For testing, your OTP is:</p>
                        <strong className="text-2xl font-bold tracking-widest text-blue-800 dark:text-blue-200">{otp}</strong>
                    </div>
                )}

                <form onSubmit={submit} className="mt-8 space-y-6">
                    <div>
                        <InputLabel htmlFor="otp" value="Enter OTP" />
                        <TextInput
                            id="otp"
                            type="text"
                            name="otp"
                            value={data.otp}
                            className="mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg font-bold tracking-widest transition-colors duration-200"
                            onChange={(e) => setData('otp', e.target.value)}
                            required
                            autoFocus
                        />
                        <InputError message={errors.otp} className="mt-2" />
                    </div>

                    <input type="hidden" name="mobile_number" value={data.mobile_number} />

                    <div className="flex items-center justify-end mt-6">
                        <PrimaryButton className="w-full justify-center rounded-full px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-indigo-700" disabled={processing}>
                            {processing ? 'Verifying...' : 'Verify'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}