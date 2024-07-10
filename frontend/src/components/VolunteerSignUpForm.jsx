import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VolunteerSignUpForm.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; //Use navigate to redirect to another page

const VolunteerSignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    preferredRoles: '',
    event: '',
    parentName: '',
    agreePolicies: false,
    understandUnpaid: false,
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [events, setEvents] = useState([]);
  const location = useLocation();

  const fetchUserInfo = async (token) => {
    try {    
      const response = await axios.get("http://localhost:3000/api/user/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // console.log("response",response)

      setFormData((prevFormData) => ({
        ...prevFormData,
        name: `${response.data.data.user.first_name} ${response.data.data.user.last_name}`, 
        email: response.data.data.user.email,
      }));
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo(token);
    } else {
      console.log("No token found, user not logged in")
    }


    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/event/readEvent');
        // console.log("events",response.data)
        const futureEvents = response.data.filter(event => new Date(event.time) >= new Date())
                .sort((a, b) => new Date(b.time) - new Date(a.time));
        // console.log("futureEvents",futureEvents)
                setEvents(futureEvents);

        if (location.state && location.state.eventName) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            event: location.state.eventName,
          }));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact Number is required';
    } else if (!phonePattern.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    if (!formData.preferredRoles) newErrors.preferredRoles = 'Preferred Roles is required';
    if (!formData.event) newErrors.event = 'Event is required';
    if (!formData.agreePolicies) newErrors.agreePolicies = 'You must agree to the policies';
    if (!formData.understandUnpaid) newErrors.understandUnpaid = 'You must understand the volunteer position is unpaid';
    if (!formData.parentName) newErrors.parentName = 'Parent Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('http://localhost:3000/api/volunteer/volunteerSignUp', formData);
        alert('Volunteer signed up successfully! \nPress OK to return to the events page');        setSubmissionStatus('success');
        navigate('/event');
      } catch (error) {
        console.error('Error signing up volunteer:', error);
        setSubmissionStatus('fail');
      }
    } else {
      console.log("Form validation failed", errors);
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      preferredRoles: '',
      event: '',
      parentName: '',
      agreePolicies: false,
      understandUnpaid: false,
    });
    setErrors({});
  };

  return (
    <div className="volunteer-signup-form">
      <h2>Volunteer Sign-Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="input-box">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="input-box">
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            required
          />
          {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
        </div>
        <div className="input-box">
          <select
            name="preferredRoles"
            value={formData.preferredRoles}
            onChange={handleChange}
            required
          >
            <option value="">Select your preferred role</option>
            <option value="Tea area">Tea area: Guide guests at the Tea station: make sure snack tray is refilled: Tea cups/ sugar refilled etc.</option>
            <option value="Reception table">Reception table: Greet the members, ask them if they have the band, offer them the candy/flowers etc.</option>
            <option value="Door Greeter">Door Greeter: Check the wrist band at the Auditorium entrance and Dinner hall entrance and allow ppl inside</option>
            <option value="Back Stage">Back Stage: Help in organizing the performers in the green room: help certificate distribution: stage</option>
            <option value="Comms">Comms: Audio video coordination</option>
            <option value="Dinner">Dinner</option>
          </select>
          {errors.preferredRoles && <p className="error">{errors.preferredRoles}</p>}
        </div>
        <div className="input-box">
          <select
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
          >
            <option value="">Select an event</option>
            {events.map(event => (
              <option key={event.id} value={event.name}>{event.name}</option>
            ))}
          </select>
          {errors.event && <p className="error">{errors.event}</p>}
        </div>
        <div className="input-box">
          <input
            type="text"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            placeholder="Name the parent who is the member of OTS"
            // required
          />
          {errors.parentName && <p className="error">{errors.parentName}</p>}
        </div>
        <div className="volunteer-agreement">
          <label>
            <input
              type="checkbox"
              name="agreePolicies"
              checked={formData.agreePolicies}
              onChange={handleChange}
              required
            />
            I agree to abide by the policies and guidelines of Ottawa Tamil Sangam
          </label>
          {errors.agreePolicies && <p className="error">{errors.agreePolicies}</p>}
          <label>
            <input
              type="checkbox"
              name="understandUnpaid"
              checked={formData.understandUnpaid}
              onChange={handleChange}
              required
            />
            I understand that my volunteer position is unpaid and does not imply any employment relationship.
          </label>
          {errors.understandUnpaid && <p className="error">{errors.understandUnpaid}</p>}
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleClearForm} className="clear-form">Clear form</button>
      </form>
      {submissionStatus === 'success' && <p>Thank you for signing up as a volunteer!</p>}
      {submissionStatus === 'fail' && <p>There was an error submitting the form. Please try again.</p>}
    </div>
  );
};

export default VolunteerSignUpForm;