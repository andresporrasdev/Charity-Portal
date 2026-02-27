import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

const EditVolunteerForm = ({ volunteer, roleOptions, onUpdateVolunteer, onClose }) => {
  const [editedUser, setEditedUser] = useState(volunteer);
  const [roleName, setRoleName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setEditedUser(volunteer);
    if (volunteer.preferredRole) {
      const role = roleOptions.find((role) => role.name === volunteer.preferredRole);
      setRoleName(role ? role.name : role._id);
    } else {
      setRoleName("");
    }
  }, [roleOptions, volunteer]);

  const handleRoleChange = (event) => {
    const { target: { value } } = event;
    const found = roleOptions.find((role) => role.name === value);
    const selectedRoleName = found ? found.name : "";
    setRoleName(selectedRoleName);
    setEditedUser((prev) => ({ ...prev, preferredRole: selectedRoleName }));
  };

  const handleUpdate = async () => {
    if (!editedUser.preferredRole) {
      setErrorMessage("Volunteer must have at least one role.");
    } else {
      onUpdateVolunteer(editedUser);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="edit-volunteer-dialog">
      <DialogTitle>Edit Volunteer</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {errorMessage && (
            <Grid item xs={12}>
              <Alert color="error">{errorMessage}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField label="Email" value={editedUser.email} fullWidth disabled sx={{ mt: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Name" value={editedUser.name} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Event Name" value={editedUser.event} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label="Role" value={roleName} onChange={handleRoleChange} fullWidth MenuProps={MenuProps}>
                {roleOptions.map((role) => (
                  <MenuItem key={role._id} value={role.name}>{role.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Created" value={editedUser.created} fullWidth disabled />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 2, p: 0 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
        <Button onClick={onClose} variant="contained" color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVolunteerForm;
