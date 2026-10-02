import { useEffect, useState, useCallback } from "react";
import api from "../api/client.js";

/** Minimal data-fetching hook: returns { data, loading, error, reload }. */
export function useFetch(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await api.get(path));
    } catch (e) {
      setError(e.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => { reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, deps);

  return { data, loading, error, reload };
}
