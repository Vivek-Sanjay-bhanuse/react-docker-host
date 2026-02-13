import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  percentage, 
  trend = 'up', 
  extraText,
  icon,
  color = 'primary' 
}) => {
  const colorStyles = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600'
  };

  const trendStyles = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendStyles[trend]}`}>
              {trend === 'up' ? '↑' : '↓'} {percentage}
            </span>
            {extraText && (
              <span className="text-xs text-gray-500 ml-2">{extraText}</span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${colorStyles[color]} rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;