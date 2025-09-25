import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            full_name: user.full_name,
            email: user.email,
            mobile_number: user.mobile_number,
            address: user.address,
            postal_code: user.postal_code, // Added postal_code based on SRS
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information, email address, and other contact details.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name Field */}
                    <div>
                        <InputLabel htmlFor="full_name" value="Full Name" />
                        <TextInput
                            id="full_name"
                            className="mt-1 block w-full"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            required
                            autoComplete="full_name"
                        />
                        <InputError className="mt-2" message={errors.full_name} />
                    </div>

                    {/* Email Field */}
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mobile Number Field */}
                    <div>
                        <InputLabel htmlFor="mobile_number" value="Mobile Number" />
                        <TextInput
                            id="mobile_number"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.mobile_number}
                            onChange={(e) => setData('mobile_number', e.target.value)}
                            required
                            autoComplete="tel"
                        />
                        <InputError className="mt-2" message={errors.mobile_number} />
                    </div>
                    
                    {/* Postal Code Field */}
                    <div>
                        <InputLabel htmlFor="postal_code" value="Postal Code" />
                        <TextInput
                            id="postal_code"
                            className="mt-1 block w-full"
                            value={data.postal_code}
                            onChange={(e) => setData('postal_code', e.target.value)}
                            autoComplete="postal-code"
                        />
                        <InputError className="mt-2" message={errors.postal_code} />
                    </div>
                </div>

                {/* Postal Address Field */}
                <div>
                    <InputLabel htmlFor="address" value="Postal Address" />
                    <TextInput
                        id="address"
                        className="mt-1 block w-full"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        autoComplete="street-address"
                    />
                    <InputError className="mt-2" message={errors.address} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
