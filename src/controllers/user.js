import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
import fs from 'fs';
import crypto from 'crypto';
import generateToken from '../config/generateToken.js';
import User from '../models/user.js';
import validateMongodbId from '../utils/validateMongodbID.js';
import cloudinaryUploadImg from '../utils/cloudinary.js';
import * as userService from '../services/user.js';
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
    if(!req) throw new Error("Request body is empty");
    const userExists = await userService.findOne(req);

    if (userExists) throw new Error("User already exists");
    const user = await userService.createUser(req.body);

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
    if(!req) throw new Error("Request body is empty");
    const user = await userService.auth(req.body);

    if(!user) throw new Error("Invalid Login Credentials");

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
 * @desc    user shorts controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function getShorts(req, res, next) {
  try {
    const { id } = req.params;
    const myShorts = await userService.getShorts(id);

    res.status(STATUS_CODES.OK).json(myShorts);
  } catch (error) {
    next(error);
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
  const id = req?.params?.id;

  //1. Get the oath to img
  const localPath = `public/images/profile/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  const updateUser = await userService.profilePhotoUpload(id, imgUploaded);
  fs.unlinkSync(localPath);

  res.json(updateUser);
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
    const id = req.params.id;
    const { password } = req.body;
    const user = await userService.updatePassword(id, password);

    res.status(STATUS_CODES.OK).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    forgot password token service
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function forgetPassword(req, res, next) {
  try {
    //find the user by email
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("User Not Found");

    const resetToken = await userService.createToken(user);

    //build your message
    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/reset-password/${resetToken}">Click to Reset</a>`;
    const msg = {
      to: email,
      from: "jprsol@naver.com",
      subject: "Reset Password",
      html: resetURL,
    };

    await sgMail.send(msg).then(() => {
      console.log("Email sent");
    });

    res.status(200).json({ msg: `A verification message is successfully sent to ${email}. Reset now within 10 minutes, ${resetURL}` });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    reset password controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user = await userService.passwordExpireChecker(hashedToken);
    if(!user) throw new Error("Token is invalid or has expired");
    user = await userService.resetPassword(user, password);

    res.status(STATUS_CODES.OK).json(user);
  }catch (error) {
    next(error);
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
