import ReviewModel from "../models/ReviewModel.js";

//1. Add Review
export const addReview = async (req, res) => {
    try {
        const { review } = req.body;
        const { id } = req.params;

        // Validation
        if (!review) {
            return res.status(500).send({ error: "Review is required" });
        }

        const data = {
            product: id,
            review: review
        };

        const newReview = new ReviewModel(data);
        await newReview.save();

        res.status(201).send({
            success: true,
            message: "Review added successfully",
            review: newReview
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in adding review",
        });
    }
};


// 3. Get Reviews by Product ID
export const getReviewsByProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await ReviewModel.find({ product: id });
        if (!reviews) {
            return res.status(404).send({
                success: false,
                message: "No reviews found for this product",
            });
        }
        res.status(200).send(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in fetching reviews",
        });
    }
};

// Function to delete a review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await ReviewModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in deleting review',
        });
    }
};

// Function to update a review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { review } = req.body;
        const updatedReview = await ReviewModel.findByIdAndUpdate(id, { review }, { new: true });
        res.status(200).send({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating review',
        });
    }
};
