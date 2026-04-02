const express = require("express");
const { protect } = require("../middleware/auth");
const { resumeSuggestions } = require("../controllers/aiController");

const router = express.Router();

router.post("/ai/resume-suggestions", protect, resumeSuggestions);
router.post("/ai-resume-suggestions", protect, resumeSuggestions);

module.exports = router;
