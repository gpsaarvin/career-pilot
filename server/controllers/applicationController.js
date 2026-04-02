const {
  upsertApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  addSearchHistory,
  getSearchHistory,
} = require("../services/storageService");

async function apply(req, res, next) {
  try {
    const { internshipId, internshipTitle, company, applyLink, status, notes } = req.body || {};
    if (!internshipId || !internshipTitle || !company) {
      return res.status(400).json({ message: "internshipId, internshipTitle, company are required" });
    }

    const item = await upsertApplication(req.user.id, {
      internshipId,
      internshipTitle,
      company,
      applyLink,
      status: status || "saved",
      notes,
    });

    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const items = await getApplications(req.user.id);
    return res.json({ items, count: items.length });
  } catch (error) {
    return next(error);
  }
}

async function patch(req, res, next) {
  try {
    const item = await updateApplication(req.user.id, req.params.id, req.body || {});
    if (!item) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json(item);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const ok = await deleteApplication(req.user.id, req.params.id);
    if (!ok) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function saveSearch(req, res, next) {
  try {
    const query = String(req.body?.query || "").trim();
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }

    await addSearchHistory(req.user.id, query);
    return res.status(201).json({ query });
  } catch (error) {
    return next(error);
  }
}

async function history(req, res, next) {
  try {
    const items = await getSearchHistory(req.user.id);
    return res.json({ items, count: items.length });
  } catch (error) {
    return next(error);
  }
}

module.exports = { apply, list, patch, remove, saveSearch, history };
