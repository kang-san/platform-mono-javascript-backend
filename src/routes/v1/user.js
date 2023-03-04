import express from 'express';
import {authMiddleware} from '../../middlewares/authMiddleware.js';
import {
  photoUpload,
  profilePhotoResize,
} from '../../middlewares/photoUpload.js';
import {validate} from "../../middlewares/validate.js";
import * as userDto from "../../dtos/user.js";
import * as userController from "../../controllers/user.js";
import {authUser} from "../../dtos/user.js";

const router = express.Router();


// register and login and CRUD
router.post(
    "/user/register",
    validate(userDto.create),
    userController.userRegister
);

router.post(
    "/user/login",
    validate(userDto.authUser),
    userController.loginUser
);

// fetch user
router.get(
    "/user",
    authMiddleware,
    userController.fetchUsers
);
router.get(
    "/user/:id",
    authMiddleware,
    validate(userDto.findOne),
    userController.fetchUserDetails
);

// delete
router.delete(
    "/user/:id",
    authMiddleware,
    validate(userDto.remove),
    userController.deleteUser
);


// update user
router.put(
    "/user/:id",
    authMiddleware,
    userController.updateUser
);

// get user's shorts
router.get(
    "/user/shorts/:id",
    authMiddleware,
    userController.getShorts
);

router.put(
    "/user/profilephoto-upload/:id",
    authMiddleware,
    photoUpload.single("image"),
    profilePhotoResize,
    userController.profilePhotoUpload
);

// password
router.put(
  "/user/password/:id",
  authMiddleware,
  userController.updatePassword
);

// forget password
router.post(
  "/user/forget-password",
  authMiddleware,
  userController.forgetPassword
);

router.put(
  "/user/reset-password",
  userController.resetPassword
);


// follow
router.put(
    "/user/follow",
    authMiddleware,
    userController.followingUser
);

router.put(
    "/user/unfollow",
    authMiddleware,
    userController.unfollowUser
);

// block
router.put(
    "/user/block-user/:id",
    authMiddleware,
    userController.blockUser
);
router.put(
    "/user/unblock-user/:id",
    authMiddleware,
    userController.unblockUser
);

export default router;
