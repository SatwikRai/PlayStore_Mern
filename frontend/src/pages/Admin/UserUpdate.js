import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UserUpdate = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: '',
        email: '',
        answer: '',
        password: '',
        role: ''
    })

    useEffect(() => {
        axios.get(`http://localhost:8080/api/auth/user/${id}`)
            .then(res => {
                console.log('Data retrieved:', res.data); // This will log the data to the console
                setValues(res.data.user);
            })
            .catch(err => console.log(err));
    }, []);


    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:8080/api/auth/user/${id}`, values)
            .then(res => {
                navigate('/dashboard/admin/users');
            })
            .catch(err => console.log(err));
    };

    return (
        <Layout title={"Dashboard - Update User"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Users</h1>
                        <div className="m-1 w-75">
                            <form onSubmit={handleUpdate}>
                                <div className="mb-2">
                                    <label htmlFor="name">User Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Update User name"
                                        value={values.name}
                                        onChange={e => setValues({ ...values, name: e.target.value })}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Update Email"
                                        value={values.email}
                                        onChange={e => setValues({ ...values, email: e.target.value })}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="answer">DoB:</label>
                                    <input
                                        type="text"
                                        name="answer"
                                        className="form-control"
                                        placeholder="yy-mm-dd"
                                        value={values.answer}
                                        onChange={e => setValues({ ...values, answer: e.target.value })}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="text"
                                        name="password"
                                        className="form-control"
                                        placeholder="Update password"
                                        value={values.password}
                                        onChange={e => setValues({ ...values, password: e.target.value })}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="role">Role:</label>
                                    <input
                                        type="text"
                                        name="role"
                                        className="form-control"
                                        placeholder="Update User role"
                                        value={values.role}
                                        onChange={e => setValues({ ...values, role: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-success">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserUpdate;
