import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { FaStar } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useAuth } from "../context/Auth"; // Import the useAuth hook
import toast from "react-hot-toast";
const Search = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth] = useAuth(); // Use the useAuth hook
    const installApp = (product) => {
        if (!auth?.token) {
            toast.error('You need to login to install this app');
            return;
        }
        setCart([...cart, product])
        localStorage.setItem('cart', JSON.stringify([...cart, product]))
        toast.success('App Installed');
    }

    document.title = 'Play Store - Search results'
    return (
        <Layout >
            <div className="container">
                <div className="text-center">
                    <h1>Search Resuts</h1>
                    <h6>
                        {values?.results.length < 1
                            ? "No Products Found"
                            : `Found ${values?.results.length}`}
                    </h6>
                    <div className="row row-cols-1 row-cols-md-4 g-1 ">
                        {values?.results?.filter(p => p.isVisible).map((p) => (
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

                </div>
            </div>
        </Layout>
    );
};

export default Search; 