import axiosInstance from "../../utils/axiosInstance";

export const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get("/api/event/readEvent");
    return response.data.data.events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
