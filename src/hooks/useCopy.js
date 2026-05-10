import { useState, useCallback } from "react";

export function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    });
  }, [timeout]);

  return { copied, copy };
}
