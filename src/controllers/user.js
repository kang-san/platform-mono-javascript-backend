import sgMail from '@sendgrid/mail';
import fs from 'fs';
import crypto from 'crypto';
import generateToken from '../config/generateToken.js';
import User from '../models/user.js';
import validateMongodbId from '../utils/validateMongodbID.js';
import cloudinaryUploadImg from '../utils/cloudinary.js';
import * as userService from '../services/user.js';
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
import {STATUS_CODES} from "../constants/httpStatus.js";

/**
 * @desc    Register user controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export async function userRegister(req, res, next) {
  try {
    const userExists = await userService.findOne(req);
    if (userExists) throw new Error("User already exists");
    const user = await userService.create(req.body);

    return res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    login user controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export async function loginUser(req, res, next) {
  try {
    // user exists
    const user = await userService.auth(req.body);

    return  res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    fetch user controller
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function fetchUserDetails(req, res, next) {
  const { id } = req.params;
  try {
    const user = await userService.findById(id);
    console.log("user : ", user)

    res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    fetch all users controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function fetchUsers(req, res, next) {
  try {
    const users = await userService.find();

    res.status(STATUS_CODES.OK).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    delete user controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function deleteUser(req, res, next) {
  const { id } = req.params;
  try {
    const deletedUser = await userService.findByIdAndDelete(id);
    res.status(STATUS_CODES.OK).json(deletedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    user profile controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function getProfile(req, res, next) {
  try {
    const { id } = req.params;
    const myProfile = await userService.getProfile(id);

    res.status(STATUS_CODES.OK).json(myProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    update user profile controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function updateUser(req, res, next) {
  try {
    const user = await userService.findByIdAndUpdate(req);

    res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error)
  }

};

/**
 * @desc    generate email verification token controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function generateEmailVerificationToken(req, res, next) {
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  try {
    const verificationToken = await user.createAccountVerificationToken();
    await user.save();


    console.log(verificationToken);
    //build your message

    const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;
    const msg = {
      to: "ffdfd@gmail.com",
      from: "twentekghana@gmail.com",
      subject: "Verify your account",
      html: resetURL,
    };

    await sgMail.send(msg);
    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
};

/**
 * @desc     account verification controller
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const accountVerification = async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  //find this user by token
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });
  if (!userFound) throw new Error("Token expired, try again later");
  //update the proprt to true
  userFound.isAccountVerified = true;
  u
  serFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
};


/**
 * @desc    update password controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function updatePassword(req, res, next) {
  try {
    const { id } = req.user;
    const { password } = req.body;
    const user = await userService.updatePassword(id, password);

    res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    reset password controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function resetPassword(req, res, next) {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  console.log("token >>>>>>>>>>>>> ", token);

  console.log("hashedToken >>>>>>>>>>>>> ", hashedToken);

  let user = await userService.passwordExpireChecker(hashedToken);
  user = await userService.resetPassword(user, password);

  res.status(STATUS_CODES.OK).json(user);
};




/**
 * @desc    forgot password token service
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const forgetPasswordToken = async (req, res) => {
  //find the user by email
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User Not Found");

  try {
    //Create token
    const token = await user.createPasswordResetToken();
    console.log(token);
    await user.save();

    //build your message
    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/reset-password/${token}">Click to Reset</a>`;
    const msg = {
      to: email,
      from: "twentekghana@gmail.com",
      subject: "Reset Password",
      html: resetURL,
    };

    await sgMail.send(msg);
    res.json({
      msg: `A verification message is successfully sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
    });
  } catch (error) {
    res.json(error);
  }
};

/**
 * @desc    upload profile picture
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function profilePhotoUpload(req, res, next) {
  //Find the login user
  const { _id } = req.user;

  //1. Get the oath to img
  const localPath = `public/images/profile/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  const updateUser = await userService.profilePhotoUpload(_id, imgUploaded);
  fs.unlinkSync(localPath);

  res.json(updateUser);
};


/**
 * @desc    following user controller
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function followingUser(req, res, next) {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  const targetUser = await userService.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(user =>
      user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) throw new Error("You have already followed this user");

  const result = await userService.followingUser(followId, loginUserId);

  res.status(STATUS_CODES.OK).json(result);
};

/**
 * @desc    unfollowing user controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function unfollowUser(req, res, next) {
  try {
    const { unFollowId } = req.body;
    const loginUserId = req.user.id;

    const result = await userService.unfollowUser(unFollowId, loginUserId);

    res.status(STATUS_CODES.OK).json(result);
  } catch (error) {
    next(error);
  };

};


/**
 * @desc    block user controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function blockUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.blockUser(id);

    res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    unblock user controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function unblockUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.unblockUser(id);

    res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};
