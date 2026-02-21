import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BaseURL from "../../config";
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
        const cols = [
          { accessorKey: "name", header: "Name" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "phone", header: "Phone", size: 50 },
          { accessorKey: "event", header: "Event" },
          { accessorKey: "preferredRole", header: "Role" },
          { accessorKey: "parent", header: "Parent", size: 60 },
          { accessorKey: "userId", header: "User ID" },
          { accessorKey: "created", header: "Created", size: 50 },
        ];
        setColumns(cols);
        setVolunteerData(fetchedData);
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    axios.get(`${BaseURL}/api/volunteerRole/getAllVolunteerRoles`)
      .then((r) => setRoleOptions(r.data.data.roles))
      .catch((e) => console.error("Error fetching roles:", e));
  }, []);

  const handleUpdateVolunteer = async (editedVolunteer) => {
    try {
      const response = await axios.patch(`${BaseURL}/api/volunteer/updateVolunteer/${editedVolunteer.id}`, editedVolunteer, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) {
        const updatedVolunteerData = {
          ...editedVolunteer,
          role: (() => {
            const role = roleOptions.find((r) => r._id === editedVolunteer.role);
            return role ? role.name : editedVolunteer.role;
          })(),
        };
        setVolunteerData((prev) => prev.map((v) => (v.id === editedVolunteer.id ? updatedVolunteerData : v)));
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
      const response = await axios.delete(`${BaseURL}/api/volunteer/deleteVolunteer/${selectedVolunteerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 200) {
        setVolunteerData((prev) => prev.filter((v) => v.id !== selectedVolunteerId));
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
    columns: useMemo(
      () => columns.map((column) => ({
        ...column,
        Cell: ({ row }) => <div>{row.original[column.accessorKey] || "N/A"}</div>,
      })),
      [columns]
    ),
    data: useMemo(() => volunteerData, [volunteerData]),
    enableRowActions: true,
    displayColumnDefOptions: { "mrt-row-actions": { header: "Actions", size: 30 } },
    renderRowActionMenuItems: ({ closeMenu, row, table }) => [
      <MRT_ActionMenuItem icon={<Edit />} key="edit" label="Edit" table={table}
        onClick={() => { setSelectedVolunteerId(row.original.id); setShowEditVolunteerModal(true); closeMenu(); }}
      />,
      <MRT_ActionMenuItem icon={<Delete />} key="delete" label="Delete" table={table} sx={{ border: 0 }}
        onClick={() => { setSelectedVolunteerId(row.original.id); setShowDeleteModal(true); closeMenu(); }}
      />,
    ],
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
        <ConfirmModal title="Delete" text="Do you really want to delete this Volunteer? Please type 'DELETE' to confirm."
          open={showDeleteModal} onConfirm={handleDeleteConfirm} onClose={() => setShowDeleteModal(false)} confirmWord="DELETE"
        />
      )}
      {showEditVolunteerModal && (
        <EditVolunteerForm
          volunteer={{
            ...volunteerData.find((v) => v.id === selectedVolunteerId),
            preferredRole: volunteerData.find((v) => v.id === selectedVolunteerId).preferredRole,
          }}
          roleOptions={roleOptions}
          onUpdateVolunteer={handleUpdateVolunteer}
          onClose={() => setShowEditVolunteerModal(false)}
        />
      )}
    </>
  );
};

export default VolunteerManageTable;
