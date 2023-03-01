import mongoose from 'mongoose';

const validateMongodbId = id => {
  try{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("The id is not valid or found");
  }catch (error) {
    console.error(error)
  }

};

export default validateMongodbId;
