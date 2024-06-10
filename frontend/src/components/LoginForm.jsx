import React from 'react';
import { NavLink } from 'react-router-dom';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
    return (
        <div className='wrapper'>
            <form action="">
                <h1>Login</h1>
                <div className="input-box">
                    <FaUser className='icon' />
                    <input type="text" placeholder='Username' required />
                    
                </div>
                <div className="input-box">
                    <FaLock className='icon' />
                    <input type="password" placeholder='Password' required />
                    
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">LOGIN</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="/Register">Sign up</a></p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;