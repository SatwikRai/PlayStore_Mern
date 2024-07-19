import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/Auth";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { register: login, handleSubmit, formState: { errors } } = useForm();
    const [auth, setAuth] = useAuth();
    const [showPassword, setShowPassword] = useState(false)

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();
    const location = useLocation();
    const onSubmit = async (data) => {
        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", data);
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    document.title = 'Play Store - Login'
    return (
        <Layout title="Login - Ecommer App">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header text-center">
                                <img src={require('../../Images/google-play.png')} alt="" className="logo" />
                                <h4>Login to Your Account</h4>
                            </div>
                            <div className="card-body">
                                <form id="login" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            {...login("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter Your Email "
                                        />
                                        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                                    </div>
                                    <div className="mb-3">

                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                {...login("password", {
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 8,
                                                        message: "Password should be at least 8 characters"
                                                    },
                                                    maxLength: {
                                                        value: 16,
                                                        message: "Password should not exceed 16 characters"
                                                    }
                                                })}
                                                className="form-control"
                                                id="password"
                                                placeholder="Enter Your Password"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                                            </button>
                                        </div>
                                        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-center">
                                            Forgot Password? <span onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer', textDecoration: 'underline', color: "blue" }}>Click here</span>
                                        </p>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" id="loginBtn">Log In</button>
                                    <p className="text-center">
                                        Don't have account? <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', textDecoration: 'underline', color: "blue" }}>Register</span>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
