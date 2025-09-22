import React from 'react';
// *** FINALIZED FIX: Alias + Explicit .jsx Extension ***
import { Button } from '@/Components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card.jsx';
import { Separator } from '@/Components/ui/separator.jsx';
// *************************************************
import { Loader2, Calendar, Clock, Users, FileText } from 'lucide-react';

const ReviewAndConfirm = ({ data, service, slot, onSubmit, onBack, processing, errors }) => {
    
    if (!service || !slot) {
        return <p className="text-red-500">Error: Service or Slot details are missing. Please go back.</p>;
    }

    const formatTime = (time) => time ? time.substring(0, 5) : 'N/A';
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div>
            {/* Summary Card */}
            <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center text-blue-800">
                        <FileText className="w-5 h-5 mr-2" /> Booking Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Service Details */}
                    <div className="border-b pb-2">
                        <h4 className="font-semibold">Service:</h4>
                        <p className="text-lg font-bold text-gray-800">{service.name}</p>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold flex items-center"><Calendar className="w-4 h-4 mr-2" /> Date:</h4>
                            <p>{formatDate(slot.scheduled_date)}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold flex items-center"><Clock className="w-4 h-4 mr-2" /> Time:</h4>
                            <p>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Participants List */}
                    <div>
                        <h4 className="font-semibold flex items-center mb-2"><Users className="w-4 h-4 mr-2" /> Participants: ({data.participants.length})</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {data.participants.map((p, index) => (
                                <li key={index}>
                                    **{p.full_name}** ({p.relation}) - ID: {p.identification_number}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Notes */}
                    {data.notes && (
                        <div>
                            <h4 className="font-semibold">Notes:</h4>
                            <p className="italic text-sm">{data.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Final Check and Submit Button */}
            <p className="text-sm text-center mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                By clicking "Confirm Appointment," you agree to the terms of service and confirm all details are correct.
            </p>

            {/* Server Error Display (for non-field errors like limits/postal code) */}
            {Object.keys(errors).length > 0 && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                    <p className="font-bold">Booking Blocked:</p>
                    {Object.values(errors).map((error, index) => (
                        // Only show non-field specific errors here, field errors should be on the previous steps
                        <p key={index} className="text-sm">{error}</p>
                    ))}
                </div>
            )}
            
            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
                    &larr; Back to Participants
                </Button>
                <Button onClick={onSubmit} disabled={processing} className="bg-green-600 hover:bg-green-700">
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming...
                        </>
                    ) : (
                        'Confirm Appointment'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ReviewAndConfirm;