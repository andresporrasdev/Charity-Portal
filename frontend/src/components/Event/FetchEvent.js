import axios from 'axios';

export const fetchEvents = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/event/readEvent");
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};