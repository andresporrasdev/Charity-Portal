const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Directory where files will be uploaded
const uploadDir = "public/images";

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

// Set up the multer object for filtering file size
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Multer error handling middleware
const multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ status: "fail", message: "File size exceeds limit. Max 5MB allowed." });
  } else {
    next(err);
  }
};

module.exports = {
  upload,
  multerErrorHandling,
};