import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Layout from "../components/Layout/Layout";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});

    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/category/get-category");
            setCategories(data?.category);
            if (data?.category) {
                data.category.forEach((category) => {
                    getProductsByCategory(category.slug);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProductsByCategory = async (slug) => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/product/product-category/${slug}`);
            setProductsByCategory((prev) => ({ ...prev, [slug]: data?.products }));
        } catch (error) {
            console.log(error);
        }
    };

    document.title = 'Play Store - Categories'
    return (
        <Layout >
            <div className="container">
                {categories.map((category) => (
                    <div key={category._id} className="mb-5">
                        <h4>{category.name}</h4>
                        <Link to={`/category/${category.slug}`} className="btn btn-primary mb-3">
                            View All
                        </Link>
                        <div className="col-md-9 offset-1">
                            <div className="row row-cols-1 row-cols-md-4 g-2">
                                {productsByCategory[category.slug]?.filter(p => p.isVisible).map((product) => (
                                    <div key={product._id} className="col">
                                        <div className="card" style={{ width: "14rem" }} >
                                            <img
                                                src={`http://localhost:8080/api/product/product-photo/${product._id}`}
                                                className="card-img-top"
                                                alt={product.name}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="card-text">
                                                    {product.description.substring(0, 30)}...
                                                </p>
                                                <p className="card-text"> <IconContext.Provider value={{ className: 'star-icon' }}>
                                                    <FaStar />
                                                </IconContext.Provider>  {product.price}</p>
                                                <Link to={`/product/${product.slug}`} className="btn btn-primary">
                                                    More Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Categories;
