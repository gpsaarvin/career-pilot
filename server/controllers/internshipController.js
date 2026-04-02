const {
  listInternships,
  getInternshipById,
  trackClick,
  buildFilters,
  companySearch,
} = require("../services/internshipService");

async function getInternships(req, res, next) {
  try {
    const { query = "", company = "", location = "", page = "1", limit = "200" } = req.query;
    const items = await listInternships({
      query: String(query),
      company: String(company),
      location: String(location),
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    return res.json({ items, count: items.length });
  } catch (error) {
    return next(error);
  }
}

async function getInternship(req, res, next) {
  try {
    const item = await getInternshipById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Internship not found" });
    }

    return res.json(item);
  } catch (error) {
    return next(error);
  }
}

async function clickInternship(req, res, next) {
  try {
    const clicks = trackClick(req.params.id);
    return res.json({ id: req.params.id, clicks });
  } catch (error) {
    return next(error);
  }
}

async function getFilters(req, res, next) {
  try {
    const items = await listInternships({ limit: 200 });
    return res.json(buildFilters(items));
  } catch (error) {
    return next(error);
  }
}

async function searchByCompany(req, res, next) {
  try {
    const company = String(req.query.company || "").trim();
    if (!company) {
      return res.status(400).json({ message: "company is required" });
    }

    const items = await companySearch(company, 30);
    return res.json({ items, count: items.length });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getInternships,
  getInternship,
  clickInternship,
  getFilters,
  searchByCompany,
};
