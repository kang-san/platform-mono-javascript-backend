import mongoose from 'mongoose';

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "ProductCategory name is required"],
        minlength: [2, "Too short"],
        maxlength: [32, "Too long"],
    },
  }, {
    timestamps: true
  }
);

const ProdectCategory = mongoose.model("ProdectCategory", productCategorySchema);
export default ProdectCategory;