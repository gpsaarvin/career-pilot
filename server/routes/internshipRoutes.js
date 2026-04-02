const express = require("express");
const {
  getInternships,
  getInternship,
  clickInternship,
  getFilters,
  searchByCompany,
} = require("../controllers/internshipController");

const router = express.Router();

router.get("/", getInternships);
router.get("/filters", getFilters);
router.get("/company-search", searchByCompany);
router.get("/:id", getInternship);
router.post("/:id/click", clickInternship);

module.exports = router;
