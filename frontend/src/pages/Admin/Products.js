import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Products = () => {
    const [products, setProducts] = useState([]);

    //getall products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/product/get-product");
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error("Someething Went Wrong");
        }
    };

    //lifecycle method
    useEffect(() => {
        getAllProducts();
    }, []);
    return (
        <Layout>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9 ">
                        <h1 className="text-center">All Apps List</h1>
                        <div className="row row-cols-1 row-cols-md-4 g-2">
                            {products?.map((p) => (
                                <div className="col">
                                    <Link
                                        key={p._id}
                                        to={`/dashboard/admin/product/${p.slug}`}
                                        className="product-link"
                                    >
                                        <div className="card m-2" style={{ width: "14rem" }}>
                                            <img
                                                src={`http://localhost:8080/api/product/product-photo/${p._id}`}
                                                className="card-img-top"
                                                alt={p.name}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{p.name}</h5>
                                                <p className="card-text">{p.description.split(" ").slice(0, 6).join(" ")}...</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;
