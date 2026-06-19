from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from app.db.engine import engine, Base
from app.models import project as _project_model  # noqa: F401
from app.models import admin as _admin_model  # noqa: F401
from app.models.admin import Admin
from app.models.project import Project
from app.core.config import settings
from app.core.security import get_password_hash
from app.routers import projects, auth
from app.db.session import AsyncSessionLocal

_IMG = "https://lh3.googleusercontent.com/aida-public/"
SAMPLE_PROJECTS = [
    {
        "title": "Enterprise RAG Pipeline",
        "description": "사내 30만 건 문서를 대상으로 구축한 프로덕션 RAG 파이프라인. Qdrant 벡터 DB와 BM25 하이브리드 검색, Bi-Encoder 재순위화를 결합해 검색 정확도를 78%에서 91%로 끌어올렸습니다. Kubernetes 기반 수평 확장으로 동시 요청 500건을 안정 처리합니다.",
        "category": "LLM / RAG",
        "tech_stack": "Python,LangChain,Qdrant,FastAPI,Kubernetes,Hugging Face",
        "is_featured": True,
        "is_published": True,
        "thumbnail_url": _IMG + "AB6AXuD9oX6G9mAbPwbsFrvKU9oHw2Xfcbbqvj4NY41yqgdt3BPqEv-8CrOBC9ouLNAkA23t0XTUpgoInFE-Eg5cq6WOx1j1MBD6_O56pUACXjdECJenWU9fhhh-CT7ur4zjL52fV3Oe_dV9InJAV_aTVH6Tg3ys10EnyPkwAjg80gkn8z4aPqK9iHmOwjvmiN2LEwRDYzQspOjqJ2wZKY3rRnTcuN8XruFrvhk3ZjfUQKtQinFeYv4DzvvdIiIV1rwIXyGn0YEJZlTmo99u",
    },
    {
        "title": "LLM Gateway",
        "description": "OpenAI / Anthropic / 사내 오픈소스 모델을 단일 엔드포인트로 통합하는 LLM 게이트웨이. FastAPI + LangChain 기반으로 일평균 12만 요청을 처리하며, 모델별 fallback·rate-limit·비용 추적 기능을 내장합니다.",
        "category": "Backend / LLM",
        "tech_stack": "FastAPI,LangChain,Redis,Prometheus,Python,Docker",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": _IMG + "AB6AXuCX8EKJCMxjBpmmHYkfEgvlz2nI_HEfqadgLSol71JQykmSFZlGf_GKMneMP7RxQ8cF8vD8J4amnoZbtfOiCTqRGxVA-pclvo77Uzr-Fy_QIrYchvbx3uyN76fFq58zel_uAl_-nXjQM14ax2MgmAROYxiGqPXYptJkMVMc3WopJH23KscrZvV0EgNubhRuPex8VlhhaRnermtn7Xc38XGnFIxNk6poCI6Cc0XJoPhSlBMoqnh5whGPqwXSJdKC1PVXEAG5C7Uc9agI",
    },
    {
        "title": "vLLM Serving Optimization",
        "description": "vLLM 멀티 GPU 추론 서버 최적화 프로젝트. PagedAttention 튜닝, NVIDIA TensorRT-LLM 변환, Kubernetes HPA 설정을 통해 p95 응답시간을 2.1s에서 0.7s로 단축했습니다. GPU 활용률 60% → 87% 개선.",
        "category": "MLOps / Infra",
        "tech_stack": "vLLM,Kubernetes,NVIDIA TensorRT,Python,Prometheus",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": _IMG + "AB6AXuDRzFAXIlBdjbTz82Mm3HS_vxn9CaJwN15yLLUAWrrPFiRDstPmLn7nR5NEzK94JGygwgk1MOohN4xtKu2NAlJJeG2SteK7Za-l4glhS9z1jn997pe97yGWH3dRKxHvviwA0ZhTVl-WHEslQ54RS5Ruhv3AKq6va6cEnHPX6RiTH5Rm2PjYc9SwIvfKZ0oPCu2A82NzoLrRcaY7UWIfTuM1Df-Em5CEj5ke8HQlaR8RDxsgBrnURgVbQirmPtBWxo2V8OPHkqbXwaIx",
    },
    {
        "title": "LLM Monitoring Dashboard",
        "description": "LLM 서비스 품질을 실시간 추적하는 Grafana 대시보드. Prometheus exporter로 토큰 소비량·응답시간·ROUGE 스코어·환각 비율을 수집하고, 임계값 초과 시 Slack 알림을 발송합니다.",
        "category": "MLOps",
        "tech_stack": "Prometheus,Grafana,FastAPI,PostgreSQL,Python",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": _IMG + "AB6AXuBqrZeLniagy-FYp2oPa4gwbushbNyDYlRE2k4-g3WiZpuU9FS3c5EqHJgMGTB2REacZB1pD9h_7Z3gczq_LDnWedVrP5EAjZXns5tUMeQBJeupudVfFTo4OPbRnmVo0wwDGA1X4W4YWIPx1qW2pOKOf8gdlJbejG_NHtkNrt5gMC96qt5tJnZflYulba0PEgfrKv7eqmqlhdHJ7n1gd2CI307mppd83smnu44oZamhUlgs1NJ-yBmE3Wy4ywaS1ixBSgxmbvJuuYWz",
    },
    {
        "title": "E-commerce Recommendation Engine",
        "description": "이커머스 플랫폼을 위한 협업 필터링 + 딥러닝 하이브리드 추천 모델. 사용자 클릭 시퀀스를 Transformer로 인코딩해 실시간 개인화 추천을 제공하며 CTR 14% 향상을 달성했습니다. Redis 캐싱으로 p99 30ms 이하를 유지합니다.",
        "category": "ML / Recommendation",
        "tech_stack": "PyTorch,Airflow,Redis,Elasticsearch,FastAPI,PostgreSQL",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": _IMG + "AB6AXuBNGWvxrL4Y2htRKxFOQr-IFdipUnN855UXGS2DpRg08p5wCBSx8F4T6C8NcMDq5wEApq9B6ikCoUy0x2f4rLRFpSyaPJdmB3LkA1702v9bBncQdgfXSnpg-rdOh4a7Aq71h3haGcYa35qpj_gvpvElt6i-kuCvGijYn9M1V0zdJCPrL66pkNC5Bzf0cRA-8HwNg5HjJo8-Vh19GOJIt-1JTaEfsVkDYBhty-x1V348RpiV60E3fM2lhjm-J-NPZ00AdRdcEUC5_BZj",
    },
    {
        "title": "MLflow Model Registry",
        "description": "팀 전체 ML 실험을 체계화한 MLflow 기반 모델 관리 플랫폼. Airflow DAG으로 주 2회 배치 재학습을 자동화하고, 스테이징→프로덕션 프로모션 워크플로로 배포 리드타임을 3일에서 4시간으로 단축했습니다.",
        "category": "MLOps",
        "tech_stack": "MLflow,Airflow,PostgreSQL,Docker,Python,AWS S3",
        "is_featured": False,
        "is_published": True,
        "thumbnail_url": _IMG + "AB6AXuAHPZwmEinPX5yopLGeloCr9bNYJEqQp_ZJd_q--C6yhg5V4zR7hSYejn6qv15Kfk7YMsL96criZXaFquwOKMXNUofLJ5WPb1C2qSZy4ou9s4-EPYKGQIld89dRbkLecX22oH8jwecp8AvvctJqeCip8sxGnuTse3ev6RmiUXxe_-8UuCrQEcAGGJ9T9FZ7gbwd2TJqAfVr3dhZf9MkRZkDh2qLp4p1jawZg6C-j4MoFXdE33Dhp3WXIYOjpT6d6hhT4ysL58BdC1F6",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Admin).where(Admin.username == settings.admin_username)
        )
        if not result.scalar_one_or_none():
            db.add(
                Admin(
                    username=settings.admin_username,
                    hashed_password=get_password_hash(settings.admin_password),
                )
            )
        count_result = await db.execute(select(func.count()).select_from(Project))
        if count_result.scalar() == 0:
            for data in SAMPLE_PROJECTS:
                db.add(Project(**data))
        await db.commit()
    yield


app = FastAPI(title="Streamfolio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
