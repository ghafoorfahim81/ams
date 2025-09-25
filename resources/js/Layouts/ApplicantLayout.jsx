import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faCalendarPlus, faFileLines, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Separator } from "@/Components/ui/separator";

export default function ApplicantLayout({ user, header, children }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans antialiased text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="bg-white dark:bg-gray-800 shadow-lg py-4 px-6 md:px-12 sticky top-0 w-full z-50 rounded-b-xl"
            >
                <nav className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        {/* Corrected: This now links to the new applicant dashboard route */}
                        <Link href={route('my-dashboard')} className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                                Appointment Portal
                            </h1>
                        </Link>
                    </div>
                    <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
                        {/* Corrected: This now links to the new applicant dashboard route */}
                        <Link href={route('my-dashboard')} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 ease-in-out flex items-center gap-2">
                            <FontAwesomeIcon icon={faGauge} className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Separator orientation="vertical" className="h-4" />
                        <Link href={route('book.create')} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 ease-in-out flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarPlus} className="w-4 h-4" />
                            Book Appointment
                        </Link>
                        <Separator orientation="vertical" className="h-4" />
                        {/* Corrected: This now links to the new 'my-appointments' route */}
                        <Link href={route('appointments.index')} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 ease-in-out flex items-center gap-2">
                            <FontAwesomeIcon icon={faFileLines} className="w-4 h-4" />
                            My Appointments
                        </Link>
                        <Separator orientation="vertical" className="h-4" />
                        <Link href={route('profile.edit')} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 ease-in-out flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                            Profile
                        </Link>
                        <Separator orientation="vertical" className="h-4" />
                        <Link method="post" as="button" href={route('logout')} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition duration-150 ease-in-out flex items-center gap-2">
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                            Log Out
                        </Link>
                    </div>
                </nav>
            </motion.header>

            {/* Header Content for the page */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 dark:bg-gray-900 text-white py-6 mt-auto">
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