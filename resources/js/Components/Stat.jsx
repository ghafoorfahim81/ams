import React from "react";

const Stat = ({ stat }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-bachground border rounded-xl drop-shadow-lg hover:drop-shadow-xl hover:scale-[1.01]">
            <div>
                <h4 className="text-sm font-medium text-gray-600">
                    {stat.title}
                </h4>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
            </div>
            <div className="text-gray-500 mb-9">{stat.icon}</div>
        </div>
    );
};

export default Stat;
