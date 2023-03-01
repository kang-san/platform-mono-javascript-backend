import express from 'express';
const router = express.Router();

// middlewares
import {authMiddleware, adminCheck} from '../../middlewares/authMiddleware.js';

// controller
import {
  createProduct,
  listAllProduct,
  listProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} from '../../controllers/product.js';

// CRUD
router.post("/product", authMiddleware, adminCheck, createProduct);
router.get("/products/:count", listAllProduct); // products/100
router.post("/products", listProduct);
router.get("/product/:id", detailProduct);
router.put("/product/:id", authMiddleware, adminCheck, updateProduct);
router.delete("/product/:slug", authMiddleware, adminCheck, deleteProduct);

// count
router.get("/products/total", productsCount);
// rating
router.put("/product/star/:productId", authMiddleware, productStar);
// related
router.get("/product/related/:productId", listRelated);
// search
router.post("/search/filters", searchFilters);

export default router;