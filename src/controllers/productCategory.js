import ProductCategory from '../models/productCategory.js';
import Product from '../models/product.js';

const createProductCategory = async (req, res)=> {
    try {
        console.log(req.body);
        const newProduct = await new ProductCategory(req.body).save();
        res.json(newProduct);
    }catch(err) {
        console.log(err);
        res.status(400).json({
            err: err.message
        })
    }
};

const fetchProductCategories = async (req, res) =>
    res.json(await ProductCategory.find({}).sort({ createdAt: -1 }).exec());



const fetchProductCategory = async (req, res) => {
    let category = await ProductCategory.findOne({ slug: req.params.slug }).exec();
    // res.json(category);
    const products = await Product.find({ category }).populate("category").exec();

    res.json({
        category,
        products,
    });
};

const updateProductCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const updated = await ProductCategory.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).send("Category update failed");
    }
};

const deleteProductCategory = async (req, res) => {
    try {
        const deleted = await ProductCategory.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Category delete failed");
    }
};

const getSubCategories = (req, res) => {
    ProductCategory.find({ parent: req.params._id }).exec((err, subs) => {
        if (err) console.log(err);
        res.json(subs);
    });
};

export { createProductCategory, fetchProductCategories, fetchProductCategory, updateProductCategory, deleteProductCategory, getSubCategories };



