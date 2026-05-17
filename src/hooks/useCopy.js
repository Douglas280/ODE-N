import { useState, useCallback, useEffect, useRef } from "react";

export function useCopy() {
  const [copiedId, setCopiedId] = useState(null);
  const timerRef = useRef(null);

  const copy = useCallback((text, id) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { copy, copiedId };
}
