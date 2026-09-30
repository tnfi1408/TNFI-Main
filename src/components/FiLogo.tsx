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
 * Geometric emblem consisting of a circular outer ring with top serif 'I' 
 * and interlocking emerald green 'F' agricultural glyph.
 */
export const FiLogo: React.FC<FiLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  subtitle,
  variant = 'auto'
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

  // In dark-themed application, the ring & 'I' use crisp foreground text color (#F3F4EA)
  // while the agricultural symbol uses the official emerald green (#17985B).
  const slateColor = variant === 'light' ? '#28323E' : '#F3F4EA';
  const greenColor = '#17985B';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official FI Brand Symbol */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width={dim}
        height={dim}
        className="shrink-0 select-none transition-all drop-shadow-xs"
        style={{ width: dim, height: dim }}
        aria-label="FI Logo"
      >
        {/* Left Arc of Circular Ring (Center 100, 100, R=84, r=60) */}
        <path
          d="M 36.5 45 
             A 84 84 0 0 0 36.5 155 
             L 76 155 
             A 60 60 0 0 1 76 45 
             Z"
          fill={slateColor}
        />

        {/* Right Arc of Circular Ring */}
        <path
          d="M 124 45 
             A 60 60 0 0 1 124 155 
             L 163.5 155 
             A 84 84 0 0 0 163.5 45 
             Z"
          fill={slateColor}
        />

        {/* Top Letter 'I' with Brackets and Serifs */}
        <path
          d="M 86 24 
             L 114 24 
             L 114 31 
             C 111 31 108 33 107 37 
             L 107 83 
             C 108 87 111 89 114 89 
             L 114 96 
             L 86 96 
             L 86 89 
             C 89 89 92 87 93 83 
             L 93 37 
             C 92 33 89 31 86 31 
             Z"
          fill={slateColor}
        />

        {/* Lower Emerald Green 'F' / 'r' Component (#17985B) */}
        {/* Left Accent Bar */}
        <rect
          x="75"
          y="112"
          width="13"
          height="38"
          fill={greenColor}
        />

        {/* Main Vertical Stem with Top Right Arm */}
        <path
          d="M 91 102 
             L 142 102 
             L 142 122 
             L 111 122 
             L 111 196 
             L 91 196 
             Z"
          fill={greenColor}
        />
      </svg>

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
