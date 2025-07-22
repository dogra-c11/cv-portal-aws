import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import { registerUser, loginUser, getUser } from '../controllers/authController.js';
import { validJson } from '../middlewares/validJson.js';
const router = express.Router()
const rateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 10, 
	standardHeaders: 'draft-8',
    message: {'error' : 'Too many login attempts. Please try again after some time.'},
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})
router.use(cors());
router.use(validJson);
router.post('/register', registerUser);
router.post('/login', rateLimiter, loginUser);
router.get('/user', getUser);
export default router;
