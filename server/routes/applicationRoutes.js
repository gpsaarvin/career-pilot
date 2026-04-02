const express = require("express");
const {
  apply,
  list,
  patch,
  remove,
  saveSearch,
  history,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/apply", protect, apply);
router.get("/applications", protect, list);
router.patch("/applications/:id", protect, patch);
router.delete("/applications/:id", protect, remove);
router.post("/applications/search", protect, saveSearch);
router.get("/applications/search-history", protect, history);

module.exports = router;
