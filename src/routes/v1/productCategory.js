import express from 'express';

//middlewares
import {authMiddleware, adminCheck} from '../../middlewares/authMiddleware.js'

//controller
import {
    createProductCategory,
    fetchProductCategory,
    fetchProductCategories,
    updateProductCategory,
    deleteProductCategory,
    getSubCategories,
} from '../../controllers/productCategory.js';

const router = express.Router();


//routes
router.post("/productCategory", authMiddleware, adminCheck, createProductCategory);
router.get("/productCategory", authMiddleware, fetchProductCategories);
router.get("/productCategory/:id", authMiddleware, adminCheck, fetchProductCategory);
router.put("/productCategory/:id", authMiddleware, adminCheck, updateProductCategory);
router.delete("/productCategory/:id", authMiddleware, adminCheck, deleteProductCategory);
router.get("/productCategory/subs/:id", authMiddleware, adminCheck, getSubCategories)

export default router;
