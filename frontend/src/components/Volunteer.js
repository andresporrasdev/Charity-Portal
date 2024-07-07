// src/pages/Volunteer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import VolunteerSignUpForm from '../components/Volunteer/VolunteerSignUpForm';

const Volunteer = () => {
    const location = useLocation();
    const eventName = location.state?.eventName || '';

    return (
        <div>
            <VolunteerSignUpForm eventName={eventName} />
        </div>
    );
};

export default Volunteer;
