"use client";
import { useEffect, useState } from 'react';

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
};

/**
 * Tracks viewport width and exposes simple responsive flags.
 * SSR-safe: defaults to desktop until mounted, then syncs on resize.
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.tablet + 1
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    width,
    isMobile: width <= BREAKPOINTS.mobile,
    isTablet: width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet,
    isDesktop: width > BREAKPOINTS.tablet,
  };
}

export function useIsMobile() {
  const { isMobile } = useBreakpoint();
  return isMobile;
}

export default useBreakpoint;
