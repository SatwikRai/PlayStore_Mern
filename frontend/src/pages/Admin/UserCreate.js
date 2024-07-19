import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import useForm
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const UserCreate = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm(); // Destructure useForm
    const [values, setValues] = useState({
        name: '',
        email: '',
        answer: '',
        password: '',
        role: ''
    });
    const [showPassword, setShowPassword] = useState(false);

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
        setValues({ ...values, answer: formattedDate }); // Update the state with the formatted date
    };

    const onSubmit = (data) => {
        axios.post('http://localhost:8080/api/auth/user', values)
            .then(res => {
                toast.success('User Created Successfully');
                navigate('/dashboard/admin/users');
            })
            .catch(err => console.log(err));
    };

    return (
        <Layout title={"Dashboard - Create Product"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="m-1 w-75">
                            <h2>Add User</h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-2">
                                    <label htmlFor="name">User Name:</label>
                                    <input type="text" name="name" className="form-control" placeholder="Enter User name" onChange={e => setValues({ ...values, name: e.target.value })} />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" name="email" className="form-control" placeholder="Enter Email" onChange={e => setValues({ ...values, email: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="answer" className="form-label">What is your DoB?</label>
                                    <input type="date" {...register("answer", { required: "DoB is required" })} className="form-control" id="dateInput" placeholder="Enter Your DoB" onChange={formatDate} />
                                    {errors.answer && <p style={{ color: 'red' }}>{errors.answer.message}</p>}
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="password">Password:</label>
                                    <div className="input-group">
                                        <input type={showPassword ? 'text' : 'password'} name="password" className="form-control" placeholder="Enter password" onChange={e => setValues({ ...values, password: e.target.value })} /> <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="role">Role:</label>
                                    <input type="text" name="role" className="form-control" placeholder="Enter User role" onChange={e => setValues({ ...values, role: e.target.value })} />
                                </div>
                                <button className="btn btn-success">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserCreate;
