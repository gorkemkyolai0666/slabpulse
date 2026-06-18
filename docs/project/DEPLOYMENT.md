# SlabPulse Deployment

## Demo Hesabı

- **E-posta:** demo@istanbultasatolyesi.com
- **Şifre:** demo123456

## Ortam Değişkenleri

### Backend (`backend/.env.example`)

- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — Virgülle ayrılmış frontend origin listesi
- `PORT` — API portu (varsayılan 4024)

### Frontend (`frontend/.env.example`)

- `NEXT_PUBLIC_API_URL` — Backend API kök URL'si

## Sağlama

```bash
npm run provision
```

GitHub Actions `provision-new-project.yml` workflow'u `projects/project-queue/slabpulse.json` eklendiğinde tetiklenir ve `artifactPath` üzerinden MVP kod tabanını kopyalar.

## Beklenen Org Secrets

- `GH_PAT`
- `RAILWAY_API_TOKEN`
- `VERCEL_TOKEN`

## Smoke Testler

1. `GET /api/health` → 200
2. Demo login → 200 + token
3. `GET /api/dashboard/stats` → 200
4. CRUD `/api/projects` → 201/200/200

## Portlar

- Backend: 4024
- Frontend: 3024

## Durum

MVP hazır — CI sağlama bekleniyor (cloud agent org repo oluşturamaz).
