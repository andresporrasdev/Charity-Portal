import React from "react";
import { Grid } from "@mui/material";
import PostCard from "./PostCard";

const PostList = ({ posts, onEdit, onDelete }) => {
  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post._id}>
          <PostCard post={post} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
