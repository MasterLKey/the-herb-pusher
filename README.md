# The Herb Pusher

> Supplements explained without the nonsense.

A modern supplement discovery website — ingredient database, product comparisons, evidence ratings and buying guides. Built with Next.js 16 + Payload CMS v3.

## Stack

- **Framework**: Next.js 16 + Payload CMS v3 (admin at `/admin`, REST API at `/api`)
- **Database**: PostgreSQL 16
- **Search**: Meilisearch
- **Media**: Cloudflare R2
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Monorepo**: Turborepo + pnpm
- **Secrets**: Infisical

## Local development

### Prerequisites

- Node 20+
- pnpm
- Docker Desktop
- Infisical CLI (logged in)
- Set `INFISICAL_PROJECT_ID` in your shell

### Start

```powershell
.\start.ps1
```

App: http://localhost:3000  
Admin: http://localhost:3000/admin

### Stop

```powershell
.\stop.ps1
```

## Home lab deployment (Proxmox LXC)

1. `cd terraform && terraform init && terraform apply`
2. Find the container IP in Proxmox web UI
3. `scp -i ~/.ssh/octo_scrape_deploy scripts/provision.sh root@<ip>:/root/provision.sh`
4. `ssh -i ~/.ssh/octo_scrape_deploy root@<ip> "bash /root/provision.sh"`
5. Edit `/etc/herb-pusher.env` on the container (add Infisical token + project ID)
6. Edit `/opt/the_herb_pusher/.env` (add non-secret config from `.env.example`)
7. `bash /opt/the_herb_pusher/start.sh`
8. Set up Cloudflare Tunnel to expose port 3000

## Cloud migration (after validation)

1. Connect Vercel to this GitHub repo
2. `pg_dump` local PostgreSQL → restore to Neon, update `DATABASE_URI`
3. Update `MEILISEARCH_HOST` to Meilisearch Cloud or keep on home lab
4. Point Cloudflare DNS at Vercel

## Environment variables

See `.env.example`. Secrets are managed via Infisical — never committed.

## Collections (Payload admin)

- **Ingredients** — evidence ratings, cautions, food sources, buying guides
- **Products** — pricing, format, vegan/tested status, pros/cons
- **Brands** — verified profiles
- **Retailers** — affiliate programme details
- **Affiliate Links** — per-retailer tracked URLs
- **Claims** — compliance approval workflow
- **Evidence Sources** — research references
- **Wellness Goals** — ingredient groups by wellness intent
- **Articles** — buying guides, comparisons, explainers
- **Newsletter Subscribers** — email list

## Compliance

Every ingredient follows the status flow:
`draft → evidence_review → compliance_review → published → review_due`

Only authorised health claims from the GB register may be published. See `src/collections/Claims.ts`.
