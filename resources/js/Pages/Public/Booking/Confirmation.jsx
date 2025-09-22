import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Calendar, Users, QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { Button } from '@/Components/ui/button';

// Assuming appointment is passed as a prop from the controller
const Confirmation = ({ appointment, auth }) => {
    
    // Helper functions for formatting
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formatTime = (time) => time ? time.substring(0, 5) : 'N/A';

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Appointment Confirmed</h2>}>
            <Head title="Booking Confirmed" />
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card className="shadow-2xl border-green-400">
                        <CardHeader className="text-center bg-green-50">
                            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-3" />
                            <CardTitle className="text-3xl text-green-700">Booking Confirmed!</CardTitle>
                            <CardDescription className="text-lg text-gray-600">
                                Your appointment has been successfully scheduled.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            
                            <div className="text-center text-xl font-bold border-b pb-4">
                                Confirmation Code: <span className="text-indigo-600">{appointment.code}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date and Time */}
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-6 h-6 text-blue-500" />
                                    <div>
                                        <p className="font-semibold">Date:</p>
                                        <p>{formatDate(appointment.scheduled_date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <QrCode className="w-6 h-6 text-indigo-500" />
                                    <div>
                                        <p className="font-semibold">Service:</p>
                                        <p>{appointment.service.name}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Participants */}
                            <div>
                                <h3 className="font-bold flex items-center mb-2 text-gray-700">
                                    <Users className="w-5 h-5 mr-2" /> Participants:
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                    {appointment.participants.map((p, index) => (
                                        <li key={index}>
                                            {p.full_name} ({p.relationship})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <Separator />

                            <div className="text-center space-y-4 pt-4">
                                <p className="text-sm text-gray-500">
                                    A confirmation email with the required documents and QR code has been sent to your registered email address.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <Link href={route('dashboard')}>
                                        <Button variant="outline">Go to Dashboard</Button>
                                    </Link>
                                    <Link href={route('appointments.show', appointment.id)}>
                                        <Button>View Appointment Details</Button>
                                    </Link>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Confirmation;