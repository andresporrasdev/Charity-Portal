const multer = require("multer");
const fs = require("fs");

// ── Image upload (events) ────────────────────────────────────────────────────
const imageDest = "public/images/events";
if (!fs.existsSync(imageDest)) fs.mkdirSync(imageDest, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDest),
  filename: (req, file, cb) => cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname),
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Not an image! Please upload only images."), false);
};

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
  fileFilter: imageFileFilter,
});

// ── Document upload (posts) ──────────────────────────────────────────────────
const docDest = "public/files/posts";
if (!fs.existsSync(docDest)) fs.mkdirSync(docDest, { recursive: true });

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, docDest),
  filename: (req, file, cb) => cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname),
});

const docFileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Not a document! Please upload only PDF, DOC, or DOCX files."), false);
};

const uploadDocument = multer({
  storage: docStorage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB
  fileFilter: docFileFilter,
});

// ── No-file form-data parser ─────────────────────────────────────────────────
const uploadNone = multer({ storage: multer.memoryStorage() });

// ── Shared error handler ─────────────────────────────────────────────────────
const multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ status: "fail", message: "File size exceeds limit." });
  } else {
    next(err);
  }
};

module.exports = { uploadImage, uploadDocument, uploadNone, multerErrorHandling };
