const SKILL_GROUPS = [
  {
    label: "AI / ML",
    skills: ["PyTorch", "Hugging Face", "LangChain", "vLLM", "scikit-learn"],
  },
  {
    label: "Backend",
    skills: ["Python", "FastAPI", "Flask", "Pydantic", "Celery"],
  },
  {
    label: "MLOps / Infra",
    skills: ["Docker", "Kubernetes", "MLflow", "Airflow", "GitHub Actions"],
  },
  {
    label: "Data / Vector DB",
    skills: ["PostgreSQL", "Redis", "Qdrant", "Pinecone", "Elasticsearch"],
  },
  {
    label: "Cloud / Monitoring",
    skills: ["AWS SageMaker", "AWS EKS", "Prometheus", "Grafana", "S3"],
  },
  {
    label: "Language",
    skills: ["Python", "SQL", "Bash", "JavaScript"],
  },
];

const EXPERIENCE = [
  {
    period: "2023.04 – 현재",
    company: "㈜뉴럴웍스",
    role: "AI Engineer (Senior)",
    bullets: [
      "사내 문서 30만 건 RAG 파이프라인 구축 — 검색 정확도 78% → 91% 향상",
      "FastAPI + LangChain LLM 게이트웨이 개발 · 운영 (일평균 12만 요청 처리)",
      "vLLM 멀티 GPU 서빙 최적화 — p95 응답시간 2.1s → 0.7s 달성",
      "Prometheus / Grafana 기반 LLM 응답 품질 모니터링 시스템 구축",
    ],
  },
  {
    period: "2021.01 – 2023.03",
    company: "데이터브릿지㈜",
    role: "Machine Learning Engineer",
    bullets: [
      "이커머스 협업 필터링 + 딥러닝 추천 모델 개발 — CTR 14% 향상",
      "MLflow 모델 레지스트리 및 실험 관리 체계 도입",
      "Airflow 배치 학습 파이프라인 설계 · 운영",
    ],
  },
  {
    period: "2020.06 – 2020.12",
    company: "코어AI랩",
    role: "Intern",
    bullets: [
      "BERT 기반 텍스트 분류 프로토타입 개발",
      "데이터 전처리 자동화 스크립트 작성",
    ],
  },
];

const EDUCATION = [
  {
    period: "2019 – 2021",
    school: "한빛대학교 대학원",
    degree: "AI학과 석사 (GPA 4.1 / 4.5)",
    note: "논문: Query-Aware Document Re-ranking for Open-Domain QA using Bi-Encoder",
  },
  {
    period: "2013 – 2019",
    school: "한빛대학교",
    degree: "컴퓨터공학과 학사 (GPA 3.8 / 4.5)",
    note: "",
  },
];

const CERTS = [
  { name: "정보처리기사", date: "2020.08" },
  { name: "AWS Certified ML – Specialty", date: "2022.05" },
  { name: "SQLD", date: "2021.03" },
  { name: "TOEIC 920", date: "2023.09" },
];

const AWARDS = [
  { name: "전국 AI 해커톤 대상", date: "2022.11" },
  { name: "사내 기술혁신상 (RAG 프로젝트)", date: "2024.02" },
  { name: "Kaggle NLP 대회 상위 3%", date: "2021.07" },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-headline-xl text-on-surface mb-8">About</h1>

      {/* Profile */}
      <div className="flex gap-6 mb-10 items-start">
        <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 border-2 border-primary">
          <span className="material-symbols-outlined text-4xl text-primary">smart_toy</span>
        </div>
        <div>
          <h2 className="text-headline-lg text-on-surface mb-1">김이삭 (Isaac Kim)</h2>
          <p className="text-on-surface-variant text-body-md mb-1">
            AI Engineer · LLM / MLOps · 5년차 · Seoul, Korea
          </p>
          <p className="text-on-surface-variant text-body-sm leading-relaxed mb-3">
            LLM 기반 프로덕션 서비스의 전 주기를 경험한 AI 엔지니어입니다.
            RAG 파이프라인 설계·운영, 모델 파인튜닝, vLLM 고성능 서빙,
            FastAPI 백엔드 개발, MLOps 자동화까지 LLM 인프라 전반을 다룹니다.
          </p>
          <div className="flex flex-wrap gap-3 text-body-sm">
            <a
              href="mailto:isaac.kim.ai@gmail.com"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              isaac.kim.ai@gmail.com
            </a>
            <a
              href="https://github.com/isaac-kim-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-base">code</span>
              github.com/isaac-kim-ai
            </a>
            <a
              href="https://isaac-ai.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-base">language</span>
              isaac-ai.dev
            </a>
          </div>
        </div>
      </div>

      {/* Skills */}
      <section className="mb-8">
        <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">build</span>
          Skills
        </h3>
        <div className="space-y-3">
          {SKILL_GROUPS.map((group) => (
            <div key={group.label} className="flex gap-3 items-start">
              <span className="text-on-surface-variant text-body-sm w-36 flex-shrink-0 pt-1">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-body-sm hover:bg-surface-container-highest transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">work</span>
          Experience
        </h3>
        <div className="space-y-4">
          {EXPERIENCE.map((job) => (
            <div
              key={job.company}
              className="bg-surface-container rounded-xl p-5 border border-white/5"
            >
              <p className="text-body-sm text-on-surface-variant mb-1">{job.period}</p>
              <h4 className="text-body-md font-bold text-on-surface">{job.company}</h4>
              <p className="text-body-sm text-primary mb-2">{job.role}</p>
              <ul className="space-y-1">
                {job.bullets.map((b) => (
                  <li key={b} className="text-body-sm text-on-surface-variant flex gap-2">
                    <span className="text-primary mt-0.5 flex-shrink-0">·</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">school</span>
          Education
        </h3>
        <div className="space-y-3">
          {EDUCATION.map((edu) => (
            <div
              key={edu.degree}
              className="bg-surface-container rounded-xl p-5 border border-white/5"
            >
              <p className="text-body-sm text-on-surface-variant mb-1">{edu.period}</p>
              <h4 className="text-body-md font-bold text-on-surface">{edu.school}</h4>
              <p className="text-body-sm text-primary">{edu.degree}</p>
              {edu.note && (
                <p className="text-body-sm text-on-surface-variant mt-1 italic">{edu.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Certs & Awards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <section>
          <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">verified</span>
            Certifications
          </h3>
          <div className="space-y-2">
            {CERTS.map((c) => (
              <div
                key={c.name}
                className="flex justify-between items-center bg-surface-container rounded-lg px-4 py-2 border border-white/5"
              >
                <span className="text-body-sm text-on-surface">{c.name}</span>
                <span className="text-body-sm text-on-surface-variant">{c.date}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">emoji_events</span>
            Awards
          </h3>
          <div className="space-y-2">
            {AWARDS.map((a) => (
              <div
                key={a.name}
                className="flex justify-between items-center bg-surface-container rounded-lg px-4 py-2 border border-white/5"
              >
                <span className="text-body-sm text-on-surface">{a.name}</span>
                <span className="text-body-sm text-on-surface-variant">{a.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Contact */}
      <section>
        <h3 className="text-headline-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">mail</span>
          Contact
        </h3>
        <p className="text-on-surface-variant text-body-md">
          <a
            href="mailto:isaac.kim.ai@gmail.com"
            className="text-primary hover:underline"
          >
            isaac.kim.ai@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
