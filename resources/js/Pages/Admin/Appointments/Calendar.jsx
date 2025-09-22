import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, Link } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/Components/ui/button.jsx";

export default function Calendar() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Appointments Calendar</h2>
                    <div className="flex items-center gap-2">
                        <Link href={route('appointments.index')}>
                            <Button variant="outline">Back to List</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Appointments Calendar" />
            <div className="p-6">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    navLinks={true}
                    nowIndicator={true}
                    events={(fetchInfo, successCallback, failureCallback) => {
                        const url = route('appointments.events');
                        const params = new URLSearchParams({ start: fetchInfo.startStr, end: fetchInfo.endStr });
                        fetch(`${url}?${params.toString()}`)
                            .then(r => r.json())
                            .then(data => successCallback(data))
                            .catch(err => failureCallback(err));
                    }}
                    eventColor="#4f46e5"
                    height="80vh"
                />
            </div>
        </AuthenticatedLayout>
    );
}


