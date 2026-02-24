import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BaseURL from "../../config";
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem } from "material-react-table";
import { Edit, Delete } from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import ConfirmModal from "../ConfirmModal.jsx";
import EditUserForm from "./EditUserForm.jsx";

const MemberManageTable = () => {
  const [columns, setColumns] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const apiUrl = `${BaseURL}/api/user/getAllUsers`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = response.data;
        const fetchedData = data.data.users.map((user) => ({
          id: user._id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.isActive ? "Active" : "Inactive",
          roles: user.roles.join(", "),
          created: new Date(user.created).toISOString().split("T")[0],
        }));
        const cols = [
          { accessorKey: "id", header: "User ID" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "firstName", header: "First Name" },
          { accessorKey: "lastName", header: "Last Name" },
          { accessorKey: "roles", header: "Roles" },
          { accessorKey: "created", header: "Created", size: 50 },
          { accessorKey: "isActive", header: "Active Status" },
        ];
        setColumns(cols);
        setUserData(fetchedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    axios.get(`${BaseURL}/api/role/getAllRoles`)
      .then((r) => setRoleOptions(r.data.data.roles))
      .catch((e) => console.error("Error fetching roles:", e));
  }, []);

  const handleUpdateUser = async (editedUser) => {
    try {
      const response = await axios.patch(`${BaseURL}/api/user/updateUser/${editedUser.id}`, editedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) {
        const updatedUserData = {
          ...editedUser,
          roles: editedUser.roles
            .map((roleId) => {
              const role = roleOptions.find((r) => r._id === roleId);
              return role ? role.name : roleId;
            })
            .join(", "),
        };
        setUserData((prev) => prev.map((u) => (u.id === editedUser.id ? updatedUserData : u)));
      } else {
        throw new Error("Failed to edit user");
      }
    } catch (error) {
      console.error("Error editing user:", error);
    } finally {
      setShowEditUserModal(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`${BaseURL}/api/user/deleteUser/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 204) {
        setUserData((prev) => prev.filter((u) => u.id !== selectedUserId));
        window.location.reload();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const table = useMaterialReactTable({
    columns: useMemo(() => columns, [columns]),
    data: useMemo(() => userData, [userData]),
    enableRowActions: true,
    displayColumnDefOptions: { "mrt-row-actions": { header: "Actions", size: 30 } },
    renderRowActionMenuItems: ({ closeMenu, row, table }) => {
      const isActive = row.original.isActive === "Active";
      return [
        <MRT_ActionMenuItem icon={<Edit />} key="edit" label="Edit" disabled={!isActive} table={table}
          onClick={() => { if (isActive) { setSelectedUserId(row.original.id); setShowEditUserModal(true); closeMenu(); } }}
        />,
        <MRT_ActionMenuItem icon={<Delete />} key="delete" label="Delete" disabled={!isActive} table={table} sx={{ border: 0 }}
          onClick={() => { if (isActive) { setSelectedUserId(row.original.id); setShowDeleteModal(true); closeMenu(); } }}
        />,
      ];
    },
    muiTableBodyProps: {
      sx: { "& tr:nth-of-type(odd) > td": { backgroundColor: "#fbe9e7" } },
    },
  });

  return (
    <>
      <Container sx={{ padding: "20px" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <MaterialReactTable table={table} />
        </Box>
      </Container>
      {showDeleteModal && (
        <ConfirmModal title="Delete" text="Do you really want to delete this user? Please type 'DELETE' to confirm."
          open={showDeleteModal} onConfirm={handleDeleteConfirm} onClose={() => setShowDeleteModal(false)} confirmWord="DELETE"
        />
      )}
      {showEditUserModal && (
        <EditUserForm
          user={{
            ...userData.find((u) => u.id === selectedUserId),
            roles: userData.find((u) => u.id === selectedUserId).roles.split(", "),
          }}
          roleOptions={roleOptions}
          onUpdateUser={handleUpdateUser}
          onClose={() => setShowEditUserModal(false)}
        />
      )}
    </>
  );
};

export default MemberManageTable;
