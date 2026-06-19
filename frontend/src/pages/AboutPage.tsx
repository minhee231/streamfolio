const SKILLS = [
  "TypeScript",
  "React",
  "FastAPI",
  "Python",
  "PostgreSQL",
  "Docker",
  "Tailwind CSS",
  "SQLAlchemy",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-headline-xl text-on-surface mb-8">About</h1>

      <div className="flex gap-6 mb-10 items-center">
        <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 border-2 border-primary">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
        </div>
        <div>
          <h2 className="text-headline-lg text-on-surface mb-1">Isaac Developer</h2>
          <p className="text-on-surface-variant text-body-md">
            Full Stack Developer · Seoul, Korea
          </p>
          <p className="text-on-surface-variant text-body-sm mt-1">
            TypeScript, React, FastAPI를 주력으로 다양한 풀스택 프로젝트를 개발합니다.
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">code</span>
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="bg-surface-container-high text-on-surface px-4 py-2 rounded-full text-body-md hover:bg-surface-container-highest transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">work</span>
          Experience
        </h3>
        <div className="space-y-4">
          <div className="bg-surface-container rounded-xl p-5 border border-white/5">
            <p className="text-body-sm text-on-surface-variant mb-1">2023 – Present</p>
            <h4 className="text-body-md font-bold text-on-surface">Full Stack Developer</h4>
            <p className="text-body-sm text-on-surface-variant">
              React + FastAPI 기반 SaaS 서비스 개발
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">mail</span>
          Contact
        </h3>
        <p className="text-on-surface-variant text-body-md">
          <a
            href="mailto:goominhee123@gmail.com"
            className="text-primary hover:underline"
          >
            goominhee123@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
