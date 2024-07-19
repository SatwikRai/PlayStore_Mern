import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.ObjectId,
            ref: "Products" // Reference to the Products model
            // required: true,
        },
        review: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Reviews", reviewSchema);
