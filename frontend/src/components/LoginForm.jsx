import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validate = () => {
        let isValid = true;
        if (!isValidEmail(email)) {
            setEmailError("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError("");
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Email:", email);
            console.log("Password:", password);
            // Here you can handle the form submission, e.g., send a request to your server
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-box">
                    <FaUser className='icon' />
                    <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {emailError && <p className="error">{emailError}</p>}

                <div className="input-box">
                    <FaLock className='icon' />
                    <input type="password" placeholder='Password' value={password}
                        onChange={(e) => setPassword(e.target.value)} required />                
                </div>
                {passwordError && <p className="error">{passwordError}</p>}
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="/Register">Sign up</a></p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;