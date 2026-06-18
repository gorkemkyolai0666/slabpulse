# SlabPulse API Reference

Base URL: `http://localhost:4024/api`

## Health

| Method | Path | Auth | Açıklama |
|--------|------|------|----------|
| GET | /health | No | `{ status, database, timestamp }` |

## Auth

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | /auth/register | No | email, password, firstName, lastName, firmName |
| POST | /auth/login | No | email, password |
| GET | /auth/me | Bearer | — |

## Print Shop

| Method | Path | Auth |
|--------|------|------|
| GET | /printshop | Bearer |
| PATCH | /printshop | Bearer |

## Jobs

| Method | Path | Auth |
|--------|------|------|
| GET | /jobs?page&status&clientName | Bearer |
| GET | /jobs/:id | Bearer |
| POST | /jobs | Bearer → 201 |
| PATCH | /jobs/:id | Bearer |
| DELETE | /jobs/:id | Bearer |

## Paper Stock

| Method | Path | Auth |
|--------|------|------|
| GET | /paper-stock | Bearer |
| POST | /paper-stock | Bearer → 201 |
| PATCH | /paper-stock/:id | Bearer |
| DELETE | /paper-stock/:id | Bearer |

## Proofs

| Method | Path | Auth |
|--------|------|------|
| GET | /proofs | Bearer |
| GET | /proofs/revision | Bearer |
| POST | /proofs | Bearer → 201 |
| PATCH | /proofs/:id | Bearer |
| DELETE | /proofs/:id | Bearer |

## Maintenance

| Method | Path | Auth |
|--------|------|------|
| GET | /maintenance | Bearer |
| POST | /maintenance | Bearer → 201 |
| PATCH | /maintenance/:id | Bearer |
| DELETE | /maintenance/:id | Bearer |

## Finishes

| Method | Path | Auth |
|--------|------|------|
| GET | /finishes | Bearer |
| POST | /finishes | Bearer → 201 |
| PATCH | /finishes/:id | Bearer |
| DELETE | /finishes/:id | Bearer |

## Dashboard

| Method | Path | Auth |
|--------|------|------|
| GET | /dashboard/stats | Bearer |

## CORS

`FRONTEND_URL` env (virgülle ayrılmış origin listesi). Default: `http://localhost:3024`.
