import mongoose from 'mongoose';

const dbConnect = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(()=> console.log("Db is Connected Successfully"))
  .catch((error)=> console.log(`Error ${error.message}`));
};

export default dbConnect;
