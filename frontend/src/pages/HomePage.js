import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { FaStar } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Ratings } from "../components/Ratings";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useAuth } from "../context/Auth"; // Import the useAuth hook
import toast from "react-hot-toast";

const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth] = useAuth(); // Use the useAuth hook

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    //getTOtal COunt
    const getTotal = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/product/product-count");
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    //get all cat
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal()
    }, []);

    //get products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`http://localhost:8080/api/product/product-list/${page}`);
            setLoading(false)
            setProducts(data.products);
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // filter by cat
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    //get filterd product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post("http://localhost:8080/api/product/product-filters", {
                checked,
                radio,
            });
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    const installApp = (product) => {
        if (!auth?.token) {
            toast.error('You need to login to install this app');
            return;
        }
        setCart([...cart, product])
        localStorage.setItem('cart', JSON.stringify([...cart, product]))
        toast.success('App Installed');
    }
    document.title = 'Play Store - Home'
    return (
        <>
            <Layout>
                <div className="container-fluid row mt-3 justify-content-center">
                    <div className="row">
                        <div className="col-md-2">
                            <h4 className="text-center" data-testid='category' >App Categories</h4>
                            <div className="d-flex flex-column">
                                {categories?.map((c) => (
                                    <Checkbox
                                        key={c._id}
                                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                                    >
                                        {c.name}
                                    </Checkbox>
                                ))}
                            </div>
                            {/* price filter */}
                            <h4 className="text-center mt-4">Filter By Ratings</h4>
                            <div className="d-flex flex-column">
                                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                                    {Ratings?.map((p) => (
                                        <div key={p._id}>
                                            <Radio value={p.array}>{p.name}</Radio>
                                        </div>
                                    ))}
                                </Radio.Group>
                            </div>
                            <div className="d-flex flex-column">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => window.location.reload()}
                                >
                                    RESET FILTERS
                                </button>
                            </div>
                        </div>
                        <div className="col-md-9 ">
                            <h1 className="text-center">All Applications</h1>
                            <div className="row row-cols-1 row-cols-md-4 g-1 justify-content-center">
                                {products?.filter(p => p.isVisible).map((p) => (
                                    <div key={p._id} className="card m-2" style={{ width: "14rem" }}> {/* Ensure each child has a unique key */}
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
                                                <button className="btn btn-primary" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                                <button className="btn btn-secondary" onClick={() => installApp(p)}>Install</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="m-2 p-3">
                                {products && products.length < total && (
                                    <button
                                        className="btn btn-warning"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(page + 1);
                                        }}
                                    >
                                        {loading ? "Loading ..." : "Loadmore"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default HomePage;
