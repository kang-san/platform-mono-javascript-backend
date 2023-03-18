import Category from "../models/category.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await new Category({ name }).save();
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create category failed");
  }
};

export const getCategories = async (req, res) => {
  try{
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();

    res.json(categories);
  }catch (err) {
    console.log(err);
    res.status(400).send("Get categories failed");
  }
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try{
    const updatedCategory = await Category.findOneAndUpdate(
      {_id: id},
      {name},
      {new: true}
    ).exec();

    if(!updatedCategory){
      return res.status(404).send("Category not found");
    }

    res.json(updatedCategory);
  }catch (err) {
    console.log(err);
    res.status(500).send("Update category failed");
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete(
      {_id: req.params.id,},
    )
  }catch (err) {
    console.log(err);
    res.status(500).send("Delete category failed");
  }
}
