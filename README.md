# 시약 제조 및 용액 계산 웹 애플리케이션

분석화학 실험실용 시약 제조, 완충액 계산, 표준화 기록 관리 시스템

## 📋 프로젝트 개요

이 프로젝트는 분석화학 실험실에서 시약을 효율적으로 관리하고, 용액을 정확하게 계산하며, 실험 데이터를 기록하는 종합 웹 애플리케이션입니다.

### 기술 스택

**프론트엔드:**
- React 18 (Vite 기반 SPA)
- Axios (HTTP 클라이언트)
- 반응형 UI (모바일/태블릿 대응)

**백엔드:**
- Node.js + Express
- Prisma ORM (SQLite 개발 환경, PostgreSQL 전환 가능)
- CORS 지원

**개발 환경:**
- SQLite (경량 개발 DB)
- 모노레포 구조 (client, server 분리)

## 🚀 시작하기

### 1단계: 의존성 설치

```bash
# server 설정
cd server
npm install

# client 설정 (새 터미널)
cd client
npm install
```

### 2단계: 데이터베이스 초기화 및 시드 데이터 삽입

```bash
cd server

# Prisma 마이그레이션 및 시드 데이터 생성
npm run db:reset

# 또는 단계별로:
npm run db:push      # DB 스키마 생성
npm run db:seed      # 시드 데이터 삽입
```

### 3단계: 서버 실행

```bash
cd server
npm run dev
```

서버가 포트 5000에서 시작됩니다:
```
🚀 시약 DB 서버가 포트 5000에서 실행 중입니다.
📍 API 기본 주소: http://localhost:5000/api
```

### 4단계: 클라이언트 실행 (새 터미널)

```bash
cd client
npm run dev
```

클라이언트가 포트 3000에서 실행됩니다:
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:3000/
```

## 📊 데이터 모델

### Reagent (시약 마스터)
- 시약의 기본 정보 저장
- 분자량, 밀도, CAS No., 분자식 포함
- 카테고리: ACID, BASE, STANDARD, BUFFER_COMPONENT, SALT, OTHER

### HydrateVariant (수화물 종류)
- 같은 시약의 다양한 수화물 형태 저장
- 예: 1수화물, 2수화물 등

### BufferSystem (완충계 프리셋)
- 자주 사용하는 완충계 조합
- pKa 값 저장 (다염기산 대응)

### StandardizationRecord (표정 기록)
- 시약 표준화 실험 데이터 기록
- 시행 데이터, 평균, 표준편차, 상대표준편차 저장

### LabelRecord (라벨 발행 이력)
- 제조한 용액의 라벨 정보 기록
- 농도, 준비일, 유효기간, 로트번호 저장

## 🔌 API 엔드포인트

### Reagent CRUD API

```
GET    /api/reagents          # 모든 시약 조회
GET    /api/reagents/:id      # 특정 시약 조회
POST   /api/reagents          # 새 시약 등록
PUT    /api/reagents/:id      # 시약 정보 수정
DELETE /api/reagents/:id      # 시약 삭제
GET    /api/health            # 서버 상태 확인
```

### 요청 예시

**GET /api/reagents**
```bash
curl http://localhost:5000/api/reagents
```

**POST /api/reagents**
```bash
curl -X POST http://localhost:5000/api/reagents \
  -H "Content-Type: application/json" \
  -d '{
    "name_kr": "질산",
    "name_en": "Nitric Acid",
    "cas_no": "7697-37-2",
    "formula": "HNO₃",
    "mw_anhydrous": 63.01,
    "density": 1.41,
    "default_assay": 70,
    "category": "ACID"
  }'
