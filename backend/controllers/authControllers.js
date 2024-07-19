import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const { name, email, password, answer } = req.body;
        //validations
        if (!name) {
            return res.send({ message: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" });
        }

        //check user
        const exisitingUser = await userModel.findOne({ email });
        //exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({
            name,
            email,
            password: hashedPassword,
            answer,

        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registeration",
            error,
        });
    }
};


//POST LOGIN
export const loginController = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Emai is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};


//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

//update prfole
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 8) {
            return res.json({ error: "Passsword is required and 8 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                email: email || user.email,
                password: hashedPassword || user.password,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};

// GET all users data
export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({
            success: true,
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching users",
            error,
        });
    }
};

// UPDATE user by ID
export const updateUserByIdController = async (req, res) => {
    const { userId } = req.params;
    let updateData = req.body;

    try {
        // If a new password is provided, hash it before updating
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
        res.status(200).send({
            success: true,
            message: "User updated successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating user",
            error,
        });
    }
};

// DELETE user by ID
export const deleteUserByIdController = async (req, res) => {
    const { userId } = req.params;
    try {
        await userModel.findByIdAndDelete(userId);
        res.status(200).send({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting user",
            error,
        });
    }
};

// CREATE new user
export const createNewUserController = async (req, res) => {
    try {
        const { name, email, password, answer } = req.body;
        const hashedPassword = await hashPassword(password);

        const newUser = await new userModel({
            name,
            email,
            password: hashedPassword,
            answer,
        }).save();

        res.status(201).send({
            success: true,
            message: "User created successfully",
            newUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error creating user",
            error,
        });
    }
};

// GET user data by ID
export const getUserByIdController = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findById(userId);
        res.status(200).send({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching user",
            error,
        });
    }
};
