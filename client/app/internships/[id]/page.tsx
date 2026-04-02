import Link from "next/link";
import { api } from "@/lib/api";
import { companyInitials, getCompanyLogoUrl } from "@/lib/companyBrand";

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const internship = await api.internships.one(id);
  const logoUrl = getCompanyLogoUrl(
    internship.company,
    internship.companyLogo,
    internship.applyLink
  );

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
      <article className="panel">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${internship.company} logo`}
              className="h-12 w-12 rounded-xl border border-[#efd6b5] bg-white object-contain p-1"
              loading="lazy"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#efd6b5] bg-[#fff3e0] text-sm font-bold text-[#8a3f22]">
              {companyInitials(internship.company)}
            </div>
          )}
          <a
            className="eyebrow"
            href={internship.applyLink}
            target="_blank"
            rel="noreferrer"
          >
            {internship.company}
          </a>
        </div>
        <h1 className="hero-title">{internship.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{internship.location}</p>

        <p className="mt-6 whitespace-pre-wrap text-slate-700">{internship.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn btn-primary" href={internship.applyLink} target="_blank" rel="noreferrer">
            Apply now
          </a>
          <Link className="btn btn-secondary" href="/internships">
            Back to feed
          </Link>
        </div>
      </article>
    </section>
  );
}
