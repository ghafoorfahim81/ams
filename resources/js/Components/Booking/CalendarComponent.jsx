import React, { useState, useEffect } from 'react';
import axios from 'axios';

// *** FINALIZED FIX: Alias + Explicit .jsx Extension ***
import { Button } from '@/Components/ui/button.jsx'; 
import { Calendar } from '@/Components/ui/calendar.jsx'; 
import { ScrollArea } from '@/Components/ui/scroll-area.jsx'; 
// *************************************************

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Placeholder for slot data structure: { '2025-09-22': [{ time: '10:00:00', capacity: 5, id: 101, end_time: '11:00:00' }, ...] }
const CalendarComponent = ({ service, onSlotSelect, onBack, errors }) => {
    const [date, setDate] = useState(new Date());
    const [slots, setSlots] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Function to fetch slots for the current month
    const fetchSlots = async (currentDate) => {
        setLoading(true);
        const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        
        try {
            const response = await axios.get(route('book.slots'), {
                params: { service_id: service.id, month: yearMonth }
            });
            // Assuming the backend returns an object where keys are date strings (e.g., '2025-09-22')
            setSlots(response.data.slots); 
        } catch (error) {
            toast.error('Failed to load slots. Please try again.');
            setSlots({});
        } finally {
            setLoading(false);
        }
    };

    // Fetch slots on mount and when the month/service changes
    useEffect(() => {
        if (service) {
            fetchSlots(date);
        }
    }, [service, date.getMonth(), date.getFullYear()]);

    const handleSlotClick = (slot) => {
        const dateString = date.toISOString().split('T')[0];
        const slotData = {
            slot_id: slot.id,
            scheduled_date: dateString,
            start_time: slot.time,
            end_time: slot.end_time,
        };
        setSelectedTimeSlot(slotData);
    };

    const confirmSlot = () => {
        if (selectedTimeSlot) {
            onSlotSelect(selectedTimeSlot);
        }
    };

    const selectedDateString = date ? date.toISOString().split('T')[0] : null;
    const availableSlots = selectedDateString && slots[selectedDateString] ? slots[selectedDateString] : [];

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border p-4"
                    disabled={(day) => day < new Date()}
                    // onDayClick functionality would need to be enhanced for month change logic
                />
                <Button variant="outline" className="mt-4" onClick={onBack}>
                    &larr; Change Service
                </Button>
            </div>

            <div className="md:w-1/2">
                <h3 className="text-lg font-semibold mb-4">Available Times on {selectedDateString}</h3>
                
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading slots...
                    </div>
                ) : availableSlots.length > 0 ? (
                    <ScrollArea className="h-64 pr-4">
                        <div className="grid gap-3">
                            {availableSlots.map((slot) => (
                                <Button
                                    key={slot.id}
                                    variant={selectedTimeSlot?.slot_id === slot.id ? 'default' : 'secondary'}
                                    onClick={() => handleSlotClick(slot)}
                                    disabled={slot.capacity <= 0}
                                    className="justify-between"
                                >
                                    <span>{slot.time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                                    <span className="text-xs">
                                        {slot.capacity > 0 ? `${slot.capacity} spots` : 'Full'}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p className="text-gray-500">No slots available on this date.</p>
                )}

                <Button 
                    onClick={confirmSlot} 
                    disabled={!selectedTimeSlot} 
                    className="w-full mt-6"
                >
                    Confirm Date & Time &rarr;
                </Button>
            </div>
        </div>
    );
};

export default CalendarComponent;