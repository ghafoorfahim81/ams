import React from "react";

export default function DocumentsOverview({ label, value }) {
    return (
        <div className="bg-green-50 p-2 rounded-lg m-2 shadow-md border border-green-200 hover:bg-green-100 transition-all duration-300 ease-in-out">
            <p className="text-gray-600 text-sm font-medium text-center">{label}</p>
            <p className="text-2xl font-bold text-green-600 text-center mt-3">{value}</p>
        </div>
    );
}
