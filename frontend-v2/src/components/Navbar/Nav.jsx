import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { UserContext, ROLES } from "../../UserContext";
import logo from "../../assets/logo.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Event", to: "/event" },
  { label: "Membership", to: "/membership" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "News", to: "/news" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact-us" },
];

const ADMIN_LINKS = [
  { label: "Members", to: "/member-manage" },
  { label: "Volunteers", to: "/volunteer-manage" },
];

function Nav() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleManagementOpen = (e) => setAnchorEl(e.currentTarget);
  const handleManagementClose = () => setAnchorEl(null);

  const isAdmin = user?.roles.includes(ROLES.ADMIN);

  const renderNavLinks = (onClick) =>
    NAV_LINKS.map(({ label, to }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClick}
        style={({ isActive }) => ({
          textDecoration: "none",
          color: isActive ? "#e88a1d" : "inherit",
          fontWeight: isActive ? 700 : 400,
        })}
      >
        <Button
          sx={{
            color: "inherit",
            fontWeight: "inherit",
            fontSize: "0.9rem",
            "&:hover": { color: "primary.main" },
          }}
        >
          {label}
        </Button>
      </NavLink>
    ));

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white", color: "text.primary", boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
        {/* Logo + title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 48, objectFit: "contain" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "secondary.main", display: { xs: "none", sm: "block" } }}>
            Charity Organization
          </Typography>
        </Box>

        {/* Desktop nav */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
          {renderNavLinks()}
          {isAdmin && (
            <>
              <Button onClick={handleManagementOpen} sx={{ color: "text.primary", fontSize: "0.9rem" }}>
                Management ▾
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleManagementClose}>
                {ADMIN_LINKS.map(({ label, to }) => (
                  <MenuItem key={to} onClick={() => { navigate(to); handleManagementClose(); }}>
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>

        {/* Social + auth */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
          <Box sx={{ display: "flex", gap: 1, color: "secondary.main", fontSize: "1.3rem" }}>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
              <FaInstagram />
            </a>
          </Box>
          {user ? (
            <>
              <Typography variant="body2" sx={{ color: "secondary.main", fontWeight: 600 }}>
                Hi, {user.first_name}
              </Typography>
              <Button variant="outlined" color="secondary" size="small" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" color="primary" size="small" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button variant="contained" color="primary" size="small" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile hamburger */}
        <IconButton sx={{ display: { md: "none" } }} onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <List>
            {NAV_LINKS.map(({ label, to }) => (
              <ListItem key={to} disablePadding>
                <ListItemButton component={NavLink} to={to} onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
            {isAdmin && (
              <>
                <Divider />
                {ADMIN_LINKS.map(({ label, to }) => (
                  <ListItem key={to} disablePadding>
                    <ListItemButton component={NavLink} to={to} onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary={label} primaryTypographyProps={{ color: "primary.main" }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}
            <Divider sx={{ my: 1 }} />
            <ListItem>
              {user ? (
                <Button fullWidth variant="outlined" color="secondary" onClick={() => { logout(); setDrawerOpen(false); }}>
                  Logout ({user.first_name})
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                  <Button fullWidth variant="outlined" color="primary" onClick={() => { navigate("/login"); setDrawerOpen(false); }}>
                    Log In
                  </Button>
                  <Button fullWidth variant="contained" color="primary" onClick={() => { navigate("/register"); setDrawerOpen(false); }}>
                    Sign Up
                  </Button>
                </Box>
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Nav;
