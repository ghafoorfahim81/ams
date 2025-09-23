import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { trans } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Header from "@/Components/Header";
import DashboardFilterDropdown from "@/Components/FilterDashboardDropdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { Users, CalendarDays, Wrench } from "lucide-react";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterValue, setFilterValue] = useState("0"); // days back
    const [totals, setTotals] = useState({ users: 0, services: 0, appointments: 0 });
    const [appointmentsByStatus, setAppointmentsByStatus] = useState([]); // [{name, value}]
    const [appointmentsByType, setAppointmentsByType] = useState([]); // [{name, value}]
    const [servicesWithCounts, setServicesWithCounts] = useState([]); // [{name,total}]

    const getDateFromOffset = (offsetDays) => {
        const days = parseInt(offsetDays || "0", 10);
        const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return d.toISOString().slice(0, 10);
    };

    const fetchData = async (offset) => {
        try {
            setLoading(true);
            setError(null);
            const from = getDateFromOffset(offset);
            const res = await fetch(`/dashboard-data?filter=${from}`);
            if (!res.ok) throw new Error(`Failed: ${res.status}`);
            const json = await res.json();
            setTotals(json.totals || { users: 0, services: 0, appointments: 0 });
            setAppointmentsByStatus(json.appointmentsByStatus || []);
            setAppointmentsByType(json.appointmentsByType || []);
            setServicesWithCounts(json.servicesWithCounts || []);
        } catch (e) {
            setError(e?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(filterValue);
    }, [filterValue]);

    const onFilterSelect = (value) => setFilterValue(value);

    const pieColors = ["#60A5FA", "#3B82F6", "#1D4ED8", "#172554", "#22c55e", "#ef4444"]; // tailwind blues + extras


    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <Header text={"Dashboard"} />
                    <DashboardFilterDropdown onSelect={onFilterSelect} />
                </div>
            }
        >
            <Head title="Dashboard" />

            {error && (
                <div className="mb-4 text-sm text-red-600">{error}</div>
            )}

            {/* Totals */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {loading ? (
                    [0, 1, 2].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-6 w-28 mb-3" />
                                <Skeleton className="h-8 w-20" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    [
                        { label: "Total users", value: totals.users, icon: <Users className="h-5 w-5" /> },
                        { label: "Total services", value: totals.services, icon: <Wrench className="h-5 w-5" /> },
                        { label: "Total appointments", value: totals.appointments, icon: <CalendarDays className="h-5 w-5" /> },
                    ].map((s) => (
                        <Card key={s.label}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground">{s.label}</div>
                                        <div className="mt-2 text-3xl font-semibold">{s.value}</div>
                                    </div>
                                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                                        {s.icon}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pie charts row */}
            <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
                {/* Pie: Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments by status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-[260px] w-full" />
                        ) : (
                            <div className="h-[260px] w-full overflow-hidden">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie cx="50%" cy="50%" data={appointmentsByStatus} dataKey="value" nameKey="name" outerRadius={90}>
                                            {appointmentsByStatus.map((_, idx) => (
                                                <Cell key={`s-${idx}`} fill={pieColors[idx % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <RTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pie: Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments by type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-[260px] w-full" />
                        ) : (
                            <div className="h-[260px] w-full overflow-hidden">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie cx="50%" cy="50%" data={appointmentsByType} dataKey="value" nameKey="name" outerRadius={90}>
                                            {appointmentsByType.map((_, idx) => (
                                                <Cell key={`t-${idx}`} fill={pieColors[idx % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <RTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Bar: Services on new row */}
            <div className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Services with booked appointments</CardTitle>
                        <CardDescription> Hover to see totals </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-[260px] w-full" />
                        ) : (
                            <ChartContainer className="h-[260px]" config={{ total: { label: "Total", color: "#93c5fd" } }}>
                                <BarChart data={servicesWithCounts}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="#93c5fd" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
