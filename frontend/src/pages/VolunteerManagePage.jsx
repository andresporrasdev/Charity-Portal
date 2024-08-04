import React, { useState } from "react";
import VolunteerManageTable from "../components/Volunteer/VolunteerManageTable";
import NotifyVolunteerForm from "../components/Volunteer/NotifyVolunteerForm";

const VolunteerManagePage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAddEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="volunteer-manage-page">
      <h2>Volunteer Role Management</h2>
      <button className="notify-button" onClick={handleAddEvent}>
        Notify Volunteers
      </button>
      <VolunteerManageTable />
      {showModal && <NotifyVolunteerForm open={handleAddEvent} onClose={handleCloseModal} />}
    </div>
  );
};

export default VolunteerManagePage;
