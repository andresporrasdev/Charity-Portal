import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./VolunteerSignUpForm.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; //Use navigate to redirect to another page
import OtpModal from "../Otp/OtpModal";
import { UserContext } from "../../UserContext";
import BaseURL from "../../config";

const VolunteerSignUpForm = () => {
  const navigate = useNavigate();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    preferredRole: "",
    event: "",
    parentName: "",
    agreePolicies: false,
    understandUnpaid: false,
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const [roles, setRoles] = useState([]); //Handle volunteer roles

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get(`${BaseURL}/api/user/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (user) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: `${response.data.data.user.first_name} ${response.data.data.user.last_name}`,
          email: response.data.data.user.email,
          userId: user._id,
        }));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo(token);
    } else {
      console.log("No token found, user not logged in");
    }

    // Fetch voluntter Roles from the backend

    const fetchVolunteerRoles = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/volunteerRole/getAllVolunteerRoles`);
        setRoles(response.data.data.roles); // Assuming the API response structure is { data: { roles: [...] } }
        // ...prevFormData,
        //   preferredRole: `${response.data.data.name}`,
        // }));
      } catch (error) {
        console.error("Error fetching volunteer roles:", error);
      }
    };

    fetchVolunteerRoles();

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/event/readEvent`);
        const futureEvents = response.data
          .filter((event) => new Date(event.time) >= new Date())
          .sort((a, b) => new Date(b.time) - new Date(a.time));
        setEvents(futureEvents);

        if (location.state && location.state.eventId) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            event: location.state.eventId,
          }));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    if (user) {
      setIsEmailVerified(true);
    }
  }, [location.state, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "email") {
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email is required",
        }));
      } else if (!emailPattern.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    }
  };

  const newErrors = {};

  const validateForm = () => {
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact Number is required";
    } else if (!phonePattern.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }
    if (!formData.preferredRole) newErrors.preferredRole = "Preferred Roles is required";
    if (!formData.event) newErrors.event = "Event is required";
    if (!formData.agreePolicies) newErrors.agreePolicies = "You must agree to the policies";
    if (!formData.understandUnpaid) newErrors.understandUnpaid = "You must understand the volunteer position is unpaid";
    // if (!formData.parentName) newErrors.parentName = 'Parent Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setVerifyError("Please verify your email before submitting.");
      return;
    }

    if (validateForm()) {
      try {
        await axios.post(`${BaseURL}/api/volunteer/volunteerSignUp`, formData);
        alert("Volunteer signed up successfully! \nPress OK to return to the events page");
        setSubmissionStatus("success");
        navigate("/event");
      } catch (error) {
        console.error("Error signing up volunteer:", error);
        setSubmissionStatus("fail");
      }
    } else {
      console.log("Form validation failed", errors);
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      email: "",
      contactNumber: "",
      preferredRole: "",
      event: "",
      parentName: "",
      agreePolicies: false,
      understandUnpaid: false,
    });
    setIsEmailVerified(false);
    setErrors({});
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    setLoading(true);
    setVerifyError("");

    try {
      console.log("Sending OTP request to server...");
      const response = await axios.post(`${BaseURL}/api/otp/send-otp`, {
        email: formData.email,
        source: "volunteer",
      });
      console.log("OTP response received:", response.data);

      if (response.data.status === "success") {
        setShowOtpModal(true);
      } else if (response.data.status === "fail") {
        setVerifyError(response.data.message);
        console.error("Failed to send OTP:", response.data.message);
      }
    } catch (error) {
      setVerifyError(error.response.data.message);
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting OTP to server...");
      const response = await axios.post(`${BaseURL}/api/otp/verify-otp`, { email: formData.email, otp });
      console.log("OTP verification response:", response.data);

      if (response.data.status === "success") {
        setIsEmailVerified(true);
        setShowOtpModal(false);
        setOtpError("");
        alert("OTP verified successfully!");
      } else if (response.data.status === "fail") {
        setOtpError(response.data.message);
        console.error("Failed to verify OTP:", response.data.message);
      }
    } catch (error) {
      setOtpError(error.response.data.status);
      console.error("Error submitting OTP:", error);
    }
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
        <div className="input-box email-verify-container">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isEmailVerified}
          />

          {!isEmailVerified && (
            <button
              className="verify-button"
              onClick={handleVerify}
              disabled={!formData.email || !emailPattern.test(formData.email)}
            >
              Verify
            </button>
          )}
          {isEmailVerified && (
            <button className="verify-button verified" disabled>
              Verified!
            </button>
          )}
        </div>
        {errors.email && <p className="email-error">{errors.email}</p>}
        {verifyError && <div className="custom-error">{verifyError}</div>}
        {loading && <p className="loading-spinner">Loading...</p>}
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
          <select name="preferredRole" value={formData.preferredRole} onChange={handleChange} required>
            <option value="">Select your preferred Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}: {role.description}
              </option>
            ))}
          </select>
          {errors.preferredRole && <p className="error">{errors.preferredRole}</p>}
        </div>
        <div className="input-box">
          <select name="event" value={formData.event} onChange={handleChange} required>
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event._id}>
                {event.name}
              </option>
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
            I agree to abide by the{" "}
            <a href="/policy" target="_blank" rel="noopener noreferrer">
              policies and guidelines of Ottawa Tamil Sangam
            </a>
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
        <button type="button" onClick={handleClearForm} className="clear-form">
          Clear form
        </button>
      </form>
      {submissionStatus === "success" && <p>Thank you for signing up as a volunteer!</p>}
      {submissionStatus === "fail" && <p>There was an error submitting the form. Please try again.</p>}

      {showOtpModal && (
        <OtpModal
          otp={otp}
          setOtp={setOtp}
          otpError={otpError}
          handleOtpSubmit={handleOtpSubmit}
          setShowOtpModal={setShowOtpModal}
        />
      )}
    </div>
  );
};

export default VolunteerSignUpForm;
