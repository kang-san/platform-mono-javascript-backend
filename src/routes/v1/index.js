import express from 'express';

import category from './category.js';
import product from './product.js';
import comment from './comment.js';
import emailMsg from './emailMsg.js';
import productCategory from './productCategory.js';
import shorts from './shorts.js';
import user from './user.js';

const router = express.Router();

router.use('/api/v1',[
    category,
    product,
    comment,
    emailMsg,
    productCategory,
    shorts,
    user
]);

export default router;

