import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected files
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

//Image Resizing
const profilePhotoResize = async (req, res, next) => {
  //check if there is no file
  if (!req.file) return next();

  try {
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    const dir = "public/images/profile";
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    await sharp(req.file.buffer)
      .resize(250, 250)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(`${dir}/${req.file.filename}`));

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//Shorts Image Resizing
const shortsImgResize = async (req, res, next) => {
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/shorts/${req.file.filename}`));
  next();
};


export { photoUpload, profilePhotoResize, shortsImgResize };
