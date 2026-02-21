import React, { useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import VolunteerManageTable from "../components/Volunteer/VolunteerManageTable";
import NotifyVolunteerForm from "../components/Volunteer/NotifyVolunteerForm";

const VolunteerManagePage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Volunteer Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
          Notify Volunteers
        </Button>
      </Box>
      <VolunteerManageTable />
      {showModal && <NotifyVolunteerForm open={showModal} onClose={() => setShowModal(false)} />}
    </Container>
  );
};

export default VolunteerManagePage;
