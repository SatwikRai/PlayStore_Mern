import express from "express";
import {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getAllUsersController,
    updateUserByIdController,
    deleteUserByIdController,
    createNewUserController,
    getUserByIdController
} from "../controllers/authControllers.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object..............
const router = express.Router();

//routing...............................
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);



//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

// GET all users data - Only accessible by admins
router.get("/users", requireSignIn, isAdmin, getAllUsersController);

// UPDATE user by ID - Only accessible by admins
router.put("/user/:userId", requireSignIn, isAdmin, updateUserByIdController);

// DELETE user by ID - Only accessible by admins
router.delete("/user/:userId", requireSignIn, isAdmin, deleteUserByIdController);

// CREATE new user - Only accessible by admins
router.post("/user", requireSignIn, isAdmin, createNewUserController);

// GET user data by ID - Only accessible by admins
router.get("/user/:userId", requireSignIn, isAdmin, getUserByIdController);

export default router;