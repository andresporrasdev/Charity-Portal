import React from "react";
import { Container, Typography } from "@mui/material";
import MemberManageTable from "../components/MemberMgmt/MemberManageTable";

const MemberManagePage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Member Role Management</Typography>
      <MemberManageTable />
    </Container>
  );
};

export default MemberManagePage;
