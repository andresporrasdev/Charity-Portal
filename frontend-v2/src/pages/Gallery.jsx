import React from "react";
import { Container, Typography, Grid, Skeleton, Box } from "@mui/material";

function Gallery() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Gallery</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Our photo gallery is coming soon. Stay tuned for photos from our events!
      </Typography>
      <Grid container spacing={2}>
        {Array.from({ length: 9 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rectangular" sx={{ borderRadius: 2, pt: "75%" }} animation="wave" />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Gallery;
