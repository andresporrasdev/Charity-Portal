import React from "react";
import { Box, Container, Typography, Link, Divider } from "@mui/material";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "secondary.main",
        color: "white",
        py: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Charity Organization Portal
          </Typography>
          <Box sx={{ display: "flex", gap: 2, fontSize: "1.5rem" }}>
            <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" color="inherit">
              <FaFacebook />
            </Link>
            <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" color="inherit">
              <FaInstagram />
            </Link>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />
        <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} Charity Organization Portal. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
