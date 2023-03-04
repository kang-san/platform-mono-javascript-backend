import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function authMiddleware(req, res, next) {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if(decoded.id) {
          const user = await User.findById(decoded.id).select("-password");
          req.user = user;
        }

        next();
      }
    } catch (error) {
      next(new Error("Not authorized token expired, login again"));
    }
  } else {
    next(new Error("There is no token attached to the header"));
  }
};

export async function adminCheck(req, res, next) {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();
  if(!adminUser) throw new Error("Not authorized, login again");

  if (adminUser.role !== "Admin") {
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  } else {
    next();
  }
};

