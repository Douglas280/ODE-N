import { useState, useEffect, useRef } from "react";
import { CATEGORY_DEFS } from "../data/index.js";
import { buildDataset, buildIndexes } from "../engine/dataset.js";

function buildSync() {
  const phraseCatMap = new Map();
  const allPhrases = [];
  for (const cat of CATEGORY_DEFS) {
    for (const phrase of cat.phrases) {
      allPhrases.push(phrase);
      const norm = phrase.trim().toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ");
      phraseCatMap.set(norm, cat.label);
    }
  }
  const entries = buildDataset(allPhrases, phraseCatMap);
  const indexes = buildIndexes(entries);
  return { entries, indexes };
}

export function useIndexes() {
  const [state, setState] = useState({ entries: null, indexes: null, ready: false, count: 0 });
  const workerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    import("../engine/indexWorker.js?worker")
      .then(({ default: Worker }) => {
        const w = new Worker();
        workerRef.current = w;
        w.onmessage = (e) => {
          if (!cancelled) setState({
            entries: e.data.entries,
            indexes: e.data.indexes,
            count:   e.data.entries?.length ?? 0,
            ready:   true,
          });
          w.terminate();
        };
        w.onerror = () => {
          if (!cancelled) {
            const built = buildSync();
            setState({ ...built, count: built.entries.length, ready: true });
          }
          w.terminate();
        };
      })
      .catch(() => {
        if (!cancelled) {
          const built = buildSync();
          setState({ ...built, count: built.entries.length, ready: true });
        }
      });

    return () => {
      cancelled = true;
      workerRef.current?.terminate();
    };
  }, []);

  return state;
}
