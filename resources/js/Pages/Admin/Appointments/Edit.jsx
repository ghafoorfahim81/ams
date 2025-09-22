import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button.jsx";
import Header from "@/Components/Header.jsx";
import PageHeader from "@/Components/PageHeader.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { trans } from "@/lib/utils.js";
import { useEffect } from "react";
import SelectField from "@/Components/SelectField.jsx";
import InputField from "@/Components/InputField.jsx";
import TextareaField from "@/Components/TextareaField.jsx";
export default function Edit({ appointment, services, types, statuses }) {
    const { toast } = useToast();
    appointment = appointment.data;
    console.log('this is appointment',appointment)
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        code: appointment.code ?? "",
        service_id: appointment.service_id  ,
        booked_by_user_id: appointment.booked_by_user_id ?? "",
        registar_user_id: appointment.registar_user_id ?? "",
        type: appointment.type,
        status: appointment.status,
        scheduled_date: appointment.scheduled_date,
        start_time: appointment.start_time ?? "",
        end_time: appointment.end_time ?? "",
        postal_address: appointment.postal_address,
        notes: appointment.notes,
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("appointments.update", appointment.id), {
            onSuccess: () => {
                toast({ title: "Appointment Updated Successfully" });
            },
        });
    };

    function handleChange(e, id = "") {
        console.log('this is e',e)
        console.log('this is id',id)
        let key;
        let value;
        if (id !== "") {
            key = id;
            value = e;
        } else {
            key = e.target.id;
            value = e.target.value;
        }
        setData((values) => ({
            ...values,
            [key]: value,
        }));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <Header text="Edit Appointment" />
                </div>
            }
        >
            <Head title="Edit Appointment" />
            <div className="px-12 w-full">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputField
                            id="code"
                            label="Code"
                            value={data.code}
                            placeholder="Enter Code"
                            handleChange={handleChange}
                            />
                        </div>
                        <div>
                        <SelectField
                        id="service_id"
                        label="Service"
                        items={services}
                        value={data.service_id}
                        placeholder="Select Service"
                        handleChange={handleChange}
                        />
                        </div>
                        <div>
                            <SelectField
                            id="type"
                            label="Type"
                            items={types.data}
                            value={data.type}
                            placeholder="Select Type"
                            handleChange={handleChange}
                            />
                        </div>
                        <div>
                            <SelectField
                            id="status"
                            label="Status"
                            items={statuses.data}
                            value={data.status}
                            placeholder="Select Status"
                            handleChange={handleChange}
                            />
                        </div>
                        <div>

                            <InputField
                                id="scheduled_date"
                                type="date"
                                className="mt-1 w-full border rounded px-3 py-2"
                                value={data.scheduled_date}
                                label="Scheduled date"
                                handleChange={handleChange}
                            />
                            {errors.scheduled_date && (
                                <p className="text-red-600 text-sm mt-1">{errors.scheduled_date}</p>
                            )}
                        </div>
                        <div>
                            <InputField
                                id="start_time"
                                type="time"
                                label="Start time"
                                className="mt-1 w-full border rounded px-3 py-2"
                                value={data.start_time}
                                handleChange={handleChange}
                            />
                            {errors.start_time && (
                                <p className="text-red-600 text-sm mt-1">{errors.start_time}</p>
                            )}
                        </div>
                        <div>
                            <InputField
                                id="end_time"
                                type="time"
                                label="End time"
                                className="mt-1 w-full border rounded px-3 py-2"
                                value={data.end_time ?? ""}
                                handleChange={handleChange}
                            />
                            {errors.end_time && (
                                <p className="text-red-600 text-sm mt-1">{errors.end_time}</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <InputField
                                id="postal_address"
                                label="Postal address"
                                className="mt-1 w-full border rounded px-3 py-2"
                                value={data.postal_address ?? ""}
                                handleChange={handleChange}
                            />
                            {errors.postal_address && (
                                <p className="text-red-600 text-sm mt-1">{errors.postal_address}</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <TextareaField
                                id="notes"
                                label="Notes"
                                className="mt-1 w-full border rounded px-3 py-2"
                                value={data.notes ?? ""}
                                handleChange={handleChange}
                                rows={4}
                            />
                            {errors.notes && (
                                <p className="text-red-600 text-sm mt-1">{errors.notes}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? trans("Saving") : trans("Save")}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            {trans("Back")}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}


