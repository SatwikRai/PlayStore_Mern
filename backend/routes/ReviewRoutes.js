import express from 'express';
import { addReview, getReviewsByProductId, deleteReview, updateReview } from '../controllers/ReviewController.js';
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to add a review
router.post('/review/:id', requireSignIn, addReview);


// Route to get reviews by product ID
router.get('/reviews/:id', getReviewsByProductId);

// Route to delete a review
router.delete('/review/:id', requireSignIn, deleteReview);

// Route to update a review
router.put('/review/:id', requireSignIn, updateReview);


export default router;
