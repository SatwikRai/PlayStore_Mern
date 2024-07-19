import React, { useEffect, useRef, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/Auth";
import io from "socket.io-client";

const AdminDashboard = () => {
    const [auth] = useAuth();
    const [message, setMessage] = useState("");
    const [receivedMessage, setReceivedMessage] = useState("");
    const socket = useRef(); // Define socket as a ref

    useEffect(() => {
        socket.current = io.connect("http://localhost:8080");

        socket.current.on("user message", (msg) => {
            setReceivedMessage(msg);
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        socket.current.emit("admin message", message);
        setMessage("");
    };

    document.title = 'Play Store - Admin';

    return (
        <Layout>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    {/* Admin details */}
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    {/* Admin message input */}
                    <div className="col-md-9">
                        <div className="card w-70 p-3">
                            <h3>Admin Name: {auth?.user?.name}</h3>
                            <h3>Admin Email: {auth?.user?.email}</h3>
                        </div>
                        <div className="card w-70 p-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-control"
                                placeholder="Enter your message"
                            />
                            <button
                                onClick={sendMessage}
                                className="btn btn-primary mt-2"
                            >
                                Send
                            </button>
                            <div className="mb-3">
                                <input type="text" value={receivedMessage} readOnly className="form-control" id="messageInput" placeholder="Message from User" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
