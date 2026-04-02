"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Internship } from "@/types";
import { companyInitials, getCompanyLogoUrl } from "@/lib/companyBrand";

type Props = {
  internship: Internship;
  onSave?: (internship: Internship) => void;
  onApply?: (internship: Internship) => void;
};

export default function InternshipCard({ internship, onSave, onApply }: Props) {
  const [showLogoFallback, setShowLogoFallback] = useState(false);
  const logoUrl = useMemo(
    () => getCompanyLogoUrl(internship.company, internship.companyLogo, internship.applyLink),
    [internship.company, internship.companyLogo, internship.applyLink]
  );

  const openApplyPage = () => {
    if (!internship.applyLink) {
      return;
    }
    window.open(internship.applyLink, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className="card cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={openApplyPage}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openApplyPage();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <a
          className="flex items-start gap-3 rounded-xl p-1 transition hover:bg-[#fff6ea]"
          href={internship.applyLink}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          {logoUrl && !showLogoFallback ? (
            <img
              src={logoUrl}
              alt={`${internship.company} logo`}
              className="h-11 w-11 rounded-xl border border-[#efd6b5] bg-white object-contain p-1"
              loading="lazy"
              onError={() => setShowLogoFallback(true)}
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#efd6b5] bg-[#fff3e0] text-sm font-bold text-[#8a3f22]">
              {companyInitials(internship.company)}
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#bb5c37]">{internship.company}</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{internship.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{internship.location}</p>
          </div>
        </a>
        <span className="rounded-full bg-[#ffe8cd] px-3 py-1 text-xs font-semibold text-[#8a3f22]">
          {internship.type}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-700">{internship.description}</p>

      <a
        className="mt-3 block truncate text-sm font-medium text-[#bb5c37] hover:text-[#8a3f22]"
        href={internship.applyLink}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        Apply link: {internship.applyLink}
      </a>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/internships/${internship.id}`}
          className="btn btn-secondary"
          onClick={(event) => event.stopPropagation()}
        >
          View details
        </Link>
        <button
          className="btn btn-ghost"
          onClick={(event) => {
            event.stopPropagation();
            onSave?.(internship);
          }}
          type="button"
        >
          Save
        </button>
        <button
          className="btn btn-primary"
          onClick={(event) => {
            event.stopPropagation();
            onApply?.(internship);
          }}
          type="button"
        >
          Mark applied
        </button>
      </div>
    </article>
  );
}
