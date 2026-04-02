const mockInternships = [
  {
    id: "mock-1",
    title: "Frontend Intern",
    company: "CareerPilot Labs",
    location: "Bengaluru, India",
    type: "Internship",
    description:
      "Build responsive UI components in React and Next.js, collaborate with product and design, and ship production features.",
    applyLink: "https://www.tcs.com/careers",
    source: "mock",
    postedAt: new Date().toISOString(),
    isInternship: true,
  },
  {
    id: "mock-2",
    title: "Backend Intern",
    company: "TalentForge",
    location: "Remote, India",
    type: "Internship",
    description:
      "Support API development in Node.js, write tests, and improve API reliability and observability.",
    applyLink: "https://www.infosys.com/careers",
    source: "mock",
    postedAt: new Date().toISOString(),
    isInternship: true,
  },
  {
    id: "mock-3",
    title: "AI Engineering Intern",
    company: "SkillMatrix AI",
    location: "Hyderabad, India",
    type: "Internship",
    description:
      "Help build LLM-assisted resume analysis and ranking pipelines for internship recommendation systems.",
    applyLink: "https://www.wipro.com/careers/",
    source: "mock",
    postedAt: new Date().toISOString(),
    isInternship: true,
  },
];

module.exports = { mockInternships };
