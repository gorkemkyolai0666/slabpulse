-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'technician');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('quoted', 'templating', 'cutting', 'polishing', 'edge_work', 'installation', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('countertop', 'flooring', 'facade', 'vanity', 'stair', 'custom');

-- CreateEnum
CREATE TYPE "SlabStatus" AS ENUM ('in_stock', 'reserved', 'low', 'out_of_stock');

-- CreateEnum
CREATE TYPE "SlabUnit" AS ENUM ('slab', 'block', 'tile', 'remnant');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('scheduled', 'completed', 'revision', 'approved', 'cancelled');

-- CreateEnum
CREATE TYPE "SurveyQuality" AS ENUM ('excellent', 'good', 'needs_review', 'rejected');

-- CreateEnum
CREATE TYPE "CncTaskStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "CncOperation" AS ENUM ('cutting', 'polishing', 'edge', 'cnc_bridge', 'other');

-- CreateEnum
CREATE TYPE "FinishCategory" AS ENUM ('polished', 'honed', 'leather', 'bush_hammered', 'flamed', 'other');

-- CreateEnum
CREATE TYPE "FinishStatus" AS ENUM ('active', 'seasonal', 'discontinued');

-- CreateTable
CREATE TABLE "firms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_machines" INTEGER NOT NULL DEFAULT 3,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "firms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "firm_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stone_projects" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "project_number" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "project_type" "ProjectType" NOT NULL DEFAULT 'countertop',
    "area_sqm" DOUBLE PRECISION,
    "status" "ProjectStatus" NOT NULL DEFAULT 'quoted',
    "due_date" DATE,
    "machine_name" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stone_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slab_inventories" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "project_id" TEXT,
    "slab_name" TEXT NOT NULL,
    "stone_type" TEXT,
    "quantity_sqm" DOUBLE PRECISION NOT NULL,
    "slab_unit" "SlabUnit" NOT NULL DEFAULT 'slab',
    "status" "SlabStatus" NOT NULL DEFAULT 'in_stock',
    "received_at" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slab_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_surveys" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "surveyed_at" TIMESTAMP(3) NOT NULL,
    "survey_quality" "SurveyQuality" NOT NULL DEFAULT 'good',
    "revision_notes" TEXT,
    "status" "SurveyStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnc_tasks" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "operation" "CncOperation" NOT NULL DEFAULT 'cutting',
    "machine_name" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "CncTaskStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cnc_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finish_catalogs" (
    "id" TEXT NOT NULL,
    "firm_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "finish_category" "FinishCategory" NOT NULL DEFAULT 'polished',
    "status" "FinishStatus" NOT NULL DEFAULT 'active',
    "price_per_sqm" DOUBLE PRECISION NOT NULL,
    "lead_days" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finish_catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "stone_projects_firm_id_status_idx" ON "stone_projects"("firm_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stone_projects_firm_id_project_number_key" ON "stone_projects"("firm_id", "project_number");

-- CreateIndex
CREATE INDEX "slab_inventories_firm_id_status_idx" ON "slab_inventories"("firm_id", "status");

-- CreateIndex
CREATE INDEX "site_surveys_firm_id_status_idx" ON "site_surveys"("firm_id", "status");

-- CreateIndex
CREATE INDEX "site_surveys_firm_id_surveyed_at_idx" ON "site_surveys"("firm_id", "surveyed_at");

-- CreateIndex
CREATE INDEX "cnc_tasks_firm_id_scheduled_at_idx" ON "cnc_tasks"("firm_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "finish_catalogs_firm_id_finish_category_idx" ON "finish_catalogs"("firm_id", "finish_category");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stone_projects" ADD CONSTRAINT "stone_projects_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slab_inventories" ADD CONSTRAINT "slab_inventories_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slab_inventories" ADD CONSTRAINT "slab_inventories_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "stone_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_surveys" ADD CONSTRAINT "site_surveys_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_surveys" ADD CONSTRAINT "site_surveys_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "stone_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnc_tasks" ADD CONSTRAINT "cnc_tasks_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finish_catalogs" ADD CONSTRAINT "finish_catalogs_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

