import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import i18n from "@/i18n";
import GuestLayout from "@/Layouts/GuestLayout";
import { cn, trans } from "@/lib/utils";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };
    const dir = i18n.language === "en" ? "ltr" : "rtl";
    document.documentElement.setAttribute("dir", dir);

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <div className="flex items-center justify-center px-6 py-4 overflow-hidden bg-white sm:rounded-lg">
                <form
                    onSubmit={submit}
                    className="px-6 py-4 overflow-hidden border-gray-200 w-96"
                >
                    <div>
                        <InputLabel
                            htmlFor="email"
                            className="text-start"
                            value={trans("admin:Email")}
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full mt-1"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password"
                            value={trans("admin:Password")}
                            className="text-start"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full mt-1"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="text-sm text-gray-600 ms-2">
                                {trans("Remember_Me")}
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        {/* {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )} */}

                        <PrimaryButton className="ms-4" disabled={processing}>
                            {trans("Login")}
                        </PrimaryButton>
                    </div>
                </form>
                {/* <div className="flex flex-col items-center justify-center px-6 py-4 border-s w-96">
                    <img
                        src="/moflogo1.png"
                        className="w-40 rounded-md"
                        alt="Ministry of Finance Logo"
                    />
                    <div className="flex flex-col items-center justify-center mt-4">
                        <h2 className="text-lg font-bold">
                            {trans("app:Ministry_Of_Finance")}
                        </h2>
                        <h3 className="w-full font-semibold text-nowrap">
                            {trans("app:ICT_Directorate")}
                        </h3>
                        <h3 className="font-bold">
                            {trans("app:Systems_Department")}
                        </h3>
                    </div>
                </div> */}
            </div>
        </GuestLayout>
    );
}
