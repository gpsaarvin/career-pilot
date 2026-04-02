const express = require("express");
const { googleAuth, me, updateMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/google", googleAuth);
router.get("/me", protect, me);
router.put("/me", protect, updateMe);

module.exports = router;
