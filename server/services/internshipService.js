const { mockInternships } = require("../data/mockInternships");
const { promptJson } = require("../utils/aiClient");

const cache = {
  key: "",
  items: [],
  expiresAt: 0,
};

const clickMap = new Map();

const generatedCompanies = [
  "Tata Consultancy Services",
  "Infosys",
  "Wipro",
  "HCLTech",
  "Tech Mahindra",
  "Zoho",
  "Freshworks",
  "Razorpay",
  "Paytm",
  "PhonePe",
  "Swiggy",
  "Zomato",
  "Flipkart",
  "Myntra",
  "Nykaa",
  "Ola",
  "CRED",
  "Meesho",
  "Postman",
  "BrowserStack",
  "Unacademy",
  "UpGrad",
  "Byju's",
  "Lenskart",
  "Boat",
  "Delhivery",
  "PolicyBazaar",
  "Groww",
  "Pine Labs",
  "Dream11",
];

const generatedRoles = [
  "Software Engineering Intern",
  "Frontend Developer Intern",
  "Backend Developer Intern",
  "Full Stack Developer Intern",
  "Data Analyst Intern",
  "Data Science Intern",
  "Machine Learning Intern",
  "DevOps Intern",
  "Cloud Engineering Intern",
  "Product Management Intern",
  "QA Automation Intern",
  "Cybersecurity Intern",
  "UI UX Design Intern",
  "Mobile App Developer Intern",
  "Business Analyst Intern",
];

const generatedLocations = [
  "Bengaluru, India",
  "Hyderabad, India",
  "Pune, India",
  "Chennai, India",
  "Mumbai, India",
  "Delhi, India",
  "Noida, India",
  "Gurugram, India",
  "Kolkata, India",
  "Ahmedabad, India",
  "Remote, India",
];

function isInternshipLike(title = "") {
  const t = title.toLowerCase();
  return (
    t.includes("intern") ||
    t.includes("trainee") ||
    t.includes("apprentice") ||
    t.includes("graduate")
  );
}

