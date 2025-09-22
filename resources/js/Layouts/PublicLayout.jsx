import React from 'react';
import { motion } from 'framer-motion';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900">
            {/* Header */}
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="bg-white shadow-lg py-4 px-6 md:px-12 top-0 sticky w-full z-50 rounded-b-xl"
            >
                <nav className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                            Appointment Portal
                        </h1>
                    </div>
                    {/* Placeholder for future navigation, if needed */}
                </nav>
            </motion.header>

            {/* Main Content Area */}
            <main className="pt-24 pb-16 flex flex-col items-center">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-sm">
                    &copy; {new Date().getFullYear()} Appointment Portal. All Rights Reserved.
                    <p className="mt-2 text-gray-400">
                        Designed with care for a seamless booking experience.
                    </p>
                </div>
            </footer>
        </div>
    );
}