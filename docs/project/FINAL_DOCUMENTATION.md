# SlabPulse — Final Documentation

## Özet

SlabPulse, doğal taş ve mermer işleme atölyeleri için operasyon SaaS platformudur. NestJS + Prisma + PostgreSQL backend ve Next.js + Tailwind frontend ile geliştirilmiştir.

## Demo

- E-posta: demo@istanbultasatolyesi.com
- Şifre: demo123456

## Artefakt Konumu

`project-artifacts/slabpulse/`

## Kuyruk

`projects/project-queue/slabpulse.json`

## API Modülleri

| Modül | Endpoint | Açıklama |
|-------|----------|----------|
| Projects | /api/projects | Taş projeleri |
| Slabs | /api/slabs | Levha stok |
| Surveys | /api/surveys | Saha ölçümleri |
| CNC Tasks | /api/cnc-tasks | CNC görevleri |
| Finishes | /api/finishes | Yüzey işleme kataloğu |

## Tasarım

Brutalist Mineral — Playfair Display + Source Sans 3, copper #B87333, sağ sidebar navigasyon.

## Deploy

PR merge → provision-new-project.yml → gorkemkyolai0666/slabpulse → CI provision → demo doğrulama.
