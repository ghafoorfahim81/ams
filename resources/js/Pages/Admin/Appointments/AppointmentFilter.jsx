import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Filter, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { Input } from "@/Components/ui/input.jsx";
import { Label } from "@/Components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select.jsx";
import { Download } from "lucide-react";
export default function AppointmentFilter({ statusOptions = [], services = [], users = [] }) {
    const { url } = usePage();
    const searchParams = useMemo(() => new URLSearchParams(url.split("?")[1]), [url]);

    const [filters, setFilters] = useState({
        code: searchParams.get("code") || "",
        booked_by_user_id: searchParams.get("booked_by_user_id") || "",
        email: searchParams.get("email") || "",
        service_id: searchParams.get("service_id") || "",
        date_from: searchParams.get("date_from") || "",
        date_to: searchParams.get("date_to") || "",
        status: searchParams.get("status") || "",
    });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const hasActiveFilters = Object.values(filters).some((v) => v && String(v).trim() !== "");

    const applyFilters = () => {
        const params = new URLSearchParams();
        const searchTerm = searchParams.get("q");
        const sortBy = searchParams.get("sort_by");
        if (searchTerm) params.set("q", searchTerm);
        if (sortBy) params.set("sort_by", sortBy);

        Object.entries(filters).forEach(([k, v]) => {
            if (v && String(v).trim() !== "") params.set(k, v);
        });

        router.get(route("appointments.index"), Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilters({
            code: "",
            booked_by_user_id: "",
            email: "",
            service_id: "",
            date_from: "",
            date_to: "",
            status: "",
        });

        const params = new URLSearchParams();
        const searchTerm = searchParams.get("q");
        const sortBy = searchParams.get("sort_by");
        if (searchTerm) params.set("q", searchTerm);
        if (sortBy) params.set("sort_by", sortBy);

        router.get(route("appointments.index"), Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePDFDownload = () => {
        window.location.href = `/appointments/report`   + "?" + new URLSearchParams(filters).toString();
    };

    return (
        <div className="w-full">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filters" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Advanced Filters</span>
                            {hasActiveFilters && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {Object.values(filters).filter((v) => v && String(v).trim() !== "").length}
                                </span>
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Appointment Code</Label>
                                <Input id="code" value={filters.code} onChange={(e) => updateFilter("code", e.target.value)} placeholder="Enter code" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="booked_by_user_id">Booked By</Label>
                                <Select value={filters.booked_by_user_id} onValueChange={(v) => updateFilter("booked_by_user_id", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={filters.email} onChange={(e) => updateFilter("email", e.target.value)} placeholder="Enter email" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="service_id">Service/Package</Label>
                                <Select value={filters.service_id} onValueChange={(v) => updateFilter("service_id", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_from">Date From</Label>
                                 <Input type="date" id="date_from" value={filters.date_from} onChange={(e) => updateFilter("date_from", e.target.value)} placeholder="Enter date from" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_to">Date To</Label>
                                 <Input type="date" id="date_to" value={filters.date_to} onChange={(e) => updateFilter("date_to", e.target.value)} placeholder="Enter date to" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={filters.status} onValueChange={(v) => updateFilter("status", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                            <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters} className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                            <Button onClick={applyFilters} disabled={!hasActiveFilters} className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button onClick={handlePDFDownload} disabled={!hasActiveFilters} className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}


