import React from "react";

export default function DataCard({ title, labels = [], data = [] }) {
    return (
        <div className="max-w-xs hover:bg-slate-50 transition-all hover:shadow-md basis-1/4 mx-2 mt-2 rounded-lg hover:ring-blue-500 shadow-blue-400/50 overflow-hidden min-w-[120px] sm:min-w-[100px] shadow dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:ring-blue-400 dark:shadow-blue-600/50">
            <div className="px-4 py-4 border dark:border-gray-700">
                <div className="text-xs font-bold text-black mb-1 text-center dark:text-gray-200">
                    {title}
                    <hr className="mt-1 mb-2 border-gray-300 dark:border-gray-600" />
                </div>

                {labels.map((label, index) => (
                    <div className="flex" key={index}>
                        <div className="w-1/2">
                            <p className="text-gray-700 text-xs dark:text-gray-200">
                                {label}
                            </p>
                        </div>
                        <div className="w-1/2 mx-1">
                            <p className="text-gray-700 text-xs rtl:text-left text-right dark:text-gray-200">
                                {data[index]}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
