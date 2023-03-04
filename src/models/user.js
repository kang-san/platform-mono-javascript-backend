import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type : String,
      trim: true,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "lastName is required"],
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    shortsCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Seller", "Nutrition-Director", "Customer"],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    //cart
    cart: {
      type: Array,
      default: [],
    },

    address: String,
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
    seller: {
        name: String,
        logo: String,
        description: String,
        rating: { type: Number, default: 0, required: true },
        numReviews: { type: Number, default: 0, required: true },
    },

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  console.log("enteredPassword : ", enteredPassword, this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

//Verify account
userSchema.methods.createAccountVerificationToken = async function () {
  //create a token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return verificationToken;
};

//Password reset/forget

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return resetToken;
};

//Compile schema into model
const User = mongoose.model("User", userSchema);

export default User;