function safeUrl(url) {
  const value = String(url || "").trim();
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function buildDirectApplyLink(company) {
  const normalized = String(company || "").toLowerCase().trim();

  const careerSiteMap = {
    "tata consultancy services": "https://www.tcs.com/careers",
    infosys: "https://www.infosys.com/careers",
    wipro: "https://careers.wipro.com/",
    hcltech: "https://www.hcltech.com/careers",
    "tech mahindra": "https://careers.techmahindra.com/",
    zoho: "https://www.zoho.com/careers/",
    freshworks: "https://www.freshworks.com/company/careers/",
    razorpay: "https://razorpay.com/jobs/",
    paytm: "https://paytm.com/careers/",
    phonepe: "https://www.phonepe.com/careers/",
    swiggy: "https://careers.swiggy.com/",
    zomato: "https://www.zomato.com/careers",
    flipkart: "https://www.flipkartcareers.com/#!/",
    myntra: "https://www.myntra.com/careers",
    nykaa: "https://www.nykaa.com/careers",
    ola: "https://www.olacabs.com/careers",
    cred: "https://careers.cred.club/",
    meesho: "https://careers.meesho.com/",
    postman: "https://www.postman.com/company/careers/",
    browserstack: "https://www.browserstack.com/careers",
    unacademy: "https://unacademy.com/careers",
    upgrad: "https://www.upgrad.com/careers/",
    "byju's": "https://byjus.com/careers-at-byjus/",
    lenskart: "https://hiring.lenskart.com/",
    boat: "https://www.boat-lifestyle.com/pages/careers",
    delhivery: "https://www.delhivery.com/careers/",
    policybazaar: "https://www.policybazaar.com/careers/",
    groww: "https://groww.in/careers",
    "pine labs": "https://www.pinelabs.com/careers",
    dream11: "https://www.dreamsports.group/careers",
  };

  if (careerSiteMap[normalized]) {
    return careerSiteMap[normalized];
  }

  const slug = normalized
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  if (!slug) {
    return "https://www.linkedin.com/jobs/";
  }

  return `https://www.${slug}.com/careers`;
}

function buildGeneratedInternships(count = 60, seed = "india") {
  const items = [];

  for (let i = 0; i < count; i += 1) {
    const company = generatedCompanies[i % generatedCompanies.length];
    const title = generatedRoles[Math.floor(i / generatedCompanies.length) % generatedRoles.length];
    const location = generatedLocations[i % generatedLocations.length];
    const id = `generated-${seed.replace(/[^a-z0-9]/gi, "").toLowerCase()}-${i + 1}`;

    items.push({
      id,
      title,
      company,
      companyLogo: "",
      location,
      type: "Internship",
      description:
        "Work with mentors on production-grade features, contribute to sprint goals, and present outcomes with measurable impact.",
      applyLink: buildDirectApplyLink(company),
      source: "generated",
      postedAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
      isInternship: true,
    });
  }

  return items;
}

function normalizeRapidJob(job) {
  const id = job.job_id || `rapid-${Math.random().toString(36).slice(2, 10)}`;
  const applyLink =
    safeUrl(job.job_apply_link) ||
    safeUrl(job.job_google_link) ||
    safeUrl(job.employer_website) ||
    buildDirectApplyLink(job.employer_name);

  return {
    id,
    title: job.job_title || "Internship",
    company: job.employer_name || "Unknown Company",
    companyLogo: safeUrl(job.employer_logo),
    location: job.job_city
      ? `${job.job_city}, ${job.job_country || ""}`.trim()
      : job.job_location || "India",
    type: job.job_employment_type || "Internship",
    description: job.job_description || "",
    applyLink,
    source: "rapidapi",
    postedAt: job.job_posted_at_datetime_utc || new Date().toISOString(),
    isInternship: isInternshipLike(job.job_title),
  };
}

function normalizeAdzunaJob(job) {
  const applyLink =
    safeUrl(job.redirect_url) ||
    safeUrl(job?.company?.url) ||
    buildDirectApplyLink(job?.company?.display_name);

  return {
    id: `adzuna-${job.id}`,
    title: job.title || "Internship",
    company: job.company?.display_name || "Unknown Company",
    companyLogo: "",
    location: job.location?.display_name || "India",
    type: "Internship",
    description: job.description || "",
    applyLink,
    source: "adzuna",
    postedAt: job.created || new Date().toISOString(),
    isInternship: isInternshipLike(job.title),
  };
}

function withTimeout(ms = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

async function fetchRapidJobs(query, page = 1, limit = 30) {
  if (!process.env.RAPIDAPI_KEY) {
    return [];
  }

  const host = process.env.RAPIDAPI_HOST || "jsearch.p.rapidapi.com";
  const timeout = Number(process.env.JOB_PROVIDER_TIMEOUT_MS || 12000);
  const { signal, done } = withTimeout(timeout);

  try {
    const params = new URLSearchParams({
      query: `${query || "software"} internship in India`,
      page: String(page),
      num_pages: "1",
      date_posted: "all",
    });

    const response = await fetch(`https://${host}/search?${params.toString()}`, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": host,
      },
      signal,
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data.data || []).slice(0, limit).map(normalizeRapidJob);
  } catch (error) {
    return [];
  } finally {
    done();
  }
}

async function fetchRapidJobsMulti(query, page = 1, limit = 120) {
  const maxPages = Number(process.env.INTERNSHIP_FETCH_PAGES || 3);
  const perPage = Math.max(20, Math.min(60, Number(process.env.INTERNSHIP_FETCH_PAGE_SIZE || 40)));
  const pages = Array.from({ length: Math.max(1, maxPages) }, (_, idx) => page + idx);

  const results = await Promise.all(pages.map((p) => fetchRapidJobs(query, p, perPage)));
  return dedupeJobs(results.flat()).slice(0, limit);
}

async function fetchAdzunaJobs(query, page = 1) {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    return [];
  }

  const country = process.env.ADZUNA_COUNTRY || "in";
  const where = process.env.ADZUNA_WHERE || "India";
  const timeout = Number(process.env.JOB_PROVIDER_TIMEOUT_MS || 12000);
  const { signal, done } = withTimeout(timeout);

  try {
    const params = new URLSearchParams({
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      results_per_page: "30",
      what: `${query || "software"} internship`,
      where,
      content_type: "application/json",
    });

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params.toString()}`;
    const response = await fetch(url, { signal });
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data.results || []).map(normalizeAdzunaJob);
  } catch (error) {
    return [];
  } finally {
    done();
  }
}

async function fetchAdzunaJobsMulti(query, page = 1, limit = 120) {
  const maxPages = Number(process.env.INTERNSHIP_FETCH_PAGES || 3);
  const pages = Array.from({ length: Math.max(1, maxPages) }, (_, idx) => page + idx);

  const results = await Promise.all(pages.map((p) => fetchAdzunaJobs(query, p)));
  return dedupeJobs(results.flat()).slice(0, limit);
}

function dedupeJobs(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.applyLink || `${item.company}-${item.title}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function filterInternships(items) {
  return items.filter((item) => item.isInternship);
}

function buildFilters(items) {
  const locations = [...new Set(items.map((item) => item.location).filter(Boolean))].slice(
    0,
    30
  );
  const companies = [...new Set(items.map((item) => item.company).filter(Boolean))].slice(
    0,
    30
  );
  return { locations, companies, types: ["Internship"] };
}

async function listInternships({ query = "", company = "", location = "", page = 1, limit = 200 }) {
  const cacheTtl = Number(process.env.DEFAULT_FEED_CACHE_TTL_MS || 300000);
  const key = `${query}|${company}|${location}|${page}|${limit}`;
  if (cache.key === key && cache.expiresAt > Date.now()) {
    return cache.items;
  }

  const sourceQuery = query || company;
  const fetchLimit = Math.max(60, Math.min(500, Number(limit) || 200));

  const [rapid, adzuna] = await Promise.all([
    fetchRapidJobsMulti(sourceQuery, page, fetchLimit),
    fetchAdzunaJobsMulti(sourceQuery, page, fetchLimit),
  ]);

  let items = dedupeJobs([...rapid, ...adzuna]);
  if (!items.length) {
    const useMock = String(process.env.USE_MOCK_INTERNSHIPS ?? "true").toLowerCase() !== "false";
    items = useMock ? mockInternships : [];
  }

  items = filterInternships(items);

  const lowerQuery = query.toLowerCase();
  const lowerCompany = company.toLowerCase();
  const lowerLocation = location.toLowerCase();

  items = items.filter((item) => {
    const qOk =
      !lowerQuery ||
      `${item.title} ${item.description}`.toLowerCase().includes(lowerQuery);
    const cOk = !lowerCompany || item.company.toLowerCase().includes(lowerCompany);
    const lOk = !lowerLocation || item.location.toLowerCase().includes(lowerLocation);
    return qOk && cOk && lOk;
  });

  const shouldGuaranteeIndiaFeed =
    !lowerQuery &&
    !lowerCompany &&
    (!lowerLocation || lowerLocation.includes("india") || lowerLocation.includes("remote"));

  if (shouldGuaranteeIndiaFeed && items.length < 50) {
    items = dedupeJobs([...items, ...buildGeneratedInternships(80, `${query}-${company}-${location}`)]);
  }

  const sliced = items.slice((page - 1) * limit, page * limit);
  cache.key = key;
  cache.items = sliced;
  cache.expiresAt = Date.now() + cacheTtl;

  return sliced;
}

async function getInternshipById(id) {
  const fromCache = cache.items.find((item) => item.id === id);
  if (fromCache) {
    return fromCache;
  }

  const fromMock = mockInternships.find((item) => item.id === id);
  if (fromMock) {
    return fromMock;
  }

  const feed = await listInternships({ limit: 60 });
  return feed.find((item) => item.id === id) || null;
}

function trackClick(id) {
  clickMap.set(id, (clickMap.get(id) || 0) + 1);
  return clickMap.get(id);
}

async function expandCompanyAliases(company) {
  const fallback = [company.toLowerCase()];
  const result = await promptJson(
    "Return only JSON object with key aliases containing likely company alias names in lowercase.",
    `Company: ${company}`,
    { aliases: fallback },
    {
      model:
        process.env.INTERNSHIP_AI_MODEL ||
        process.env.OPENROUTER_MODEL ||
        process.env.AI_MODEL,
      temperature: 0.1,
    }
  );

  const aliases = Array.isArray(result?.aliases) ? result.aliases : fallback;
  return [...new Set(aliases.map((item) => String(item).toLowerCase().trim()))].filter(Boolean);
}

async function companySearch(company, limit = 25) {
  const aliases = await expandCompanyAliases(company);
  const feed = await listInternships({ query: company, limit: 80 });

  return feed
    .filter((item) => {
      const hay = `${item.company} ${item.title} ${item.description}`.toLowerCase();
      return aliases.some((alias) => hay.includes(alias));
    })
    .slice(0, limit);
}

module.exports = {
  listInternships,
  getInternshipById,
  trackClick,
  buildFilters,
  companySearch,
};
