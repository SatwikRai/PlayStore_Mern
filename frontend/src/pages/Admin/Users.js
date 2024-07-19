import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios';
const Users = () => {

    const [data, setData] = useState([]);

    // To get data
    useEffect(() => {
        axios.get('http://localhost:8080/api/auth/users')
            .then(res => setData(res.data.users)) // Assuming the response has a 'users' field
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        if (typeof id === 'undefined') {
            console.error('User ID is undefined. Cannot delete user.');
            return;
        }
        try {
            const confirm = window.confirm("Would you like to delete the records?");
            if (confirm) {
                await axios.delete(`http://localhost:8080/api/auth/user/${id}`);
                setData(data.filter(user => user._id !== id)); // Update state locally, assuming each user has an '_id' field
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout title={"Dashboard - All Users"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-12">
                        <AdminMenu />
                    </div>
                    <div className="col-lg-8 col-md-9 col-sm-12">
                        <div className="justify-content-center align-items-center vh-100">
                            <h2>List of Users</h2>
                            <div className="table-responsive  rounded bg-white border shadow p-4">
                                <div className="d-flex justify-content-end">
                                    <NavLink
                                        to="/dashboard/admin/create"
                                        className="btn btn-success btn-sm"
                                    >
                                        Create Users
                                    </NavLink>
                                </div>
                                <table className="table table-stripped">
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Email</th>
                                            <th>DoB</th>
                                            <th>Password</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((d, i) => (
                                                <tr key={i}>
                                                    <td>{d.name}</td>
                                                    <td>{d.email}</td>
                                                    <td>{d.answer}</td>
                                                    <td>{d.password.substring(0, 6)}...</td>
                                                    <td>{d.role}</td>
                                                    <td>
                                                        <NavLink to={`/dashboard/admin/update/${d._id}`} className="btn btn-sm btn-primary me-2">Edit</NavLink>
                                                        <button onClick={e => handleDelete(d._id)} className="btn btn-sm btn-danger">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Users;


