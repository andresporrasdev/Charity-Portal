import React, { useState, useRef, useEffect, useContext } from "react";
import DOMPurify from "dompurify";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext, ROLES } from "../../UserContext";
import defaultImageSrc from "../../assets/defaultPostPic.png";

const getImageSrcFromContent = (content) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  const img = div.querySelector("img");
  return img ? img.src : null;
};

const extractTextSnippet = (content, length = 200) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  return div.textContent.substring(0, length) + "...";
};

const PostCard = ({ post, onEdit, onDelete }) => {
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { subject, content, updated } = post;
  const formattedTime = new Date(updated).toLocaleString();
  const imageSrc = getImageSrcFromContent(content);
  const snippet = extractTextSnippet(content, 200);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleEdit = () => { onEdit(post); handleMenuClose(); };
  const handleDelete = () => { onDelete(post._id); handleMenuClose(); };

  const isNewPost = () => {
    const postDate = new Date(post.created);
    const now = new Date();
    const weeksAgo = new Date(now.setDate(now.getDate() - 7));
    return postDate >= weeksAgo;
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          height="180"
          image={imageSrc || defaultImageSrc}
          alt="Post Image"
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography variant="h6" gutterBottom>
              {subject}
              {isNewPost() && <FiberNewOutlinedIcon color="primary" fontSize="large" sx={{ ml: 1, verticalAlign: "middle" }} />}
            </Typography>
            {user?.roles.includes(ROLES.ADMIN) && (
              <>
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
              </>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>{snippet}</Typography>
          <Button size="small" color="primary" onClick={() => setShowModal(true)}>Read more</Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
            Updated: {formattedTime}
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {subject}
          <IconButton onClick={() => setShowModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            Updated: {formattedTime}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;
