import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function AppointmentDetailsDialog({ isOpen, onOpenChange, appointmentId }) {
    const [loading, setLoading] = useState(false);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        if (!isOpen || !appointmentId) return;
        setLoading(true);
        fetch(route("appointments.show", appointmentId), {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        })
            .then((r) => r.json())
            .then((data) => setAppointment(data?.data ?? data))
            .finally(() => setLoading(false));
    }, [isOpen, appointmentId]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {loading ? (
                    <div className="py-8 text-center">Loading…</div>
                ) : appointment ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Detail label="Code" value={appointment.code} />
                            <Detail label="Service" value={appointment.service?.name} />
                            <Detail label="Type" value={appointment.type} />
                            <Detail label="Status" value={appointment.status} />
                            <Detail label="Scheduled date" value={appointment.scheduled_date} />
                            <Detail label="Start time" value={appointment.start_time} />
                            <Detail label="End time" value={appointment.end_time} />
                            <Detail label="Postal address" value={appointment.postal_address} className="col-span-2" />
                            <Detail label="Notes" value={appointment.notes} className="col-span-2" />
                        </div>

                        {appointment.participants && appointment.participants.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Participants</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    {appointment.participants.map((p) => (
                                        <li key={p.id}>
                                            {p.full_name ?? p.relationship ?? p.identification_number ?? p.id}
                                            {p.relationship && ` (${p.relationship})`}
                                            {p.identification_number && ` (${p.identification_number})`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center">No data</div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Detail({ label, value, className = "" }) {
    return (
        <div className={className}>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-medium break-words">{value ?? "—"}</div>
        </div>
    );
}


