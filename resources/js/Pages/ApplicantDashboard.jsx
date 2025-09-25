import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';
import Header from '@/Components/Header';

export default function ApplicantDashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <ApplicantLayout
            header={
                <Header text="My Dashboard" />
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Welcome, {user.full_name || user.email}!</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            This is your personal dashboard. From here, you can book new appointments, view your existing ones, and manage your profile.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <Link href={route('book.create')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
                                Book a New Appointment
                            </Link>
                            <Link href={route('appointments.index')} className="border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
                                View My Appointments
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ApplicantLayout>
    );
}