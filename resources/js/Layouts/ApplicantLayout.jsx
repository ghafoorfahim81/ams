import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

// The Separator component is included here to resolve the compilation error.
const Separator = ({ orientation, className }) => {
    const isVertical = orientation === "vertical";
    const baseClasses = "bg-gray-200";
    const orientationClasses = isVertical ? "w-px" : "h-px";
    return <div className={`${baseClasses} ${orientationClasses} ${className}`} />;
};

export default function ApplicantLayout({ user, header, children }) {
    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="bg-white shadow-lg py-4 px-6 md:px-12 sticky top-0 w-full z-50 rounded-b-xl"
            >
                <nav className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <Link href={route('dashboard')} className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                                Appointment Portal
                            </h1>
                        </Link>
                    </div>
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <Link href={route('book.create')} className="text-sm font-medium text-gray-500 hover:text-blue-600 transition duration-150 ease-in-out">
                            Book an Appointment
                        </Link>
                        <Separator orientation="vertical" className="h-4 mx-4" />
                        <Link href={route('profile.edit')} className="text-sm font-medium text-gray-500 hover:text-blue-600 transition duration-150 ease-in-out">
                            Profile
                        </Link>
                        <Separator orientation="vertical" className="h-4 mx-4" />
                        <Link method="post" as="button" href={route('logout')} className="text-sm font-medium text-gray-500 hover:text-red-600 transition duration-150 ease-in-out">
                            Log Out
                        </Link>
                    </div>
                </nav>
            </motion.header>

            {/* Header Content for the page */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-sm">
                    &copy; {new Date().getFullYear()} Appointment Portal. All Rights Reserved.
                    <p className="mt-2 text-gray-400">
                        Designed for a seamless booking experience.
                    </p>
                </div>
            </footer>
        </div>
    );
}
