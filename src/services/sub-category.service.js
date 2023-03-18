import SubCategory from "../models/sub-category.js";

export const createSubCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const subCategory = await new SubCategory({name}).save();

    return res.json(subCategory);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create sub category failed");
  }
};

export const getSubCategories = async (req, res) => {
  try{
    const subCategories = await SubCategory.find({}).sort({createdAt: -1}).exec();

    return res.json(subCategories);
  } catch(err) {
    console.log(err);
    res.status(400).send("Get sub categories failed");
  }
};

export const updateSubCategory = async (req, res) => {
  try{
    const id = req.params.id;
    const {name} = req.body;
    const updatedSubCategory = await SubCategory.findOneAndUpdate(
      {_id: id},
      {name},
      {new: true},
    ).exec();

    return res.json(updatedSubCategory);
  } catch (err) {
    console.log(err);
    res.status(400).send("Update sub category failed");
  }
};

export const deleteSubCategory = async (req, res) => {
  try{
    const deletedSubCategory = await SubCategory.findOneAndDelete(
      {_id: req.params.id}
    ).exec();

    return res.json(deletedSubCategory);
  } catch (err) {
    console.log(err);
    res.status(400).send("Delete sub category failed");
  }
};
