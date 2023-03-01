import express from 'express';
import {authMiddleware} from '../../middlewares/authMiddleware.js';
import {
  photoUpload,
  shortsImgResize,
} from '../../middlewares/photoUpload.js';
import {
  createShorts,
  fetchSingleShorts,
  fetchShorts,
  updateShorts,
  deleteShorts,
  toggleAddLikeToShorts,
  toggleAddDislikeToShorts,
} from  '../../controllers/shorts.js';

const router = express.Router();


router.post(  "/shorts/",  authMiddleware,  photoUpload.single("image"),  shortsImgResize,  createShorts);
router.get("/shorts/", fetchSingleShorts);
router.get("/shorts/:id", fetchShorts);
router.put("/shorts/:id", authMiddleware, updateShorts);
router.delete("/shorts/:id", authMiddleware, deleteShorts);
router.put("/shorts/likes", authMiddleware, toggleAddLikeToShorts);
router.put("/shorts/dislikes", authMiddleware, toggleAddDislikeToShorts);


export default router;