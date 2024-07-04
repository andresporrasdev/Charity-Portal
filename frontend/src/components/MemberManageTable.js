import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import BaseURL from "../config.js";
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem } from "material-react-table";
import { Edit, Delete } from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import ConfirmModal from "./ConfirmModal.js";
import UserContext from "../UserContext";

const MemberManageTable = () => {
  const [columns, setColumns] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const apiUrl = `${BaseURL}/api/user/getAllUsers`;
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //"http://localhost:3000/api/user/getAllUsers"
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
          roles: user.roles.join(", "),
          created: new Date(user.created).toISOString().split("T")[0],
        }));

        const columns = [
          { accessorKey: "email", header: "Email" },
          { accessorKey: "firstName", header: "First Name" },
          { accessorKey: "lastName", header: "Last Name" },
          { accessorKey: "roles", header: "Roles" },
          { accessorKey: "created", header: "Created", size: 50 },
        ];
        setColumns(columns);
        setUserData(fetchedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleClose = () => {
    console.log("Cancel Confirmation");
    setShowDeleteModal(false);
  };

  const openModal = () => {
    console.log("Delete Confirmation");
    setShowDeleteModal(true);
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
    renderRowActionMenuItems: ({ row, table }) => [
      <MRT_ActionMenuItem icon={<Edit />} key="edit" label="Edit" onClick={() => console.info("Edit")} table={table} />,
      <MRT_ActionMenuItem
        icon={<Delete />}
        key="delete"
        label="Delete"
        table={table}
        sx={{ border: 0 }}
        onClick={() => {
          setSelectedUserId(row.original.id);
          openModal();
        }}
      />,
    ],
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
          text="Do you really want to delete this user?"
          open={showDeleteModal}
          onConfirm={handleDeleteConfirm}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default MemberManageTable;
