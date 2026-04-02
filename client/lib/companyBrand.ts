export function getCompanyLogoUrl(company?: string, companyLogo?: string, applyLink?: string) {
  const explicit = String(companyLogo || "").trim();
  if (explicit) {
    return explicit;
  }

  const fromApply = getHostname(applyLink);
  if (fromApply) {
    return `https://logo.clearbit.com/${fromApply}`;
  }

  const guessed = guessCompanyDomain(company);
  if (guessed) {
    return `https://logo.clearbit.com/${guessed}`;
  }

  return "";
}

export function companyInitials(company?: string) {
  const text = String(company || "").trim();
  if (!text) {
    return "CO";
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
}

function getHostname(url?: string) {
  const value = String(url || "").trim();
  if (!value) {
    return "";
  }

  try {
    return new URL(value).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function guessCompanyDomain(company?: string) {
  const text = String(company || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  if (!text) {
    return "";
  }

  return `${text}.com`;
}
