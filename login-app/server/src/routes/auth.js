import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { validJson } from '../middlewares/validJson.js';
const router = express.Router()
router.use(validJson);
router.post('/register', registerUser);
router.post('/login', loginUser);
export default router;
