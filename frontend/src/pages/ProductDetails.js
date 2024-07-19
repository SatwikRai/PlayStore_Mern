
import React, { useState, useEffect, useCallback } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import { useCart } from "../context/cart";
import { IconContext } from 'react-icons';
import toast from "react-hot-toast";
import { Modal, Button, Form } from 'react-bootstrap'; // Import components from react-bootstrap

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [cart, setCart] = useCart();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]); // State to store the reviews
    const [show, setShow] = useState(false); // State to control the visibility of the modal
    const [newReview, setNewReview] = useState(''); // State to store the new review
    const [currentReview, setCurrentReview] = useState(null);


    // getProduct wrapped in useCallback
    const getProduct = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:8080/api/product/get-product/${params.slug}`
            );
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    }, [params.slug]); // dependencies array

    // getSimilarProduct function
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(
                `http://localhost:8080/api/product/related-product/${pid}/${cid}`
            );
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to get the reviews for a product
    const getReviews = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:8080/api/review/reviews/${product._id}`
            );
            setReviews(data);
        } catch (error) {
            console.log(error);
        }
    }, [product._id]);

    // Function to handle the submission of the review form
    const handleReviewSubmit = async () => {
        try {
            let data;
            if (currentReview) {
                data = await axios.put(`http://localhost:8080/api/review/review/${currentReview._id}`, { review: newReview });
                setReviews(reviews.map((review) => review._id === currentReview._id ? data.data : review));
            } else {
                data = await axios.post(`http://localhost:8080/api/review/review/${product._id}`, { review: newReview });
                setReviews([...reviews, data.data]);
            }
            setNewReview('');
            setCurrentReview(null);
            setShow(false);
            toast.success('Review submitted successfully');
        } catch (error) {
            console.log(error);
            toast.error('Error in submitting review');
        }
    };


    // useEffect with getProduct and getReviews dependencies
    useEffect(() => {
        if (params?.slug) {
            getProduct();
        }
    }, [params?.slug, getProduct]);

    useEffect(() => {
        if (product._id) {
            getReviews();
        }
    }, [product._id, getReviews]);


    // Function to handle the deletion of a review
    const handleReviewDelete = async (reviewId) => {
        try {
            await axios.delete(`http://localhost:8080/api/review/review/${reviewId}`);
            setReviews(reviews.filter((review) => review._id !== reviewId));
            toast.success('Review deleted successfully');
        } catch (error) {
            console.log(error);
            toast.error('Error in deleting review');
        }
    };

    document.title = 'Play Store - Apps'

    return (
        <Layout>
            <div className="row container mt-2">
                <div className="col-md-4">
                    <img
                        src={`http://localhost:8080/api/product/product-photo/${product._id}`}
                        className="card-img-top"
                        alt={product.name}
                        height="300px"

                    />
                </div>

                <div className="col-md-4 ">
                    <h1 className="text-center">App Details</h1>
                    <h6>Name : {product.name}</h6>
                    <h6>Description : {product.description}</h6>
                    <h6>Ratings : {product.price}</h6>
                    <h6>Category : {product?.category?.name}</h6>
                    <h6>Release Date : {new Date(product?.updatedAt).toLocaleDateString()}</h6>
                    <button className="btn btn-secondary" onClick={() => {
                        setCart([...cart, product])
                        localStorage.setItem('cart', JSON.stringify([...cart, product]))
                        toast.success('App Installed');
                    }}>Install</button>
                    <button className="btn btn-primary ms-1" onClick={() => setShow(true)}>Add Review</button>
                </div>
                <div className="col-md-4">
                    <br /><br /><br />
                    <h6>Reviews:</h6>
                    {reviews.map((review) => (
                        <div key={review._id}>
                            <p onClick={() => {
                                setCurrentReview(review);
                                setNewReview(review.review);
                                setShow(true);
                            }}>
                                {typeof review.review === 'object' ? (review.review.review) : review.review}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <Modal show={show} onHide={() => { setShow(false); setCurrentReview(null); setNewReview(''); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentReview ? 'Update Review' : 'Add a Review'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Review</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newReview} onChange={(e) => setNewReview(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShow(false); setCurrentReview(null); setNewReview(''); }}>Close</Button>
                    {currentReview && <Button variant="danger" onClick={() => handleReviewDelete(currentReview._id)}>Delete</Button>}
                    <Button variant="primary" onClick={handleReviewSubmit}>{currentReview ? 'Update Review' : 'Submit Review'}</Button>
                </Modal.Footer>
            </Modal>


            <hr />
            <div className="row container">
                <h6>Similar Apps</h6>
                {relatedProducts.length < 1 && (
                    <p className="text-center">No Similar Apps found</p>
                )}
                <div className="d-flex flex-wrap">
                    {relatedProducts?.filter(p => p.isVisible).map((p) => (
                        <div key={p._id} className="card m-4" style={{ width: "14rem" }}> {/* Added key prop here */}
                            <img
                                src={`http://localhost:8080/api/product/product-photo/${p._id}`}
                                className="card-img-top"
                                alt={p.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0, 30)}...</p>
                                <p className="card-text">  <IconContext.Provider value={{ className: 'star-icon' }}>
                                    <FaStar />
                                </IconContext.Provider> {p.price}</p>
                                <button
                                    className="btn btn-primary me-1"
                                    onClick={() => navigate(`/product/${p.slug}`)}
                                >
                                    More Details
                                </button>
                                <button className="btn btn-secondary" onClick={() => {
                                    setCart([...cart, p])
                                    localStorage.setItem('cart', JSON.stringify([...cart, p]))
                                    toast.success('App Installed');
                                }}>Install</button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
