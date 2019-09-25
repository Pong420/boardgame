import { useState, useRef, useEffect, RefObject } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export function useMeasure<T extends Element>() {
  const ref = useRef<T>(null);
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));
  useEffect(() => {
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ro]);
  return [{ ref }, bounds] as [{ ref: RefObject<T> }, typeof bounds];
}
