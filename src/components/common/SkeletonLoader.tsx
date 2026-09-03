import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'table-row' | 'chart' | 'metric';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'card',
  count = 1
}) => {
  const items = Array.from({ length: count });

  if (variant === 'metric') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((_, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl bg-[#10140D] border border-[#2A3320] animate-pulse space-y-2.5 ${className}`}
          >
            <div className="h-2.5 w-20 bg-[#1F2815] rounded" />
            <div className="h-6 w-28 bg-[#2A371C] rounded" />
            <div className="h-2 w-16 bg-[#182011] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="space-y-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={`p-3.5 rounded-xl bg-[#10140D] border border-[#2A3320] animate-pulse flex items-center justify-between gap-4 ${className}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1F2815]" />
              <div className="space-y-1.5">
                <div className="h-3 w-32 bg-[#2A371C] rounded" />
                <div className="h-2 w-20 bg-[#182011] rounded" />
              </div>
            </div>
            <div className="h-4 w-16 bg-[#1F2815] rounded" />
            <div className="h-4 w-20 bg-[#2A371C] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div
        className={`p-6 rounded-3xl bg-[#10140D] border border-[#2A3320] animate-pulse space-y-4 ${className}`}
      >
        <div className="flex justify-between items-center">
          <div className="h-4 w-36 bg-[#2A371C] rounded" />
          <div className="h-3 w-20 bg-[#1F2815] rounded" />
        </div>
        <div className="h-48 rounded-xl bg-gradient-to-t from-[#161B11] to-[#0A0D08] flex items-end justify-between p-4 gap-2">
          {[40, 65, 30, 85, 55, 90, 70, 45, 80, 60].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 bg-[#1F2815] rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-5 rounded-3xl bg-[#10140D] border border-[#2A3320] animate-pulse space-y-3 ${className}`}
    >
      <div className="h-4 w-1/3 bg-[#2A371C] rounded" />
      <div className="h-3 w-2/3 bg-[#1F2815] rounded" />
      <div className="h-20 rounded-xl bg-[#080A07]" />
    </div>
  );
};
