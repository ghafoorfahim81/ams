import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        email: '',
        mobile_number: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
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
                <Head title="Register" />
                <div className="flex flex-col items-center text-center p-4">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight animate-fade-in-down">
                        GET INTO
                    </h2>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto animate-fade-in-up delay-100">
                        {/* Create your account and start your journey with us. */}
                    </p>
                </div>

                <form onSubmit={submit} className="mt-10 space-y-6">
                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="full_name" value="Full Name" />
                            <TextInput
                                id="full_name"
                                name="full_name"
                                value={data.full_name}
                                className="mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('full_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.full_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="mobile_number" value="Mobile Number" />
                            <TextInput
                                id="mobile_number"
                                type="tel"
                                name="mobile_number"
                                value={data.mobile_number}
                                className="mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                autoComplete="tel"
                                onChange={(e) => setData('mobile_number', e.target.value)}
                                required
                            />
                            <InputError message={errors.mobile_number} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full rounded-2xl border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <Link
                            href={route('login')}
                            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton className="w-full sm:w-auto rounded-full px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-indigo-700" disabled={processing}>
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}