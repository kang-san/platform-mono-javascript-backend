import express from 'express';
import {
  createComment,
  fetchAllComments,
  fetchComment,
  updateComment,
  deleteComment,
} from '../../controllers/comment.js';
import {authMiddleware} from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/comment/", authMiddleware, createComment);
router.get("/comment/", authMiddleware, fetchAllComments);
router.get("/comment/:id", authMiddleware, fetchComment);
router.put("/comment/:id", authMiddleware, updateComment);
router.delete("/comment/:id", authMiddleware, deleteComment);

export default router;
