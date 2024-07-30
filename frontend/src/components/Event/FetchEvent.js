import axios from "axios";
import BaseURL from "../../config";

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${BaseURL}/api/event/readEvent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
