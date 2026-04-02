const path = require("node:path");
const multer = require("multer");
const express = require("express");
const { protect } = require("../middleware/auth");
const {
  uploadResume,
  analyzeResume,
  recommendations,
} = require("../controllers/resumeController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    return cb(null, true);
  },
});

router.post("/resume/upload", protect, upload.single("resume"), uploadResume);
router.post("/resume/analyze", protect, analyzeResume);
router.get("/recommendations", protect, recommendations);

module.exports = router;
