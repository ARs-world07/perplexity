import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "Username or email already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign({ 
        email: user.email,
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html:` <h1>Hi ${username},</h1>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>To get started, please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best regards,<br/>The Perplexity Team</p>
            `,
    })

    res.status(201).json({
        message:"user registered successfully",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

export async function login(req, res) {
    const { email, password } = req.body;

    
}

export async function verifyEmail(req, res) {
    const { token } = req.query;

    const decoded = jwt.verify(token , process.env.JWT_SECRET)

    const user = await userModel.findOne({email: decoded.email})
    if (!user) {
        return res.status(400).json({
            message: "Invalid token",
            success: false,
            err: "User not found"
        })
    }

    user.verified = true;
    await user.save();

    const html = 
    `
        <h1>Email Verified Successfully ✅</h1>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/api/auth/login">Go to Login</a>
    `
    res.send(html);
}