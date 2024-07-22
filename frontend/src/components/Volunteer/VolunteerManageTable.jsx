import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BaseURL from "../../config.js";
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem } from "material-react-table";
import { Edit, Delete } from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import ConfirmModal from "../ConfirmModal.jsx";
import EditVolunteerForm from "./EditVolunteerForm.jsx";

const VolunteerManageTable = () => {
  const [columns, setColumns] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditVolunteerModal, setShowEditVolunteerModal] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const apiUrl = `${BaseURL}/api/volunteer/getAllVolunteers`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
          },
        });
        const data = response.data;

        const fetchedData = data.data.volunteers.map((volunteer) => ({
          id: volunteer._id,
          email: volunteer.email,
          phone: volunteer.contactNumber,
          name: volunteer.name,
          event: volunteer.event,
          preferredRole: volunteer.preferredRole,
          parent: volunteer.parentName,
          userId: volunteer.userId,
          created: new Date(volunteer.createdAt).toISOString().split("T")[0],
        }));

        const columns = [
          { accessorKey: "name", header: "Name" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "phone", header: "Phone", size: 50 },
          { accessorKey: "event", header: "Event" },
          { accessorKey: "preferredRole", header: "Role" },
          { accessorKey: "parent", header: "Parent", size: 60 },
          { accessorKey: "userId", header: "User ID" },
          { accessorKey: "created", header: "Created", size: 50 },
        ];
        setColumns(columns);
        setVolunteerData(fetchedData);
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
      const response = await axios.get(`${BaseURL}/api/volunteerRole/getAllVolunteerRoles`);
      setRoleOptions(response.data.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleEditVolunteerModalClose = () => {
    setShowEditVolunteerModal(false);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const openEditVolunteerModal = () => {
    setShowEditVolunteerModal(true);
  };

  const handleUpdateVolunteer = async (editedVolunteer) => {
    try {
      const editUrl = `${BaseURL}/api/volunteer/updateVolunteer/${editedVolunteer.id}`;
      const response = await axios.patch(editUrl, editedVolunteer, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        // 'roles'converted from role IDs to role names to display role names on the table
        const updatedVolunteerData = {
          ...editedVolunteer,
          role: (() => {
            const role = roleOptions.find((role) => role._id === editedVolunteer.role);
            return role ? role.name : editedVolunteer.role;
          })(),
        };

        setVolunteerData((prevVolunteerData) =>
          prevVolunteerData.map((Volunteer) => (Volunteer.id === editedVolunteer.id ? updatedVolunteerData : Volunteer))
        );
      } else {
        throw new Error("Failed to edit Volunteer");
      }
    } catch (error) {
      console.error("Error editing Volunteer:", error);
    } finally {
      setShowEditVolunteerModal(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const deleteUrl = `${BaseURL}/api/volunteer/deleteVolunteer/${selectedVolunteerId}`;
      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
        },
      });

      if (response.status === 200) {
        setVolunteerData((prevVolunteerData) =>
          prevVolunteerData.filter((volunteer) => volunteer.id !== selectedVolunteerId)
        );
        window.location.reload();
      } else {
        throw new Error("Failed to delete Volunteer");
      }
    } catch (error) {
      console.error("Error deleting Volunteer:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const table = useMaterialReactTable({
    //columns: useMemo(() => columns, [columns]),
    columns: useMemo(
      () =>
        columns.map((column) => ({
          ...column,
          Cell: ({ row }) => <div>{row.original[column.accessorKey] || "N/A"}</div>,
        })),
      [columns]
    ),
    data: useMemo(() => volunteerData, [volunteerData]),
    enableRowActions: true,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Actions",
        size: 30,
      },
    },
    renderRowActionMenuItems: ({ closeMenu, row, table }) => [
      <MRT_ActionMenuItem
        icon={<Edit />}
        key="edit"
        label="Edit"
        onClick={() => {
          setSelectedVolunteerId(row.original.id);
          openEditVolunteerModal();
          closeMenu();
        }}
        table={table}
      />,
      <MRT_ActionMenuItem
        icon={<Delete />}
        key="delete"
        label="Delete"
        table={table}
        sx={{ border: 0 }}
        onClick={() => {
          setSelectedVolunteerId(row.original.id);
          openDeleteModal();
          closeMenu();
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
          text="Do you really want to delete this Volunteer?"
          open={showDeleteModal}
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteModalClose}
        />
      )}

      {showEditVolunteerModal && (
        <EditVolunteerForm
          volunteer={{
            ...volunteerData.find((volunteer) => volunteer.id === selectedVolunteerId),
            preferredRole: volunteerData.find((volunteer) => volunteer.id === selectedVolunteerId).preferredRole,
          }}
          roleOptions={roleOptions}
          onUpdateVolunteer={handleUpdateVolunteer}
          onClose={handleEditVolunteerModalClose}
        />
      )}
    </>
  );
};

export default VolunteerManageTable;
