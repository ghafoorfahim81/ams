import React, { useState } from 'react';
import ApplicantLayout from '@/Layouts/ApplicantLayout'; // This is the corrected import
import { useForm, Head } from '@inertiajs/react';
import { Separator } from '@/Components/ui/separator';
import { Progress } from '@/Components/ui/progress'; // ShadCN component for progress bar
import ServiceSelection from '@/Components/Booking/ServiceSelection';
import CalendarComponent from '@/Components/Booking/CalendarComponent';
import ParticipantsForm from '@/Components/Booking/ParticipantsForm';
import ReviewAndConfirm from '@/Components/Booking/ReviewAndConfirm';
import { toast } from 'sonner'; // Assuming a ShadCN Toast/Sonner setup

const Create = ({ services, auth }) => {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSlotDetails, setSelectedSlotDetails] = useState(null); // Slot details for Review

    const steps = [
        { id: 1, name: 'Service' },
        { id: 2, name: 'Date/Time' },
        { id: 3, name: 'Participants' },
        { id: 4, name: 'Review & Confirm' },
    ];
    
    const { data, setData, post, processing, errors, hasErrors } = useForm({
        service_id: null,
        // The service class expects slot_date and start_time, not just slot_id
        slot_date: null,
        start_time: null,
        participants: [
            { full_name: auth.user.name || '', relation: 'self', identification_number: '' }
        ],
        notes: '',
    });

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setData('service_id', service.id);
        setStep(2);
    };

    const handleSlotSelect = (slotData) => {
        // slotData should contain slot_id, scheduled_date, start_time, end_time
        setSelectedSlotDetails(slotData);
        setData({
            ...data,
            slot_date: slotData.scheduled_date,
            start_time: slotData.start_time,
            // We don't need slot_id in the final request based on our service implementation
            // but we use slot_date/start_time for validation
        });
        setStep(3);
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Final validation check before posting
        if (data.participants.length === 0) {
            toast.error('You must add at least one participant.');
            return;
        }

        // POST to the store endpoint defined in ApplicantController
        post(route('book.store'), {
            onSuccess: () => {
                // Handled by controller redirect to confirmation page
            },
            onError: (err) => {
                // Generic error handling (e.g., limit exceeded, slot unavailable)
                const postalError = err.postal_code || err.appointment_limit || err.service_limit;
                if (postalError) {
                    toast.error(postalError);
                    // Optionally reset flow if the error requires user action (like updating profile)
                } else if (hasErrors) {
                    toast.error('Please fix the errors in the form before continuing.');
                }
            }
        });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <ServiceSelection services={services} onSelect={handleServiceSelect} />;
            case 2:
                return (
                    <CalendarComponent
                        service={selectedService}
                        onSlotSelect={handleSlotSelect}
                        onBack={() => setStep(1)}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <ParticipantsForm
                        data={data}
                        setData={setData}
                        onNext={() => setStep(4)}
                        onBack={() => setStep(2)}
                        errors={errors}
                    />
                );
            case 4:
                return (
                    <ReviewAndConfirm
                        data={data}
                        service={selectedService}
                        slot={selectedSlotDetails}
                        onSubmit={submit}
                        onBack={() => setStep(3)}
                        processing={processing}
                        errors={errors}
                    />
                );
            default:
                return <p>Loading...</p>;
        }
    };

    // Calculate progress for the progress bar
    const progressValue = ((step - 1) / (steps.length - 1)) * 100;

    return (
        <ApplicantLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Book Appointment</h2>}>
            <Head title="Book Appointment" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 lg:p-10">
                        
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <h1 className="text-2xl font-bold">Step {step}: {steps.find(s => s.id === step).name}</h1>
                                <span className="text-sm text-gray-500">Step {step} of {steps.length}</span>
                            </div>
                            <Progress value={progressValue} className="w-full h-2" />
                        </div>
                        
                        <Separator className="mb-8" />
                        
                        {renderStep()}
                        
                    </div>
                </div>
            </div>
        </ApplicantLayout>
    );
};

export default Create;