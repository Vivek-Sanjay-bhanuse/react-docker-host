import React from 'react';

const LineChart = ({ data }) => {
  const maxValue = Math.max(...data.datasets[0].data);
  const minValue = Math.min(...data.datasets[0].data);
  const range = maxValue - minValue;

  return (
    <div className="relative h-64">
      <div className="absolute inset-0 flex items-end space-x-2">
        {data.datasets[0].data.map((value, index) => {
          const height = ((value - minValue) / range) * 80 + 10;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t transition-all duration-500 ease-out"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{data.labels[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineChart;