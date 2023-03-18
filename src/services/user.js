import User from "../models/user.js";
import generateToken from "../config/generateToken.js";
import validateMongodbId from "../utils/validateMongodbID.js";
import crypto from "crypto";
import cloudinaryUploadImg from "../utils/cloudinary.js";
import fs from "fs";
import * as userController from "../controllers/user.js";

/**
 * @desc    Verify user account
 * @param req
 * @returns {Promise<EnforceDocument<unknown, {}>>}
 */
export async function findOne(req) {
    //Check if user Exist
    const userExists = await User.findOne({ email: req?.body?.email });
    if (userExists) throw new Error("User already exists");

    return userExists;
};

export async function createUser(createUserDto) {
    //Check if user Exist
    const user = await User.create(createUserDto);

    return user;
};

/**
 * @desc    login user service
 * @param body
 * @returns {Promise<{firstName: *, lastName: *, profilePhoto: *, _id: *, isAdmin: *, email: *, token: (*)}>}
 */

export async function auth(authUserDto) {
  const user = await User.findOne({email: authUserDto?.email});
  const isPassword = await user.isPasswordMatched(authUserDto?.password);

  if (isPassword) {
        return (
            {
                _id: user?._id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                profilePhoto: user?.profilePhoto,
                isAdmin: user?.isAdmin,
                token: generateToken(user?._id),
            }
        )
    } else {
        throw new Error("Invalid Login Credentials");
    }
};

/**
 * @desc    find user by id service
 * @param id
 * @returns {Promise<Query<Document<any, any, unknown>, Document<any, any, unknown>, {}, unknown>>}
 */
export async function findById(id) {
    try {
        return User.findById(id);
    } catch (error) {
        throw new Error("Fail to find user");
    }
};

/**
 * @desc    Get all users service
 * @returns {Promise<Query<Array<EnforceDocument<unknown, {}>>, Document<any, any, unknown>, {}, unknown>>}
 */
export async function find() {
    try {
        return User.find({});
    } catch (error) {
        throw new Error("Fail to find users");
    }
};

/**
 * @desc    Delete user service
 * @param id
 * @returns {Promise<Query<Document<any, any, unknown>, Document<any, any, unknown>, {}, unknown>>}
 */
export async function findByIdAndDelete(id) {
    try {
        return User.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Fail to delete user");
    }
};

/**
 * @desc    Get user shorts  service
 * @param id
 * @returns {Promise<void>}
 */
export async function getShorts(id){
    try {

        return User.findById(id).populate("shorts");
    } catch (error) {
        return new Error("Fail to find user's shorts");
    }
};


/**
 * @desc    Update user profile service
 * @param id
 * @returns {Promise<Query<Document<any, any, unknown>, Document<any, any, unknown>, {}, unknown>>}
 */
export async function findByIdAndUpdate(req) {
    const _id = req?.params.id;
    return User.findByIdAndUpdate(
        _id,
        {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            bio: req?.body?.bio,
        },
        {
            new: true,
        }
    );
};

/**
 * @desc    profile photo upload service
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function profilePhotoUpload(id, imgUploaded) {
    return User.findByIdAndUpdate(
        id,
        {
            profilePhoto: imgUploaded?.url,
        },
        { new: true }
    );
    //remove the saved img
    res.json(imgUploaded);
};

/**
 * @desc    Update user profile service
 * @param id
 * @param password
 * @returns {Promise<*>}
 */
export async function updatePassword(id, password) {
    if(!id) throw new Error("User not found");
    const user = await User.findById(id);

    if(!user) throw new Error("User not found");
    user.password = password;

    return  user.save();
};

/**
 * @desc    create reset token service
 * @param user
 * @returns {Promise<*>}
 */
export async function createToken(user) {
  try{
    //Create token
    const token = await user.createPasswordResetToken();
    await user.save();

    return token;
  }catch(error) {
    throw new Error("Fail to create forget password token");
  }
}

/**
 * @desc    password expired check service
 * @param hashedToken
 * @returns {Promise<Query<Document<any, any, unknown>, Document<any, any, unknown>, {}, unknown>>}
 */
export async function passwordExpireChecker(hashedToken) {
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, try again later");

  return user;
};

/**
 * @desc    reset password service
 * @param user
 * @param password
 * @returns {Promise<*>}
 */
export async function resetPassword(user, password) {
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  return user.save();
};

/**
 * @desc    Generate Email verification token
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const generateVerificationToken = async (req, res) => {
    const loginUserId = req.user.id;

    const user = await User.findById(loginUserId);

    try {
        //Generate token
        const verificationToken = await user.createAccountVerificationToken();
        //save the user
        await user.save();
        //build your message

        const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;
        const msg = {
            to: "junbuck@gmail.com",
            from: "junbuck01@gmail.com",
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
 * @desc    account verification service
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
 * @desc    following user service
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export async function followingUser(followId, loginUserId) {
    await User.findByIdAndUpdate(
        followId,
        {
            $push: { followers: loginUserId },
            isFollowing: true,
        },
        { new: true }
    );

    await User.findByIdAndUpdate(
        loginUserId,
        {
            $push: { following: followId },
        },
        { new: true },
    )
    return "You have successfully followed this user";
};

/**
 * @desc    Unfollowing user service
 * @param unFollowId
 * @param loginUserId
 * @returns {Promise<string>}
 */
export async function unfollowUser(unFollowId, loginUserId) {
    await User.findByIdAndUpdate(
        unFollowId,
        {
            $pull: { followers: loginUserId },
            isFollowing: false,
        },
        { new: true }
    );

    await User.findByIdAndUpdate(
        loginUserId,
        {
            $pull: { following: unFollowId },
        },
        { new: true }
    );

    return "You have successfully unfollowed this user";
};

/**
 * @desc    block user service
 * @param id
 * @returns {Promise<Query<Document<any, any, unknown>, Document<any, any, unknown>, {}, unknown>>}
 */
export async function blockUser(id) {
    return User.findByIdAndUpdate(
        id,
        {
            isBlocked: true,
        },
        { new: true }
    );
};


/**
 * @desc    unblock user service
 * @param id
 * @returns {Promise<Query<Document<any, any, unknown>, Document<any, any, unknown>, {}, unknown>>}
 */
export async function unblockUser(id) {
    return User.findByIdAndUpdate(
        id,
        {
            isBlocked: false,
        },
        { new: true }
    );
};

