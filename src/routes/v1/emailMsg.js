import express from 'express';
import sendEmailMsg from '../../controllers/emailMsg.js';
import {authMiddleware} from '../../middlewares/authMiddleware.js';
const router = express.Router();

router.post("/emailMsg/", authMiddleware, sendEmailMsg);

export default router;