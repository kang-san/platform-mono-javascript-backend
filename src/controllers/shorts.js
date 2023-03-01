import Filter from 'bad-words';
import fs from 'fs';
import Shorts from '../models/shorts.js';
import validateMongodbId from '../utils/validateMongodbID.js';
import User from '../models/user.js';
import cloudinaryUploadImg from '../utils/cloudinary.js';

//----------------------------------------------------------------
//CREATE SHORTS
//----------------------------------------------------------------
const createShorts = async (req, res) => {
  console.log(req.file);
  const { _id } = req.user;
  //   validateMongodbId(req.body.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //Block user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating Failed because it contains profane words and you have been blocked"
    );
  }

  //1. Get the oath to img
  //const localPath = `public/images/shorts/${req.file.filename}`;
  //2.Upload to cloudinary
  //const imgUploaded = await cloudinaryUploadImg(localPath);
  try {
    const shorts = await Shorts.create({
      ...req.body,
      user: _id,
    });
    res.json(shorts);
    //Remove uploaded img
    //fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
};

//-------------------------------
//Fetch all shorts
//-------------------------------
const fetchShorts = async (req, res) => {
  try {
    const shorts = await Shorts.find({}).populate("user");
    res.json(shorts);
  } catch (error) {}
};

//------------------------------
//Fetch a single shorts
//------------------------------

const fetchSingleShorts = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const shorts = await Shorts.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes");
    //update number of views
    await Shorts.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(shorts);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
// Update shorts
//------------------------------

const updateShorts = async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const shorts = await Shorts.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(shorts);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
//Delete Shorts
//------------------------------

const deleteShorts = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const shorts = await Shorts.findOneAndDelete(id);
    res.json(shorts);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
//Likes
//------------------------------

const toggleAddLikeToShorts = async (req, res) => {
  //1.Find the shorts to be liked
  const { shortsId } = req.body;
  const shorts = await Shorts.findById(shortsId);
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Find is this user has liked this shorts?
  const isLiked = shorts?.isLiked;
  //4.Chech if this user has dislikes this shorts
  const alreadyDisliked = shorts?.disLikes?.find(
    userId => userId?.toString() === loginUserId?.toString()
  );
  //5.remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const shorts = await Shorts.findByIdAndUpdate(
      shortsId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(shorts);
  }
  //Toggle
  //Remove the user if he has liked the shorts
  if (isLiked) {
    const shorts = await Shorts.findByIdAndUpdate(
      shortsId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(shorts);
  } else {
    //add to likes
    const shorts = await Shorts.findByIdAndUpdate(
      shortsId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(shorts);
  }
};

//------------------------------
//disLikes
//------------------------------

const toggleAddDislikeToShorts = async (req, res) => {
  //1.Find the shorts to be disLiked
  const { shortsId } = req.body;
  const shorts = await Shorts.findById(shortsId);
  //2.Find the login user
  const loginUserId = req?.user?._id;
  //3.Check if this user has already disLikes
  const isDisLiked = shorts?.isDisLiked;
  //4. Check if already like this shorts
  const alreadyLiked = shorts?.likes?.find(
    userId => userId.toString() === loginUserId?.toString()
  );
  //Remove this user from likes array if it exists
  if (alreadyLiked) {
    const shorts = await Shorts.findOneAndUpdate(
      shortsId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(shorts);
  }
  //Toggling
  //Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const shorts = await Shorts.findByIdAndUpdate(
      shortsId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(shorts);
  } else {
    const shorts = await Shorts.findByIdAndUpdate(
      shortsId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(shorts);
  }
};

export { createShorts, fetchShorts, fetchSingleShorts, updateShorts, deleteShorts, toggleAddLikeToShorts, toggleAddDislikeToShorts };
