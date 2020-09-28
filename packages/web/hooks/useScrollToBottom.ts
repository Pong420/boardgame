import { useEffect, useMemo, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';

export function useScrollToBottom(flag?: any) {
  const [autoScroll, setAutoScroll] = useState(true);
  const contentElRef = useRef<HTMLDivElement>(null);

  const { scrollToBottom } = useMemo(() => {
    const scrollToBottom = () => {
      const contentEl = contentElRef.current;
      if (contentEl) {
        contentEl.scrollTop = contentEl.scrollHeight - contentEl.offsetHeight;
      }
    };
    return { scrollToBottom };
  }, []);

  useEffect(() => {
    const contentEl = contentElRef.current;
    if (contentEl) {
      scrollToBottom();
      const subscription = fromEvent(contentEl, 'scroll').subscribe(() => {
        setAutoScroll(
          contentEl.scrollTop >= contentEl.scrollHeight - contentEl.offsetHeight
        );
      });
      return () => subscription.unsubscribe();
    }
  }, [scrollToBottom, flag]);

  return [{ autoScroll, scrollToBottom }, contentElRef] as const;
}
