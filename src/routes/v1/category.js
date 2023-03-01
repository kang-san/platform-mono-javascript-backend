import express from 'express';
import {
  createCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
  deleteCateory,
} from '../../controllers/category.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/category/", authMiddleware, createCategory);
router.get("/category/", authMiddleware, fetchCategories);
router.get("/category/:id", authMiddleware, fetchCategory);
router.put("/category/:id", authMiddleware, updateCategory);
router.delete("/category/:id", authMiddleware, deleteCateory);


export default router;
