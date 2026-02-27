import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

/**
 * Generic data-fetch hook with AbortController cleanup.
 *
 * @param {string} url - API path (relative, e.g. "/api/event/readEvent")
 * @param {object} [options] - Axios request config (method, data, params…)
 * @param {Array}  [deps=[]] - Extra dependency array items that re-trigger the fetch
 * @returns {{ data, loading, error, refetch }}
 */
const useFetch = (url, options = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axiosInstance({ url, signal: controller.signal, ...options })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, refetchFlag, ...deps]);

  return { data, loading, error, refetch };
};

export default useFetch;