```

## 📦 시드 데이터 (기본 10종 시약)

| 한글명 | 영문명 | 분자식 | 분자량 | CAS No. | 카테고리 |
|--------|--------|--------|--------|---------|----------|
| 수산화나트륨 | Sodium Hydroxide | NaOH | 40.00 | 1310-73-2 | BASE |
| 염산 | Hydrochloric Acid | HCl | 36.46 | 7647-01-0 | ACID |
| 황산 | Sulfuric Acid | H₂SO₄ | 98.08 | 7664-93-9 | ACID |
| 프탈산수소칼륨 | Potassium Hydrogen Phthalate (KHP) | KHC₈H₄O₄ | 204.23 | 877-24-7 | STANDARD |
| 탄산나트륨 | Sodium Carbonate | Na₂CO₃ | 105.99 | 497-19-8 | SALT |
| 염화나트륨 | Sodium Chloride | NaCl | 58.44 | 7647-14-5 | SALT |
| 초산 | Acetic Acid | CH₃COOH | 60.05 | 64-19-7 | ACID |
| 초산나트륨 | Sodium Acetate | CH₃COONa | 82.03 | 127-09-3 | BUFFER_COMPONENT |
| 트로메타민 | Tromethamine (Tris) | (HOCH₂)₃CNH₂ | 121.14 | 77-86-1 | BUFFER_COMPONENT |
| 붕사 | Borax | Na₂B₄O₇·10H₂O | 381.37 | 1303-96-4 | BUFFER_COMPONENT |

## 📖 개발 명령어

### Server

```bash
npm run dev              # 개발 모드 (watch 모드)
npm run start            # 프로덕션 모드
npm run db:push          # DB 스키마 동기화
npm run db:seed          # 시드 데이터 삽입
npm run db:reset         # DB 초기화 및 시드 재삽입
npm run prisma:studio    # Prisma Studio 실행 (DB GUI)
```

### Client

```bash
npm run dev              # 개발 서버 (Vite)
npm run build            # 프로덕션 빌드
npm run preview          # 빌드 결과 미리보기
```

## 🔧 프로젝트 구조

```
claude-bs-ch-pjt/
├── server/
│   ├── src/
│   │   └── index.js          # Express 메인 서버
│   ├── prisma/
│   │   ├── schema.prisma      # 데이터 모델 정의
│   │   └── seed.js            # 시드 데이터 스크립트
│   ├── package.json
│   └── README.md
│
├── client/
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   ├── utils/             # 계산 유틸리티
│   │   ├── main.jsx           # React 진입점
│   │   ├── App.jsx            # 메인 컴포넌트
│   │   └── index.css          # 스타일
│   ├── index.html             # HTML 진입점
│   ├── vite.config.js         # Vite 설정
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## 📱 주요 기능

### 1. 농도/묽힘 계산기
- **고체 시약 → 용액 제조**: 분자량, 수화물, 순도를 고려한 칭량 계산
- **원액 → 희석**: C1V1 = C2V2 공식을 이용한 희석액 계산
- 유효숫자 관리 및 단계별 계산 과정 표시

### 2. 완충용액 계산기
- Henderson-Hasselbalch 방정식을 이용한 pH 계산
- 프리셋 완충계 또는 수동 입력
- 산과 염기의 필요 질량 계산

### 3. 표정/통계 계산기
- 표준화 실험 데이터 관리
- 평균, 표준편차, 상대표준편차(RSD) 자동 계산
- Q-test를 이용한 이상값 검출

### 4. 시약 DB 관리
- 10가지 기본 시약 프리셋
- REST API를 통한 시약 정보 조회 및 관리
- 시약 카테고리별 분류

## ✅ 완료된 항목

- ✅ React + Vite, Express + Prisma 모노레포 구조
- ✅ Prisma 스키마 정의 (5개 모델)
- ✅ 시드 데이터 스크립트 (10종 시약 + 초산/초산나트륨 완충계)
- ✅ Reagent CRUD API 구현
- ✅ React 클라이언트 API 연동
- ✅ 고체 시약 → 용액 계산기
- ✅ 원액 → 희석 계산기
- ✅ 완충용액 계산기
- ✅ 표정/통계 계산기

## 📝 다음 단계

- [ ] 사용자 인증 및 권한 관리
- [ ] PostgreSQL 마이그레이션
- [ ] 데이터 내보내기 (CSV, PDF)
- [ ] 라벨 생성 및 인쇄 기능
- [ ] 모바일 앱 버전
- [ ] 다국어 지원 (영문, 중문 등)
- [ ] 고급 통계 분석 기능

## 📧 문의

교육용 프로젝트입니다. 문제가 발생하면 이슈를 생성해주세요.

---

**마지막 업데이트:** 2026년 7월 26일

**GitHub Repository:** https://github.com/iseungju100-ctrl/claude-bs-ch-pjt
