import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/authController.js";
import { validJson } from "../middlewares/validJson.js";
import { header, body, validationResult } from "express-validator";
const router = express.Router();
const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 10,
  standardHeaders: "draft-8",
  message: {
    error: "Too many login attempts. Please try again after some time.",
  },
  legacyHeaders: false,
  ipv6Subnet: 56,
});
const registerValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
const loginValidator = [
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password").notEmpty().isString().withMessage("Password is missing"),
];
const userValidator = [
  header("authorization")
    .notEmpty()
    .withMessage("Authorization header is required")
    .bail()
    .matches(/^Bearer\s.+$/)
    .withMessage("Authorization must be in the format: Bearer <token>"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ error: firstError });
  }
  next();
};
router.use(cors());
router.use(validJson);
router.post("/register", registerValidator, validate, registerUser);
router.post("/login", rateLimiter, loginValidator, validate, loginUser);
router.get("/user", userValidator, validate, getUser);
export default router;
