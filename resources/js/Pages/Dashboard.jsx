import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { trans } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import DocTypeCard from "@/Components/DocTypeCard";
import SaderaWaredaCard from "@/Components/SaderaWaredaCard.jsx";
import DashboardFilterDropdown from "@/Components/FilterDashboardDropdown";
import * as React from "react";
import axios from "axios";
import Header from "@/Components/Header";
import Stat from "@/Components/Stat";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

export default function Dashboard() {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState({
        suggestions: [],
        letters: [],
        ahkams: [],
        requisitions: [],
        saderaAndWareda: [],
        chartData: [],
        allDocuments: 0,
        documentsByStatus: [],
        pendingApproval: 0,
        approved: 0,
    });

    // Combined useEffect for initial data fetch
    React.useEffect(() => {
        const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
        fetchDashboardData(today); // Fetch today's data on first load
    }, []);

    const fetchDashboardData = async (filter = "") => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/dashboard-data?filter=${filter}`
            );
            setData({
                suggestions: response.data.suggestions,
                letters: response.data.letters,
                ahkams: response.data.ahkams,
                requisitions: response.data.requisitions,
                saderaAndWareda: response.data.saderaAndWareda,
                chartData: response.data.chartData,
                allDocuments: response.data.allDocuments,
                documentsByStatus: response.data.documentsByStatus,
                pendingApproval: response.data.pendingApproval,
                approved: response.data.approved,
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterDashboardData = (filterValue) => {
        const today = new Date();
        const dateMap = {
            today: () => new Date(),
            7: () => new Date(Date.now() - 7 * 86400000),
            30: () => new Date(Date.now() - 30 * 86400000),
            90: () => new Date(Date.now() - 90 * 86400000),
            180: () => new Date(Date.now() - 180 * 86400000),
            365: () => new Date(Date.now() - 365 * 86400000),
        };

        const selectedDate = dateMap[filterValue]?.();
        const formattedDate = selectedDate?.toISOString().slice(0, 10) ?? "";
        fetchDashboardData(formattedDate);
    };

    const translatedSadera = trans("doc:Sadera");
    const translatedWareda = trans("doc:Wareda");
    const translatedReceived = trans("doc:Received");
    const translatedSent = trans("doc:Sent");
    const formattedChartData = data.chartData.map((item) => ({
        name: item.name,
        sent: item.sent,
        received: item.received,
    }));
    const chartConfig = {
        sent: { label: translatedSent, color: "#182A50" },
        received: { label: translatedReceived, color: "#FEA317" },
    };
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <Header text={trans("Dashboard")} />
                    <DashboardFilterDropdown onSelect={filterDashboardData} />
                </div>
            }
        >
            <Head title="Dashboard" />
            <>
                <div
                    className={loading ? "opacity-40 pointer-events-none" : ""}
                >
                    {/* <div className="grid grid-cols-1 gap-4 mt-3 md:grid-cols-2 lg:grid-cols-4">
                        <DocTypeCard data={data.suggestions} />
                        <DocTypeCard data={data.letters} />
                        <DocTypeCard data={data.ahkams} />
                        <DocTypeCard data={data.requisitions} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-6">
                        {data.saderaAndWareda.map((item, index) => (
                            <SaderaWaredaCard
                                key={index}
                                data={[item.sadera, item.wareda]}
                                title={item.docType}
                                labels={[translatedSadera, translatedWareda]}
                            />
                        ))}
                    </div> */}
                    <div className="flex flex-col items-center gap-2 mt-4 sm:flex-row">
                        {/* <div className="w-full max-w-sm p-6 bg-white shadow rounded-2xl dark:bg-gray-800 dark:shadow-gray-900/50">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {trans("doc:Document_Overview")}
                            </h2>

                            <ul className="space-y-3">
                                <a
                                    href={route("documents.index")}
                                    className="flex items-center justify-between p-2 text-sm transition-all rounded-lg hover:underline hover:text-indigo-600 hover:bg-slate-100 hover:scale-105 dark:hover:bg-gray-700 dark:hover:scale-105"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {trans("doc:All_Documents")}
                                    </span>
                                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                                        {data.allDocuments}
                                    </span>
                                </a>
                                <a
                                    href={route("documents.index", {
                                        status: "completed",
                                    })}
                                    className="flex items-center justify-between p-2 text-sm transition-all rounded-lg hover:underline hover:text-indigo-600 hover:bg-slate-100 hover:scale-105 dark:hover:bg-gray-700 dark:hover:scale-105"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {trans("doc:Completed")}
                                    </span>
                                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                                        {data.documentsByStatus[
                                            "totalCompleted"
                                        ] ?? 0}
                                    </span>
                                </a>
                                <a
                                    href={route("documents.index", {
                                        status: "pendingApproval",
                                    })}
                                    className="flex items-center justify-between p-2 text-sm transition-all rounded-lg hover:underline hover:text-indigo-600 hover:bg-slate-100 hover:scale-105 dark:hover:bg-gray-700 dark:hover:scale-105"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {trans("doc:Pending_Approval")}
                                    </span>
                                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                                        {data.pendingApproval}
                                    </span>
                                </a>
                                <a
                                    href={route("documents.index", {
                                        status: "ongoing",
                                    })}
                                    className="flex items-center justify-between p-2 text-sm transition-all rounded-lg hover:underline hover:text-indigo-600 hover:bg-slate-100 hover:scale-105 dark:hover:bg-gray-700 dark:hover:scale-105"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {trans("doc:Ongoing")}
                                    </span>
                                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                                        {data.documentsByStatus[
                                            "totalOngoing"
                                        ] ?? 0}
                                    </span>
                                </a>
                                <a
                                    href={route("documents.index", {
                                        status: "pending",
                                    })}
                                    className="flex items-center justify-between p-2 text-sm transition-all rounded-lg hover:underline hover:text-indigo-600 hover:bg-slate-100 hover:scale-105 dark:hover:bg-gray-700 dark:hover:scale-105"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {trans("doc:Pending")}
                                    </span>
                                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                                        {data.documentsByStatus[
                                            "totalPending"
                                        ] ?? 0}
                                    </span>
                                </a>
                                <a
                                    href={route("documents.index", {
                                        status: "rejected",
                                    })}
                                    className="flex items-center justify-between p-2 text-sm transition-all rounded-lg hover:underline hover:text-indigo-600 hover:bg-slate-100 hover:scale-105 dark:hover:bg-gray-700 dark:hover:scale-105"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {trans("doc:Rejected")}
                                    </span>
                                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                                        {data.documentsByStatus[
                                            "totalRejected"
                                        ] ?? 0}
                                    </span>
                                </a>
                                <a
                                    href={route("documents.index", {
                                        status: "approved",
                                    })}
                                    className="flex items-center justify-between p-2 text-sm transition-all rounded-lg hover:underline hover:text-indigo-600 hover:bg-slate-100 hover:scale-105 dark:hover:bg-gray-700 dark:hover:scale-105"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {trans("doc:Approved")}
                                    </span>
                                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                                        {data.approved}
                                    </span>
                                </a>
                            </ul>
                            <div className="mt-6 text-center">
                                <a
                                    href={route("documents.index")}
                                    className="text-sm font-medium text-black hover:underline dark:text-gray-200 dark:hover:text-gray-400"
                                >
                                    {trans("doc:View_All_Documents")}
                                </a>
                            </div> */}
                        {/* </div> */}

                        <Card className="w-full">
                            {/* <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[410px] mt-4 w-full"
                                >
                                    <BarChart data={formattedChartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                        />
                                        <ChartTooltip
                                            cursor={{ fill: "transparent" }}
                                            content={
                                                <ChartTooltipContent indicator="dashed" />
                                            }
                                        />
                                        <Bar
                                            dataKey="sent"
                                            fill={chartConfig.sent.color}
                                            radius={4}
                                        />
                                        <Bar
                                            dataKey="received"
                                            fill={chartConfig.received.color}
                                            radius={4}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent> */}
                        </Card>
                    </div>
                </div>
            </>
        </AuthenticatedLayout>
    );
}
