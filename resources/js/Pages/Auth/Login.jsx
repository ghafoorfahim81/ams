import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import { trans } from '@/lib/utils';
import i18n from '@/i18n';

// Inlined SVG for the User Icon
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const dir = i18n.language === "en" ? "ltr" : "rtl";
    useEffect(() => {
        document.documentElement.setAttribute("dir", dir);
    }, [dir]);

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 text-center">
                    {status}
                </div>
            )}

            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4 shadow-sm">
                            <UserIcon />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight">
                            {trans("Welcome Back")}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 max-w-md mx-auto">
                            {trans("Sign in to access your appointment dashboard.")}
                        </p>
                    </div>

                    <form onSubmit={submit} className="mt-10 space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700"
                                value={trans("admin:Email")}
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2 text-xs text-red-600" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700"
                                value={trans("admin:Password")}
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                                    autoComplete="current-password"
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2 text-xs text-red-600" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-colors duration-200"
                                />
                                <span className="text-sm text-gray-900 ml-2">
                                    {trans("Remember_Me")}
                                </span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="font-medium text-blue-600 hover:text-blue-500 text-sm transition-colors duration-200"
                                >
                                    {trans("Forgot your password?")}
                                </Link>
                            )}
                        </div>

                        <div>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                {processing ? trans("Signing in...") : trans("Login")}
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            {trans("Don't have an account?")} {' '}
                            <Link href={route("register")} className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                {trans("Create a new account")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

