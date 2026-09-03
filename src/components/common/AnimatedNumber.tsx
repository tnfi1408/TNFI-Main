import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (val: number) => string;
  flashOnChange?: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 500,
  decimals = 2,
  prefix = '',
  suffix = '',
  className = '',
  formatter,
  flashOnChange = true
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [flashColor, setFlashColor] = useState<'up' | 'down' | null>(null);
  const prevValueRef = useRef<number>(value);
  const animFrameRef = useRef<number | null>(null);
  const flashTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev !== value) {
      if (flashOnChange && !shouldReduceMotion) {
        if (value > prev) {
          setFlashColor('up');
        } else if (value < prev) {
          setFlashColor('down');
        }
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = window.setTimeout(() => {
          setFlashColor(null);
        }, 650);
      }

      if (shouldReduceMotion) {
        setDisplayValue(value);
        prevValueRef.current = value;
        return;
      }

      const startValue = prev;
      const endValue = value;
      const startTime = performance.now();

      const updateNumber = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (endValue - startValue) * easeOut;

        setDisplayValue(current);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(updateNumber);
        } else {
          setDisplayValue(endValue);
          prevValueRef.current = endValue;
        }
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(updateNumber);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, [value, duration, flashOnChange, shouldReduceMotion]);

  const formattedText = formatter
    ? formatter(displayValue)
    : `${prefix}${displayValue.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;

  const flashClass =
    flashColor === 'up'
      ? 'text-[#8FAF3D] transition-colors duration-200'
      : flashColor === 'down'
      ? 'text-[#D65C5C] transition-colors duration-200'
      : 'transition-colors duration-500';

  return (
    <span className={`inline-block tabular-nums font-mono ${flashClass} ${className}`}>
      {formattedText}
    </span>
  );
};
