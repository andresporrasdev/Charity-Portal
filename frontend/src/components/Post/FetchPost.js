import axios from 'axios';

export const fetchPosts = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/post/readPost");
        console.log("Posts:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};