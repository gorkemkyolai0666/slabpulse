# SlabPulse Architecture

## Genel Bakış

```
┌─────────────┐     HTTPS/CORS      ┌──────────────────┐
│  Next.js    │ ◄──────────────────►│  NestJS API      │
│  :3024      │   JWT Bearer         │  :4024           │
└─────────────┘                      └────────┬─────────┘
                                              │
                                     ┌────────▼─────────┐
                                     │  PostgreSQL 16   │
                                     └──────────────────┘
```

## Backend Modülleri

| Modül | Route | Açıklama |
|-------|-------|----------|
| HealthModule | GET /api/health | DB bağlantı kontrolü |
| AuthModule | /api/auth/* | JWT register/login/me |
| PrintshopModule | /api/printshop | Tenant profil |
| JobsModule | /api/jobs | RoofingJob CRUD |
| MembranesModule | /api/paper-stock | Kağıt stok CRUD |
| InspectionsModule | /api/proofs | RoofInspection CRUD |
| CrewsModule | /api/maintenance | Bakım CRUD |
| SystemsModule | /api/finishes | Bitirme CRUD |
| DashboardModule | /api/dashboard/stats | Aggregated stats |

## Multi-Tenancy

Her kayıt `firmId` ile tenant'a bağlı. JWT payload `{ sub, email, firmId }`.

## Frontend Yapısı

- App Router (Next.js 14)
- `AuthenticatedLayout` — split-panel + stats rail
- `api.ts` — typed fetch wrapper
- shadcn/ui primitives (Button, Input, Card, Badge)

## Domain Mapping (HivePulse → SlabPulse)

| HivePulse | SlabPulse |
|-----------|------------|
| Apiary | Firm |
| Hive | RoofingJob |
| Harvest | MembraneRoll |
| Inspection | RoofInspection |
| Treatment | CrewDispatch |
| HoneyVariety | WaterproofingSystem |
