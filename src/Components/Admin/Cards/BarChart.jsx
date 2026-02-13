import React from 'react';

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.datasets[0].data);

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-48 space-x-2">
        {data.datasets[0].data.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">{value}</div>
              <div
                className="w-full bg-gradient-to-t from-secondary-500 to-secondary-300 rounded-t transition-all duration-500 ease-out"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500 mt-2 text-center">
                {data.labels[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;