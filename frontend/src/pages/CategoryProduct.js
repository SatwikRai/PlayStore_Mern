import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from 'react-icons/fa';
import { IconContext } from 'react-icons';
const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        if (params?.slug) getPrductsByCat();
    }, [params?.slug]);
    const getPrductsByCat = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:8080/api/product/product-category/${params.slug}`
            );
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="container mt-3">
                <h4 className="text-center">Category - {category?.name}</h4>
                <h6 className="text-center">{products?.length} result found </h6>
                <div className="row">
                    <div className="col-md-9 offset-1">
                        <div className="row row-cols-1 row-cols-md-4 g-2">
                            {products?.filter(p => p.isVisible).map((p) => (
                                <div className="col" key={p._id}>
                                    <div
                                        className="card m-2"
                                        style={{ width: "14rem" }}
                                    >
                                        <img
                                            src={`http://localhost:8080/api/product/product-photo/${p._id}`}
                                            className="card-img-top"
                                            alt={p.name}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">
                                                {p.description.substring(0, 30)}...
                                            </p>
                                            <p className="card-text"> <IconContext.Provider value={{ className: 'star-icon' }}>
                                                <FaStar />
                                            </IconContext.Provider>  {p.price}</p>
                                            <div className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => navigate(`/product/${p.slug}`)}
                                                >
                                                    More Details
                                                </button>
                                                <button className="btn btn-secondary">
                                                    Install
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CategoryProduct;
