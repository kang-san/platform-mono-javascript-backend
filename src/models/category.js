import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Category name is required"],
    minlength: [2, "Too short"],
    maxlength: [32, "Too long"],
  },
},
{
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  timestamps: true,
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
