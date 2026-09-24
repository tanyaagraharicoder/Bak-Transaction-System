
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailServices = require("../services/email.services");

// ===============================
// USER REGISTER
// POST /api/auth/register
// ===============================

async function userRegisterController(req, res) {
    try {
        console.log("REGISTER CONTROLLER HIT");

        const { email, password, name } = req.body;

        console.log("BODY:", req.body);

        // Check if user already exists
        const isExists = await userModel.findOne({ email });

        console.log("DATABASE QUERY COMPLETED");

        if (isExists) {
            return res.status(422).json({
                message: "User already exists with this email",
                status: "failed"
            });
        }

        // Create user
        const user = await userModel.create({
            email,
            password,
            name
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Store token in cookie
        res.cookie("token", token);

        // Send registration email
        await emailServices.sendRegisterationEmail(
            user.email,
            user.name
        );

        // Send response
        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            status: "failed"
        });
    }
}


// ===============================
// USER LOGIN
// POST /api/auth/login
// ===============================

async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel
            .findOne({ email })
            .select("+password");

        // User doesn't exist
        if (!user) {
            return res.status(401).json({
                message: "Email or password is INVALID"
            });
        }

        // Check password
        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Email or password is INVALID"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Store token in cookie
        res.cookie("token", token);

        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Internal server error",
            status: "failed"
        });
    }
}


// ===============================
// EXPORT
// ===============================

module.exports = {
    userRegisterController,
    userLoginController
};

