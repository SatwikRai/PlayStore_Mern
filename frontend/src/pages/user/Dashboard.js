

import React, { useState, useEffect, useRef } from "react";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/Auth";
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'; // Import the delete icon
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";

const Dashboard = () => {
    // Context
    const [auth, setAuth] = useAuth();

    // State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [adminMessages, setAdminMessages] = useState([]); // New state for admin messages
    const [sentMessage, setSentMessage] = useState("");
    const socket = useRef();

    useEffect(() => {
        socket.current = io.connect("http://localhost:8080");

        socket.current.on("user message", (msg) => {
            setMessage(msg);
            setAdminMessages((prevMessages) => [...prevMessages, msg]); // Add new message to the list
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        socket.current.emit("user message", sentMessage);
        setSentMessage("");
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Get user data
    useEffect(() => {
        const { email, name, password } = auth?.user;
        setName(name || "");
        setEmail(email || "");
        setPassword(password || "");
    }, [auth?.user]);

    // Handle delete message
    const handleDeleteMessage = (index) => {
        const updatedMessages = [...adminMessages];
        updatedMessages.splice(index, 1);
        setAdminMessages(updatedMessages);
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put("http://localhost:8080/api/auth/profile", {
                name,
                email,
                password,
            });

            if (data?.error) {
                toast.error(data?.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    document.title = 'Play store - Dashboard';

    return (
        <Layout>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        {/* User profile form */}

                        <div className="card">
                            <div className="card-header text-center">
                                <img src={require('../../Images/google-play.png')} alt="" className="logo" />
                                <h4>Update Your Play Store Profile</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* User profile form */}
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-control"
                                            id="nameInput"
                                            placeholder="Enter Your Name"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-control"
                                            id="emailInput"
                                            placeholder="Enter Your Email"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="form-control"
                                                id="passwordInput"
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
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        UPDATE
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Message from admin */}
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header text-center">
                                <h4>Notification Board</h4>
                            </div>
                            <div className="card-body">
                                {adminMessages.map((msg, index) => (
                                    <div key={index} className="mb-3">
                                        <input
                                            type="text"
                                            value={msg}
                                            readOnly
                                            className="form-control"
                                            placeholder="Message from Admin"
                                        />
                                        <button
                                            className="btn btn-danger mt-2"
                                            onClick={() => handleDeleteMessage(index)}
                                        >
                                            <FaTimes /> Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <input type="text" value={sentMessage} onChange={(e) => setSentMessage(e.target.value)} className="form-control" id="messageInput" placeholder="Message to Admin" />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

