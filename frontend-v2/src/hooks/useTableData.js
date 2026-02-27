import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

/**
 * Parallel-fetch hook for admin manage tables.
 *
 * Fires both the data request and the roles request simultaneously via
 * Promise.all, then exposes { rows, roleOptions, loading, error, refetch }.
 *
 * @param {string} dataUrl   - e.g. "/api/user/getAllUsers"
 * @param {string} dataKey   - key inside response.data.data, e.g. "users"
 * @param {string} rolesUrl  - e.g. "/api/role/getAllRoles"
 */
const useTableData = (dataUrl, dataKey, rolesUrl) => {
  const [rows, setRows] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError(null);

    Promise.all([axiosInstance.get(dataUrl), axiosInstance.get(rolesUrl)])
      .then(([dataRes, rolesRes]) => {
        setRows(dataRes.data.data[dataKey] || []);
        setRoleOptions(rolesRes.data.data.roles || []);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [dataUrl, dataKey, rolesUrl]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { rows, roleOptions, loading, error, refetch: fetchAll };
};

export default useTableData;
