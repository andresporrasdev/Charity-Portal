import axios from 'axios';

export const fetchPosts = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/post/readPost");
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};