import React from 'react';

interface FiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showText?: boolean;
  subtitle?: string;
  variant?: 'light' | 'dark' | 'auto';
}

/**
 * Official FI Logo Brand Mark
 * Renders the supplied canonical FI logo asset directly with responsive sizing
 * and preserved aspect ratio.
 */
export const FiLogo: React.FC<FiLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  subtitle
}) => {
  const getDimensionPx = (): number => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'xs':
        return 22;
      case 'sm':
        return 28;
      case 'lg':
        return 44;
      case 'xl':
        return 60;
      case 'md':
      default:
        return 34;
    }
  };

  const dim = getDimensionPx();

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official FI Brand Logo Asset */}
      <img
        src="/assets/fi-logo-original.png"
        alt="FI Logo"
        width={dim}
        height={dim}
        className="shrink-0 select-none object-contain transition-all"
        style={{ width: `${dim}px`, height: `${dim}px` }}
      />

      {/* Optional Brand Wordmark */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-black text-base tracking-wide text-[#F3F4EA]">FI</span>
            <span className="text-[10px] font-mono text-[#9CAF45] font-semibold tracking-wider uppercase">FPO INDEX</span>
          </div>
          {subtitle && (
            <span className="text-[10px] text-[#969D88] font-sans tracking-wide block">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
