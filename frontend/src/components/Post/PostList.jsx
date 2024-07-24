import React from 'react';
import PostCard from './PostCard';
import './Post.css';

const PostList = ({ posts, onEdit, onDelete, onViewDetails, hideActions, user }) => {
    return (
        <div className="post-list">
            {posts.map(post => (
                <PostCard
                    key={post._id}
                    post={post}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetails={onViewDetails}
                    hideActions={hideActions}
                    user={user}
                />
            ))}
        </div>
    );
};

export default PostList;