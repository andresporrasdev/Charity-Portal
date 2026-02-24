import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BaseURL from "./config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get(`${BaseURL}/api/user/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === "success") {
        const userData = response.data.data.user;
        setUser(userData);
        console.log("fetchUserInfo:success");
      } else {
        console.error("Failed to fetch user info:", response.data.message);
        logout();
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response && error.response.data.message === "Token expired. Please login again.") {
        logout();
      }
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

export const ROLES = {
  ADMIN: import.meta.env.VITE_ROLE_ADMIN,
  MEMBER: import.meta.env.VITE_ROLE_MEMBER,
  ORGANIZER: import.meta.env.VITE_ROLE_ORGANIZER,
  VOLUNTEER: import.meta.env.VITE_ROLE_VOLUNTEER,
  PERFORMER: import.meta.env.VITE_ROLE_PERFORMER,
};
