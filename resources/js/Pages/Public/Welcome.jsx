import React from 'react';
import { Link, Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from 'framer-motion';

function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center justify-center text-center max-w-4xl px-4 py-16 md:py-24"
            >
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
                >
                    Online Appointment Scheduling System
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl"
                >
                    A professional, user-friendly portal for booking appointments at your convenience. Our system is designed for a seamless and efficient experience.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, type: 'spring', stiffness: 100 }}
                    className="mt-12"
                >
                    <Link
                        href={route('book.create')}
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Book an Appointment
                        <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </Link>
                </motion.div>
                
                <div className="mt-16 text-gray-500 text-sm">
                    {auth.user ? (
                        <p>You are logged in. Feel free to book an appointment.</p>
                    ) : (
                        <p>You can book an appointment as a guest. <Link href={route('login')} className="font-medium text-blue-600 hover:underline">Or log in here</Link>.</p>
                    )}
                </div>
            </motion.div>
        </>
    );
}

Welcome.layout = page => <PublicLayout children={page} />;

export default Welcome;
