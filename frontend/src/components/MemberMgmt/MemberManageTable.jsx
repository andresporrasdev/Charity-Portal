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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
          },
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

        const columns = [
          { accessorKey: "id", header: "User ID" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "firstName", header: "First Name" },
          { accessorKey: "lastName", header: "Last Name" },
          { accessorKey: "roles", header: "Roles" },
          { accessorKey: "created", header: "Created", size: 50 },
          { accessorKey: "isActive", header: "Active Status" },
        ];
        setColumns(columns);
        setUserData(fetchedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BaseURL}/api/role/getAllRoles`);
      setRoleOptions(response.data.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleEditUserModalClose = () => {
    setShowEditUserModal(false);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const openEditUserModal = () => {
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (editedUser) => {
    try {
      const editUrl = `${BaseURL}/api/user/updateUser/${editedUser.id}`;
      const response = await axios.patch(editUrl, editedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        // 'roles'converted from role IDs to role names to display role names on the table
        const updatedUserData = {
          ...editedUser,
          roles: editedUser.roles
            .map((roleId) => {
              const role = roleOptions.find((role) => role._id === roleId);
              return role ? role.name : roleId;
            })
            .join(", "),
        };

        setUserData((prevUserData) => prevUserData.map((user) => (user.id === editedUser.id ? updatedUserData : user)));
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
      const deleteUrl = `${BaseURL}/api/user/deleteUser/${selectedUserId}`;
      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
        },
      });

      if (response.status === 204) {
        setUserData((prevUserData) => prevUserData.filter((user) => user.id !== selectedUserId));
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
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Actions",
        size: 30,
      },
    },
    renderRowActionMenuItems: ({ closeMenu, row, table }) => {
      const isActive = row.original.isActive === "Active";

      return [
        <MRT_ActionMenuItem
          icon={<Edit />}
          key="edit"
          label="Edit"
          disabled={!isActive}
          onClick={() => {
            if (isActive) {
              setSelectedUserId(row.original.id);
              openEditUserModal();
              closeMenu();
            }
          }}
          table={table}
        />,

        <MRT_ActionMenuItem
          icon={<Delete />}
          key="delete"
          label="Delete"
          disabled={!isActive}
          table={table}
          sx={{ border: 0 }}
          onClick={() => {
            if (isActive) {
              setSelectedUserId(row.original.id);
              openDeleteModal();
              closeMenu();
            }
          }}
        />,
      ];
    },
    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: "#fbe9e7",
        },
      },
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
        <ConfirmModal
          title="Delete"
          text="Do you really want to delete this user? Please type 'DELETE' to confirm."
          open={showDeleteModal}
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteModalClose}
          confirmWord="DELETE"
        />
      )}

      {showEditUserModal && (
        <EditUserForm
          user={{
            ...userData.find((user) => user.id === selectedUserId),
            //split the roles string into an array before passing to ensure the form receives the roles in the array format
            roles: userData.find((user) => user.id === selectedUserId).roles.split(", "),
          }}
          roleOptions={roleOptions}
          onUpdateUser={handleUpdateUser}
          onClose={handleEditUserModalClose}
        />
      )}
    </>
  );
};

export default MemberManageTable;
