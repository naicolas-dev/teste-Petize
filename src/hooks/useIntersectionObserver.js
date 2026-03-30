import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to a sentinel element and calls `onIntersect`
 * whenever that element enters the viewport.
 *
 * Usage:
 *   const sentinelRef = useIntersectionObserver(loadMore, !loading && hasMore);
 *   <Box ref={sentinelRef} />
 *
 * @param {() => void} onIntersect - Callback fired when element is visible
 * @param {boolean}    enabled     - Pauses the observer when false
 * @returns {React.RefObject}
 */
export function useIntersectionObserver(onIntersect, enabled = true) {
  const targetRef   = useRef(null);
  const callbackRef = useRef(onIntersect);

  // Keep the ref up-to-date without recreating the observer on each render
  useEffect(() => { callbackRef.current = onIntersect; }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) callbackRef.current(); },
      { rootMargin: '120px' } // fire slightly before reaching the bottom
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled]);

  return targetRef;
}
