import Comment from '../models/comment.js';
import validateMongodbId from '../utils/validateMongodbID.js';

//-------------------------------------------------------------
//Create
//-------------------------------------------------------------
const createComment = async (req, res) => {
  //1.Get the user
  const user = req.user;
  //2.Get the post Id
  const { postId, description } = req.body;
  console.log(description);
  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
};

//-------------------------------
//fetch all comments
//-------------------------------

const fetchAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-created");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
//commet details
//------------------------------
const fetchComment = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
//Update
//------------------------------

const updateComment = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        post: req.body?.postId,
        user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(update);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
//delete
//------------------------------

const deleteComment = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
};

export { createComment, fetchAllComments, fetchComment, updateComment, deleteComment };
