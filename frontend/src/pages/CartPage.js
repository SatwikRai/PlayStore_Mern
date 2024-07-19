import React from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [auth] = useAuth(); // Removed setAuth since it's not used
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    // Total price
    const totalPrice = () => {
        let total = 0;
        cart?.forEach((item) => { // Changed from map to forEach
            total += item.price;
        });
        return total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    // Delete item
    const removeCartItem = (pid) => {
        if (!auth?.token) {
            window.alert("Please login to Uninstall App");
            navigate("/login", {
                state: "/cart",
            })
            return;
        }
        let myCart = cart.filter((item) => item._id !== pid);
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
    };

    document.title = 'Play Store - Manage Apps'

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="text-center bg-light p-2 mb-1">
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h2>
                        <h5 className="text-center">
                            {cart?.length
                                ? `You Have ${cart.length} Application Installed.  ${auth?.token ? "" : "Please Login To View"
                                }`
                                : " You Have No Apps Installed"}
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        {cart?.map((p) => (
                            <div key={p._id} className="row mb-2 p-3 card flex-row"> {/* Added unique key here */}
                                <div className="col-md-4">
                                    <img
                                        src={`http://localhost:8080/api/product/product-photo/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        width="100px"
                                        height={"100px"}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <p>{p.name}</p>
                                    <p>{p.description.substring(0, 30)}</p>
                                    <p>Ratings : {p.price}</p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeCartItem(p._id)}
                                    >
                                        Uninstall
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;
