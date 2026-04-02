const fs = require("node:fs/promises");
const pdfParse = require("pdf-parse");
const { promptJson } = require("../utils/aiClient");
const { listInternships } = require("../services/internshipService");

const fallbackSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "Git",
  "Docker",
];

function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  return fallbackSkills.filter((skill) => lower.includes(skill.toLowerCase()));
}

function fallbackSuggestions(skills) {
  return [
    {
      category: "Content",
      priority: "high",
      title: "Quantify your impact",
      suggestion: "Add measurable outcomes to each experience bullet using numbers, percentages, or time saved.",
    },
    {
      category: "Projects",
      priority: "high",
      title: "Show real project depth",
      suggestion: "Include 2-3 projects with a clear problem statement, stack used, and your exact contribution.",
    },
    {
      category: "ATS Optimization",
      priority: "medium",
      title: "Improve keyword alignment",
      suggestion: `Mirror internship keywords like ${skills.slice(0, 4).join(", ") || "React, Node.js, SQL"
      } in relevant resume sections.`,
    },
    {
      category: "Formatting",
      priority: "low",
      title: "Keep a clean ATS format",
      suggestion: "Use standard section headers, avoid tables/columns, and keep dates/job titles consistently formatted.",
    },
  ];
}

function normalizePriority(priority) {
  const value = String(priority || "").toLowerCase();
  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }
  return "medium";
}

function normalizeSuggestions(rawSuggestions, fallback) {
  if (!Array.isArray(rawSuggestions) || !rawSuggestions.length) {
    return fallback;
  }

  const normalized = rawSuggestions
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const category = String(item.category || "General").trim() || "General";
      const title = String(item.title || "Improve this section").trim() || "Improve this section";
      const suggestion = String(item.suggestion || "Add more specific and role-aligned details.").trim();

      if (!suggestion) {
        return null;
      }

      return {
        category,
        priority: normalizePriority(item.priority),
        title,
        suggestion,
      };
    })
    .filter(Boolean)
    .slice(0, 8);

  return normalized.length ? normalized : fallback;
}

function clampScore(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return 62;
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function fallbackAtsAnalysis(text, skills) {
  const lower = text.toLowerCase();
  const sectionHits = [
    /experience/.test(lower),
    /project/.test(lower),
    /education/.test(lower),
    /skill/.test(lower),
  ].filter(Boolean).length;
  const quantifiedHits = (text.match(/\d+%|\d+\+|\$\d+|\d+\s*(users|clients|days|months|years)/gi) || []).length;
  const score = clampScore(45 + skills.length * 4 + sectionHits * 6 + Math.min(quantifiedHits, 5) * 4);

  return {
    atsScore: score,
    summary:
      "Solid baseline resume, but ATS strength can improve with more role-aligned keywords and quantified impact.",
    strengths: [
      "Contains core technical skills",
      "Uses recognizable resume sections",
    ],
    missingKeywords: [
      "Problem Solving",
      "Collaboration",
      "Communication",
    ],
  };
}

async function analyzeResumeText(text) {
  const skillResult = await promptJson(
    "You are a resume analyzer. Return only JSON object with key skills as array of strings.",
    `Extract skills from this resume:\n\n${text.slice(0, 3000)}`,
    { skills: extractSkillsFromText(text) }
  );

  const suggestionResult = await promptJson(
    "You are an expert ATS resume reviewer. Return only JSON with key suggestions as array. Each suggestion must include: category (string), priority (high|medium|low), title (max 7 words), suggestion (specific 1-2 sentences with an actionable change).",
    `Analyze this resume and return 5 to 7 high-quality improvement suggestions. Prioritize ATS impact first. Resume:\n\n${text.slice(
      0,
      5000
    )}`,
    { suggestions: fallbackSuggestions(extractSkillsFromText(text)) }
  );

  const skills = Array.isArray(skillResult?.skills)
    ? skillResult.skills.map((value) => String(value))
    : extractSkillsFromText(text);

  const atsResult = await promptJson(
    "You are a senior ATS resume reviewer. Return only JSON with keys: atsScore (0-100 integer), summary (string), strengths (string[]), missingKeywords (string[]).",
    `Evaluate this resume for ATS performance and provide a strict score and concise guidance:\n\n${text.slice(0, 5000)}`,
    fallbackAtsAnalysis(text, skills),
    {
      model:
        process.env.ATS_RESUME_MODEL ||
        process.env.OPENROUTER_MODEL ||
        process.env.AI_MODEL,
      temperature: 0.2,
    }
  );

  const suggestions = normalizeSuggestions(
    suggestionResult?.suggestions,
    fallbackSuggestions(skills)
  );

  return {
    atsScore: clampScore(atsResult?.atsScore),
    summary:
      typeof atsResult?.summary === "string" && atsResult.summary.trim()
        ? atsResult.summary.trim()
        : fallbackAtsAnalysis(text, skills).summary,
    strengths: Array.isArray(atsResult?.strengths)
      ? atsResult.strengths.map((value) => String(value))
      : fallbackAtsAnalysis(text, skills).strengths,
    missingKeywords: Array.isArray(atsResult?.missingKeywords)
      ? atsResult.missingKeywords.map((value) => String(value))
      : fallbackAtsAnalysis(text, skills).missingKeywords,
    skills,
    suggestions,
  };
}

async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const fileBuffer = await fs.readFile(req.file.path);
    const parsed = await pdfParse(fileBuffer);
    const text = parsed.text || "";
    const analysis = await analyzeResumeText(text);

    return res.json({
      fileName: req.file.filename,
      textPreview: text.slice(0, 1000),
      ...analysis,
    });
  } catch (error) {
    return next(error);
  }
}

async function analyzeResume(req, res, next) {
  try {
    const text = String(req.body?.text || "");
    if (!text.trim()) {
      return res.status(400).json({ message: "text is required" });
    }

    const analysis = await analyzeResumeText(text);
    return res.json(analysis);
  } catch (error) {
    return next(error);
  }
}

async function recommendations(req, res, next) {
  try {
    const skills = Array.isArray(req.query.skills)
      ? req.query.skills.map(String)
      : String(req.query.skills || "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);

    const feed = await listInternships({ limit: 60 });
    const ranked = feed
      .map((item) => {
        const hay = `${item.title} ${item.description}`.toLowerCase();
        const score = skills.reduce(
          (sum, skill) => sum + (hay.includes(skill.toLowerCase()) ? 1 : 0),
          0
        );
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return res.json({ items: ranked, count: ranked.length });
  } catch (error) {
    return next(error);
  }
}

module.exports = { uploadResume, analyzeResume, recommendations };
