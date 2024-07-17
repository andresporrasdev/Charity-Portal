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

const EditVolunteerForm = ({ user, roleOptions, onUpdateUser, onClose }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [roleName, setRoleName] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setEditedUser(user);
    if (user.roles && Array.isArray(user.roles)) {
      setRoleName(
        // get and set role name instead of role id
        user.roles.map((roleId) => {
          const role = roleOptions.find((role) => role._id === roleId);
          return role ? role.name : roleId;
        })
      );
    } else {
      setRoleName([]);
    }
  }, [roleOptions, user]);

  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;

    // use role._id instead of role.name
    const selectedRoles = value.map((roleName) => {
      const role = roleOptions.find((role) => role.name === roleName);
      return role ? role._id : roleName;
    });

    setRoleName(value);
    setEditedUser({
      ...editedUser,
      roles: selectedRoles,
    });
  };

  const handleUpdate = async () => {
    if (editedUser.roles.length === 0) {
      setErrorMessage("User must have at least one role.");
    } else {
      onUpdateUser(editedUser);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="edit-user-dialog">
      <DialogTitle>Edit User </DialogTitle>
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
            <TextField label="First Name" value={editedUser.firstName} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Last Name" value={editedUser.lastName} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Roles</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Roles"
                multiple
                value={roleName}
                onChange={handleRoleChange}
                fullWidth
                MenuProps={MenuProps}
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role._id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Created" value={editedUser.created} fullWidth disabled />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVolunteerForm;
