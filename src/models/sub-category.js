import mongoose from 'mongoose';

const subCategroySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "SubCategory is required"],
    minlength: [2, "Too short"],
    maxlength: [32, "Too long"],
  },
},
{
  toJSON:{
    virtuals: true
  },
  toObject:{
    virtuals: true
  },
  timestamps: true
});

const SubCategory = mongoose.model("SubCategory", subCategroySchema);
export default SubCategory;
