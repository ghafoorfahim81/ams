import React from "react";

export default function LettersCard({ data, loading = false }) {
    if (loading || !data || data.length === 0) return null;

    return (
        <div className="w-full max-w-sm overflow-hidden bg-white border rounded-lg shadow-md border-slate-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="p-2">
                <h2 className="font-semibold text-center text-gray-800 text-md dark:text-gray-200">
                    {data[0]?.docTypeName ?? ""}
                </h2>

                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-2 my-2 transition-colors border shadow-sm bg-slate-100 hover:bg-slate-200 rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <span className="text-sm text-blue-800 dark:text-blue-300">
                            {item.securityLevel}
                        </span>
                        <span className="text-sm font-bold text-blue-800 dark:text-blue-300">
                            {item.total_count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
