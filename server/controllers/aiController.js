const { promptJson } = require("../utils/aiClient");

async function resumeSuggestions(req, res, next) {
  try {
    const { company, role, description } = req.body || {};
    if (!company || !role || !description) {
      return res.status(400).json({
        message: "company, role, and description are required",
      });
    }

    const fallback = {
      summary: `${role} at ${company} needs strong fundamentals, clear impact, and ATS-aligned resume language. Highlight relevant projects and measurable outcomes.`,
      requiredSkills: ["Communication", "Problem Solving", "JavaScript", "React"],
      atsKeywords: [company, role, "internship", "projects"],
      suggestedProjects: [
        "Build a role-relevant portfolio project with measurable metrics",
        "Add a production-style full-stack project with deployment",
      ],
    };

    const result = await promptJson(
      "You are a resume strategist. Output only valid JSON with keys: summary, requiredSkills, atsKeywords, suggestedProjects.",
      `Company: ${company}\nRole: ${role}\nJob Description: ${description}\n\nGenerate practical company-specific resume tips and ATS guidance.`,
      fallback
    );

    return res.json({
      summary: result.summary || fallback.summary,
      requiredSkills: Array.isArray(result.requiredSkills)
        ? result.requiredSkills
        : fallback.requiredSkills,
      atsKeywords: Array.isArray(result.atsKeywords)
        ? result.atsKeywords
        : fallback.atsKeywords,
      suggestedProjects: Array.isArray(result.suggestedProjects)
        ? result.suggestedProjects
        : fallback.suggestedProjects,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { resumeSuggestions };
