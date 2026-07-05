import { useEffect, useRef, useState } from 'react';

function parseNumeric(rawValue: string): [prefix: string, target: number, suffix: string] | null {
  const match = rawValue.match(/^(\D*)(\d+)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  return [prefix, parseInt(digits, 10), suffix];
}

/**
 * "1200+" kabi matndagi sonni ajratib olib, 0'dan shu songacha animatsiya bilan
 * o'sadigan matn qaytaradi (masalan "0+" -> "1200+"). Raqam bo'lmagan matnlar
 * yoki `active=false` bo'lganda asl qiymat o'zgarishsiz qaytariladi.
 */
export function useCountUp(rawValue: string, durationMs = 1400, active = true) {
  const parsed = parseNumeric(rawValue);
  const shouldAnimate = !!parsed && active;
  const [display, setDisplay] = useState(rawValue);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldAnimate || !parsed) return;
    const [prefix, target, suffix] = parsed;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current}${suffix}`);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawValue, durationMs, shouldAnimate]);

  return shouldAnimate ? display : rawValue;
}
