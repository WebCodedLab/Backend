import express from "express";
import { body, validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();
router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
  "/register",
  body("email").isEmail().trim().isLength({ min: 10 }),
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  async (req, res) => {
    const { username, email, password } = req.body;

    let errors = validationResult(req);

    !errors.isEmpty() &&
      res.status(400).json({
        errors: errors.array(),
        message: "Validation errors occurred",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      res.redirect("/user/login");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error Registering User");
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Login Validation errors occurred",
        });
      }

      const { username, password } = req.body;

      const user = await userModel.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "Invalid username" });
      }

      if (!user.password) {
        return res.status(400).json({ message: "User password not set" });
      }

      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign({userID: user._id, username: user.username, email: user.email}, process.env.JWT_SECRET)
      res.cookie('token', token)

      res.redirect('/home')
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);
router.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.redirect('/user/login')
})

export default router;
