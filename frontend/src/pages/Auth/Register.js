import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const formatDate = (event) => {
        var inputDate = event.target.value;
        var date = new Date(inputDate);
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var formattedDate = day + "-" + month + "-" + date.getFullYear();
        console.log(formattedDate);
    }


    const onSubmit = async (data) => {
        try {
            const res = await axios.post("http://localhost:8080/api/auth/register", data);
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    document.title = 'Play Store - Register'
    return (
        <Layout title="Register - Ecommer App">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header text-center">
                                <img src={require('../../Images/google-play.png')} alt="" className="logo" />
                                <h4>Create a Play Store Account</h4>
                            </div>
                            <div className="card-body">
                                <form id="register" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Username</label>
                                        <input
                                            {...register("name", {
                                                required: "Username is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Username should be at least 8 characters"
                                                },
                                                maxLength: {
                                                    value: 16,
                                                    message: "Username should not exceed 16 characters"
                                                }
                                            })}
                                            className="form-control"
                                            id="name"
                                            placeholder="Enter Your Name"
                                            autoFocus
                                        />
                                        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            {...register("email", {
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
                                                {...register("password", {
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
                                        {errors.password && <p style={{ color: 'red' }} >{errors.password.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                {...register("confirmPassword", {
                                                    required: "Please confirm your password",
                                                    validate: {
                                                        matchesPreviousPassword: (value) => {
                                                            const { password } = watch();
                                                            return password === value || "Passwords should match!";
                                                        }
                                                    }
                                                })}
                                                className="form-control"
                                                id="confirm-password"
                                                placeholder="Enter Your Password Again"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p style={{ color: 'red' }} >{errors.confirmPassword.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="answer" className="form-label">What is your DoB?</label>
                                        <input type="date" {...register("answer", { required: "answer is required", message: 'answer should not be empty' })} className="form-control" id="dateInput" placeholder="Enter Your Answer" onChange={formatDate} />

                                        {errors.answer && <p style={{ color: 'red' }} >{errors.answer.message}</p>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" id="registerBtn">Sign Up</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;

