import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <div className="hero-wrap">
        <div>
          <p className="eyebrow">Internship recommendation platform</p>
          <h1 className="hero-title">
            Navigate internships with confidence, not chaos.
          </h1>
          <p className="hero-subtitle">
            CareerPilot helps you discover internship opportunities, save or mark applications,
            and optimize your resume with practical AI guidance.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/internships" className="btn btn-secondary">
              Explore internships
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h2 className="text-2xl font-semibold text-slate-900">What you get</h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li>Responsive internship feed with filters for skills, company, and location.</li>
            <li>Dashboard tracking both saved opportunities and applied internships.</li>
            <li>Google OAuth-only authentication flow for simple sign-in.</li>
            <li>Resume upload analysis with extracted skills and actionable feedback.</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="panel">
          <p className="eyebrow">01</p>
          <h3 className="text-lg font-semibold">Smart Feed</h3>
          <p className="mt-2 text-sm text-slate-600">
            Aggregates internships and keeps relevance focused on internship-type roles.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">02</p>
          <h3 className="text-lg font-semibold">Action Tracker</h3>
          <p className="mt-2 text-sm text-slate-600">
            Move roles between saved and applied states with one click.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">03</p>
          <h3 className="text-lg font-semibold">Resume Lab</h3>
          <p className="mt-2 text-sm text-slate-600">
            Get skill extraction and practical improvement suggestions built for ATS outcomes.
          </p>
        </article>
      </div>
    </section>
  );
}
