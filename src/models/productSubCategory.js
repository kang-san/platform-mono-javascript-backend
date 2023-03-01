import mongoose from 'mongoose';

const productSubCategorySchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: [true, "SubCategory is required"],
            minlength: [2, "Too short"],
            maxlength: [32, "Too long"],
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductCategory",
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const ProductSubCategory = mongoose.model("ProductSubCategory", productSubCategorySchema);
export default ProductSubCategory;