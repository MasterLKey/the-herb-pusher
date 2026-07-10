import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super_admin', 'editor', 'reviewer', 'compliance_reviewer', 'affiliate_manager', 'brand_partner');
  CREATE TYPE "public"."enum_ingredients_common_uses_evidence_level" AS ENUM('strong', 'moderate', 'early', 'traditional', 'hype');
  CREATE TYPE "public"."enum_ingredients_cautions_severity" AS ENUM('info', 'caution', 'warning');
  CREATE TYPE "public"."enum_ingredients_product_types" AS ENUM('capsules', 'tablets', 'powder', 'gummies', 'liquid', 'tea', 'spray', 'patch');
  CREATE TYPE "public"."enum_ingredients_category" AS ENUM('vitamin', 'mineral', 'herb', 'amino_acid', 'fatty_acid', 'probiotic', 'mushroom', 'other');
  CREATE TYPE "public"."enum_ingredients_evidence_rating" AS ENUM('strong', 'moderate', 'early', 'traditional', 'hype');
  CREATE TYPE "public"."enum_ingredients_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ingredients_v_version_common_uses_evidence_level" AS ENUM('strong', 'moderate', 'early', 'traditional', 'hype');
  CREATE TYPE "public"."enum__ingredients_v_version_cautions_severity" AS ENUM('info', 'caution', 'warning');
  CREATE TYPE "public"."enum__ingredients_v_version_product_types" AS ENUM('capsules', 'tablets', 'powder', 'gummies', 'liquid', 'tea', 'spray', 'patch');
  CREATE TYPE "public"."enum__ingredients_v_version_category" AS ENUM('vitamin', 'mineral', 'herb', 'amino_acid', 'fatty_acid', 'probiotic', 'mushroom', 'other');
  CREATE TYPE "public"."enum__ingredients_v_version_evidence_rating" AS ENUM('strong', 'moderate', 'early', 'traditional', 'hype');
  CREATE TYPE "public"."enum__ingredients_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_products_category" AS ENUM('vitamin', 'mineral', 'herb', 'amino_acid', 'omega', 'probiotic', 'mushroom', 'multivitamin', 'protein', 'other');
  CREATE TYPE "public"."enum_products_format" AS ENUM('capsule', 'tablet', 'softgel', 'gummy', 'powder', 'liquid', 'spray', 'patch', 'tea', 'other');
  CREATE TYPE "public"."enum_products_vegan" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_products_vegetarian" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_products_gluten_free" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_products_sugar_free" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_products_third_party_tested" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'live', 'hidden');
  CREATE TYPE "public"."enum_retailers_affiliate_program" AS ENUM('amazon', 'awin', 'partnerize', 'direct', 'none');
  CREATE TYPE "public"."enum_claims_country_applicability" AS ENUM('gb', 'eu', 'us', 'other');
  CREATE TYPE "public"."enum_claims_evidence_level" AS ENUM('strong', 'moderate', 'early', 'traditional');
  CREATE TYPE "public"."enum_claims_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_evidence_sources_type" AS ENUM('meta_analysis', 'rct', 'observational', 'guideline', 'review', 'case_study');
  CREATE TYPE "public"."enum_evidence_sources_quality_score" AS ENUM('high', 'moderate', 'low');
  CREATE TYPE "public"."enum_wellness_goals_icon" AS ENUM('sleep', 'energy', 'focus', 'immune', 'gut', 'bone', 'muscle', 'skin', 'stress', 'wellbeing');
  CREATE TYPE "public"."enum_articles_type" AS ENUM('buying_guide', 'comparison', 'goal_guide', 'myth_busting', 'explainer', 'news');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_type" AS ENUM('buying_guide', 'comparison', 'goal_guide', 'myth_busting', 'explainer', 'news');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_newsletter_subscribers_source" AS ENUM('homepage', 'ingredient', 'guide', 'goal', 'product', 'other');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "ingredients_common_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"use" varchar,
  	"evidence_level" "enum_ingredients_common_uses_evidence_level"
  );
  
  CREATE TABLE "ingredients_approved_claims" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"claim" varchar,
  	"claim_id" varchar
  );
  
  CREATE TABLE "ingredients_cautions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caution" varchar,
  	"severity" "enum_ingredients_cautions_severity"
  );
  
  CREATE TABLE "ingredients_food_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" varchar,
  	"notes" varchar
  );
  
  CREATE TABLE "ingredients_product_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_ingredients_product_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "ingredients_common_forms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form" varchar,
  	"notes" varchar,
  	"recommended" boolean DEFAULT false
  );
  
  CREATE TABLE "ingredients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"category" "enum_ingredients_category",
  	"hero_image_id" integer,
  	"short_summary" varchar,
  	"overview" varchar,
  	"evidence_rating" "enum_ingredients_evidence_rating",
  	"evidence_summary" varchar,
  	"buying_guide" jsonb,
  	"status" "enum_ingredients_status" DEFAULT 'draft',
  	"last_reviewed" timestamp(3) with time zone,
  	"reviewed_by" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_ingredients_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "ingredients_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"evidence_sources_id" integer,
  	"ingredients_id" integer,
  	"wellness_goals_id" integer
  );
  
  CREATE TABLE "_ingredients_v_version_common_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"use" varchar,
  	"evidence_level" "enum__ingredients_v_version_common_uses_evidence_level",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ingredients_v_version_approved_claims" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"claim" varchar,
  	"claim_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ingredients_v_version_cautions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caution" varchar,
  	"severity" "enum__ingredients_v_version_cautions_severity",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ingredients_v_version_food_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar,
  	"notes" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ingredients_v_version_product_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__ingredients_v_version_product_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_ingredients_v_version_common_forms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form" varchar,
  	"notes" varchar,
  	"recommended" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ingredients_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__ingredients_v_version_category",
  	"version_hero_image_id" integer,
  	"version_short_summary" varchar,
  	"version_overview" varchar,
  	"version_evidence_rating" "enum__ingredients_v_version_evidence_rating",
  	"version_evidence_summary" varchar,
  	"version_buying_guide" jsonb,
  	"version_status" "enum__ingredients_v_version_status" DEFAULT 'draft',
  	"version_last_reviewed" timestamp(3) with time zone,
  	"version_reviewed_by" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__ingredients_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_ingredients_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"evidence_sources_id" integer,
  	"ingredients_id" integer,
  	"wellness_goals_id" integer
  );
  
  CREATE TABLE "products_pros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pro" varchar NOT NULL
  );
  
  CREATE TABLE "products_cons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"con" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"image_id" integer,
  	"brand_id" integer NOT NULL,
  	"category" "enum_products_category",
  	"short_description" varchar,
  	"format" "enum_products_format",
  	"dose_per_serving" varchar,
  	"servings_per_container" numeric,
  	"price" numeric,
  	"price_per_serving" numeric,
  	"vegan" "enum_products_vegan",
  	"vegetarian" "enum_products_vegetarian",
  	"gluten_free" "enum_products_gluten_free",
  	"sugar_free" "enum_products_sugar_free",
  	"third_party_tested" "enum_products_third_party_tested",
  	"allergen_notes" varchar,
  	"who_it_may_suit" varchar,
  	"who_should_be_cautious" varchar,
  	"editorial_rating" numeric,
  	"sponsored" boolean DEFAULT false,
  	"status" "enum_products_status" DEFAULT 'draft' NOT NULL,
  	"last_reviewed" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ingredients_id" integer
  );
  
  CREATE TABLE "brands_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"description" varchar,
  	"website" varchar,
  	"verified" boolean DEFAULT false,
  	"verified_until" timestamp(3) with time zone,
  	"manufacturing_location" varchar,
  	"sustainability_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "retailers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"base_url" varchar NOT NULL,
  	"affiliate_program" "enum_retailers_affiliate_program",
  	"tracking_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "affiliate_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"retailer_id" integer NOT NULL,
  	"url" varchar NOT NULL,
  	"price" numeric,
  	"last_checked" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "claims_country_applicability" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_claims_country_applicability",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "claims" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ingredient_id" integer NOT NULL,
  	"claim_text" varchar NOT NULL,
  	"source" varchar,
  	"evidence_level" "enum_claims_evidence_level",
  	"authorised_claim" boolean DEFAULT false,
  	"claim_register_id" varchar,
  	"status" "enum_claims_status" DEFAULT 'pending' NOT NULL,
  	"reviewer_name" varchar,
  	"approved_date" timestamp(3) with time zone,
  	"rejection_reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "evidence_sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar,
  	"doi" varchar,
  	"type" "enum_evidence_sources_type" NOT NULL,
  	"year" numeric,
  	"quality_score" "enum_evidence_sources_quality_score",
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wellness_goals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" "enum_wellness_goals_icon",
  	"short_description" varchar NOT NULL,
  	"description" varchar,
  	"lifestyle_notes" varchar,
  	"safety_warning" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wellness_goals_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ingredients_id" integer,
  	"products_id" integer,
  	"articles_id" integer
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"type" "enum_articles_type",
  	"hero_image_id" integer,
  	"excerpt" varchar,
  	"content" jsonb,
  	"author" varchar,
  	"reviewed_by" varchar,
  	"sponsored" boolean DEFAULT false,
  	"sponsor_name" varchar,
  	"status" "enum_articles_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ingredients_id" integer,
  	"products_id" integer,
  	"wellness_goals_id" integer
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__articles_v_version_type",
  	"version_hero_image_id" integer,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_author" varchar,
  	"version_reviewed_by" varchar,
  	"version_sponsored" boolean DEFAULT false,
  	"version_sponsor_name" varchar,
  	"version_status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_last_reviewed" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ingredients_id" integer,
  	"products_id" integer,
  	"wellness_goals_id" integer
  );
  
  CREATE TABLE "newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"subscribed_at" timestamp(3) with time zone,
  	"source" "enum_newsletter_subscribers_source",
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"ingredients_id" integer,
  	"products_id" integer,
  	"brands_id" integer,
  	"retailers_id" integer,
  	"affiliate_links_id" integer,
  	"claims_id" integer,
  	"evidence_sources_id" integer,
  	"wellness_goals_id" integer,
  	"articles_id" integer,
  	"newsletter_subscribers_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_common_uses" ADD CONSTRAINT "ingredients_common_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_approved_claims" ADD CONSTRAINT "ingredients_approved_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_cautions" ADD CONSTRAINT "ingredients_cautions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_food_sources" ADD CONSTRAINT "ingredients_food_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_product_types" ADD CONSTRAINT "ingredients_product_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_common_forms" ADD CONSTRAINT "ingredients_common_forms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ingredients_rels" ADD CONSTRAINT "ingredients_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_rels" ADD CONSTRAINT "ingredients_rels_evidence_sources_fk" FOREIGN KEY ("evidence_sources_id") REFERENCES "public"."evidence_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_rels" ADD CONSTRAINT "ingredients_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ingredients_rels" ADD CONSTRAINT "ingredients_rels_wellness_goals_fk" FOREIGN KEY ("wellness_goals_id") REFERENCES "public"."wellness_goals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_version_common_uses" ADD CONSTRAINT "_ingredients_v_version_common_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ingredients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_version_approved_claims" ADD CONSTRAINT "_ingredients_v_version_approved_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ingredients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_version_cautions" ADD CONSTRAINT "_ingredients_v_version_cautions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ingredients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_version_food_sources" ADD CONSTRAINT "_ingredients_v_version_food_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ingredients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_version_product_types" ADD CONSTRAINT "_ingredients_v_version_product_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_ingredients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_version_common_forms" ADD CONSTRAINT "_ingredients_v_version_common_forms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ingredients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v" ADD CONSTRAINT "_ingredients_v_parent_id_ingredients_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ingredients_v" ADD CONSTRAINT "_ingredients_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ingredients_v" ADD CONSTRAINT "_ingredients_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ingredients_v_rels" ADD CONSTRAINT "_ingredients_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_ingredients_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_rels" ADD CONSTRAINT "_ingredients_v_rels_evidence_sources_fk" FOREIGN KEY ("evidence_sources_id") REFERENCES "public"."evidence_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_rels" ADD CONSTRAINT "_ingredients_v_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ingredients_v_rels" ADD CONSTRAINT "_ingredients_v_rels_wellness_goals_fk" FOREIGN KEY ("wellness_goals_id") REFERENCES "public"."wellness_goals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_pros" ADD CONSTRAINT "products_pros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_cons" ADD CONSTRAINT "products_cons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_certifications" ADD CONSTRAINT "brands_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "retailers" ADD CONSTRAINT "retailers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_retailer_id_retailers_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."retailers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "claims_country_applicability" ADD CONSTRAINT "claims_country_applicability_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "claims" ADD CONSTRAINT "claims_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wellness_goals" ADD CONSTRAINT "wellness_goals_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wellness_goals_rels" ADD CONSTRAINT "wellness_goals_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wellness_goals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wellness_goals_rels" ADD CONSTRAINT "wellness_goals_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wellness_goals_rels" ADD CONSTRAINT "wellness_goals_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wellness_goals_rels" ADD CONSTRAINT "wellness_goals_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_wellness_goals_fk" FOREIGN KEY ("wellness_goals_id") REFERENCES "public"."wellness_goals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_wellness_goals_fk" FOREIGN KEY ("wellness_goals_id") REFERENCES "public"."wellness_goals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ingredients_fk" FOREIGN KEY ("ingredients_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_retailers_fk" FOREIGN KEY ("retailers_id") REFERENCES "public"."retailers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_affiliate_links_fk" FOREIGN KEY ("affiliate_links_id") REFERENCES "public"."affiliate_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_claims_fk" FOREIGN KEY ("claims_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_evidence_sources_fk" FOREIGN KEY ("evidence_sources_id") REFERENCES "public"."evidence_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wellness_goals_fk" FOREIGN KEY ("wellness_goals_id") REFERENCES "public"."wellness_goals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "ingredients_common_uses_order_idx" ON "ingredients_common_uses" USING btree ("_order");
  CREATE INDEX "ingredients_common_uses_parent_id_idx" ON "ingredients_common_uses" USING btree ("_parent_id");
  CREATE INDEX "ingredients_approved_claims_order_idx" ON "ingredients_approved_claims" USING btree ("_order");
  CREATE INDEX "ingredients_approved_claims_parent_id_idx" ON "ingredients_approved_claims" USING btree ("_parent_id");
  CREATE INDEX "ingredients_cautions_order_idx" ON "ingredients_cautions" USING btree ("_order");
  CREATE INDEX "ingredients_cautions_parent_id_idx" ON "ingredients_cautions" USING btree ("_parent_id");
  CREATE INDEX "ingredients_food_sources_order_idx" ON "ingredients_food_sources" USING btree ("_order");
  CREATE INDEX "ingredients_food_sources_parent_id_idx" ON "ingredients_food_sources" USING btree ("_parent_id");
  CREATE INDEX "ingredients_product_types_order_idx" ON "ingredients_product_types" USING btree ("order");
  CREATE INDEX "ingredients_product_types_parent_idx" ON "ingredients_product_types" USING btree ("parent_id");
  CREATE INDEX "ingredients_common_forms_order_idx" ON "ingredients_common_forms" USING btree ("_order");
  CREATE INDEX "ingredients_common_forms_parent_id_idx" ON "ingredients_common_forms" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ingredients_slug_idx" ON "ingredients" USING btree ("slug");
  CREATE INDEX "ingredients_hero_image_idx" ON "ingredients" USING btree ("hero_image_id");
  CREATE INDEX "ingredients_seo_seo_og_image_idx" ON "ingredients" USING btree ("seo_og_image_id");
  CREATE INDEX "ingredients_updated_at_idx" ON "ingredients" USING btree ("updated_at");
  CREATE INDEX "ingredients_created_at_idx" ON "ingredients" USING btree ("created_at");
  CREATE INDEX "ingredients__status_idx" ON "ingredients" USING btree ("_status");
  CREATE INDEX "ingredients_rels_order_idx" ON "ingredients_rels" USING btree ("order");
  CREATE INDEX "ingredients_rels_parent_idx" ON "ingredients_rels" USING btree ("parent_id");
  CREATE INDEX "ingredients_rels_path_idx" ON "ingredients_rels" USING btree ("path");
  CREATE INDEX "ingredients_rels_evidence_sources_id_idx" ON "ingredients_rels" USING btree ("evidence_sources_id");
  CREATE INDEX "ingredients_rels_ingredients_id_idx" ON "ingredients_rels" USING btree ("ingredients_id");
  CREATE INDEX "ingredients_rels_wellness_goals_id_idx" ON "ingredients_rels" USING btree ("wellness_goals_id");
  CREATE INDEX "_ingredients_v_version_common_uses_order_idx" ON "_ingredients_v_version_common_uses" USING btree ("_order");
  CREATE INDEX "_ingredients_v_version_common_uses_parent_id_idx" ON "_ingredients_v_version_common_uses" USING btree ("_parent_id");
  CREATE INDEX "_ingredients_v_version_approved_claims_order_idx" ON "_ingredients_v_version_approved_claims" USING btree ("_order");
  CREATE INDEX "_ingredients_v_version_approved_claims_parent_id_idx" ON "_ingredients_v_version_approved_claims" USING btree ("_parent_id");
  CREATE INDEX "_ingredients_v_version_cautions_order_idx" ON "_ingredients_v_version_cautions" USING btree ("_order");
  CREATE INDEX "_ingredients_v_version_cautions_parent_id_idx" ON "_ingredients_v_version_cautions" USING btree ("_parent_id");
  CREATE INDEX "_ingredients_v_version_food_sources_order_idx" ON "_ingredients_v_version_food_sources" USING btree ("_order");
  CREATE INDEX "_ingredients_v_version_food_sources_parent_id_idx" ON "_ingredients_v_version_food_sources" USING btree ("_parent_id");
  CREATE INDEX "_ingredients_v_version_product_types_order_idx" ON "_ingredients_v_version_product_types" USING btree ("order");
  CREATE INDEX "_ingredients_v_version_product_types_parent_idx" ON "_ingredients_v_version_product_types" USING btree ("parent_id");
  CREATE INDEX "_ingredients_v_version_common_forms_order_idx" ON "_ingredients_v_version_common_forms" USING btree ("_order");
  CREATE INDEX "_ingredients_v_version_common_forms_parent_id_idx" ON "_ingredients_v_version_common_forms" USING btree ("_parent_id");
  CREATE INDEX "_ingredients_v_parent_idx" ON "_ingredients_v" USING btree ("parent_id");
  CREATE INDEX "_ingredients_v_version_version_slug_idx" ON "_ingredients_v" USING btree ("version_slug");
  CREATE INDEX "_ingredients_v_version_version_hero_image_idx" ON "_ingredients_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_ingredients_v_version_seo_version_seo_og_image_idx" ON "_ingredients_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_ingredients_v_version_version_updated_at_idx" ON "_ingredients_v" USING btree ("version_updated_at");
  CREATE INDEX "_ingredients_v_version_version_created_at_idx" ON "_ingredients_v" USING btree ("version_created_at");
  CREATE INDEX "_ingredients_v_version_version__status_idx" ON "_ingredients_v" USING btree ("version__status");
  CREATE INDEX "_ingredients_v_created_at_idx" ON "_ingredients_v" USING btree ("created_at");
  CREATE INDEX "_ingredients_v_updated_at_idx" ON "_ingredients_v" USING btree ("updated_at");
  CREATE INDEX "_ingredients_v_latest_idx" ON "_ingredients_v" USING btree ("latest");
  CREATE INDEX "_ingredients_v_rels_order_idx" ON "_ingredients_v_rels" USING btree ("order");
  CREATE INDEX "_ingredients_v_rels_parent_idx" ON "_ingredients_v_rels" USING btree ("parent_id");
  CREATE INDEX "_ingredients_v_rels_path_idx" ON "_ingredients_v_rels" USING btree ("path");
  CREATE INDEX "_ingredients_v_rels_evidence_sources_id_idx" ON "_ingredients_v_rels" USING btree ("evidence_sources_id");
  CREATE INDEX "_ingredients_v_rels_ingredients_id_idx" ON "_ingredients_v_rels" USING btree ("ingredients_id");
  CREATE INDEX "_ingredients_v_rels_wellness_goals_id_idx" ON "_ingredients_v_rels" USING btree ("wellness_goals_id");
  CREATE INDEX "products_pros_order_idx" ON "products_pros" USING btree ("_order");
  CREATE INDEX "products_pros_parent_id_idx" ON "products_pros" USING btree ("_parent_id");
  CREATE INDEX "products_cons_order_idx" ON "products_cons" USING btree ("_order");
  CREATE INDEX "products_cons_parent_id_idx" ON "products_cons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");
  CREATE INDEX "products_seo_seo_og_image_idx" ON "products" USING btree ("seo_og_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_ingredients_id_idx" ON "products_rels" USING btree ("ingredients_id");
  CREATE INDEX "brands_certifications_order_idx" ON "brands_certifications" USING btree ("_order");
  CREATE INDEX "brands_certifications_parent_id_idx" ON "brands_certifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "retailers_logo_idx" ON "retailers" USING btree ("logo_id");
  CREATE INDEX "retailers_updated_at_idx" ON "retailers" USING btree ("updated_at");
  CREATE INDEX "retailers_created_at_idx" ON "retailers" USING btree ("created_at");
  CREATE INDEX "affiliate_links_product_idx" ON "affiliate_links" USING btree ("product_id");
  CREATE INDEX "affiliate_links_retailer_idx" ON "affiliate_links" USING btree ("retailer_id");
  CREATE INDEX "affiliate_links_updated_at_idx" ON "affiliate_links" USING btree ("updated_at");
  CREATE INDEX "affiliate_links_created_at_idx" ON "affiliate_links" USING btree ("created_at");
  CREATE INDEX "claims_country_applicability_order_idx" ON "claims_country_applicability" USING btree ("order");
  CREATE INDEX "claims_country_applicability_parent_idx" ON "claims_country_applicability" USING btree ("parent_id");
  CREATE INDEX "claims_ingredient_idx" ON "claims" USING btree ("ingredient_id");
  CREATE INDEX "claims_updated_at_idx" ON "claims" USING btree ("updated_at");
  CREATE INDEX "claims_created_at_idx" ON "claims" USING btree ("created_at");
  CREATE INDEX "evidence_sources_updated_at_idx" ON "evidence_sources" USING btree ("updated_at");
  CREATE INDEX "evidence_sources_created_at_idx" ON "evidence_sources" USING btree ("created_at");
  CREATE UNIQUE INDEX "wellness_goals_slug_idx" ON "wellness_goals" USING btree ("slug");
  CREATE INDEX "wellness_goals_seo_seo_og_image_idx" ON "wellness_goals" USING btree ("seo_og_image_id");
  CREATE INDEX "wellness_goals_updated_at_idx" ON "wellness_goals" USING btree ("updated_at");
  CREATE INDEX "wellness_goals_created_at_idx" ON "wellness_goals" USING btree ("created_at");
  CREATE INDEX "wellness_goals_rels_order_idx" ON "wellness_goals_rels" USING btree ("order");
  CREATE INDEX "wellness_goals_rels_parent_idx" ON "wellness_goals_rels" USING btree ("parent_id");
  CREATE INDEX "wellness_goals_rels_path_idx" ON "wellness_goals_rels" USING btree ("path");
  CREATE INDEX "wellness_goals_rels_ingredients_id_idx" ON "wellness_goals_rels" USING btree ("ingredients_id");
  CREATE INDEX "wellness_goals_rels_products_id_idx" ON "wellness_goals_rels" USING btree ("products_id");
  CREATE INDEX "wellness_goals_rels_articles_id_idx" ON "wellness_goals_rels" USING btree ("articles_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE INDEX "articles_seo_seo_og_image_idx" ON "articles" USING btree ("seo_og_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_ingredients_id_idx" ON "articles_rels" USING btree ("ingredients_id");
  CREATE INDEX "articles_rels_products_id_idx" ON "articles_rels" USING btree ("products_id");
  CREATE INDEX "articles_rels_wellness_goals_id_idx" ON "articles_rels" USING btree ("wellness_goals_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_articles_v_version_seo_version_seo_og_image_idx" ON "_articles_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_ingredients_id_idx" ON "_articles_v_rels" USING btree ("ingredients_id");
  CREATE INDEX "_articles_v_rels_products_id_idx" ON "_articles_v_rels" USING btree ("products_id");
  CREATE INDEX "_articles_v_rels_wellness_goals_id_idx" ON "_articles_v_rels" USING btree ("wellness_goals_id");
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_ingredients_id_idx" ON "payload_locked_documents_rels" USING btree ("ingredients_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_retailers_id_idx" ON "payload_locked_documents_rels" USING btree ("retailers_id");
  CREATE INDEX "payload_locked_documents_rels_affiliate_links_id_idx" ON "payload_locked_documents_rels" USING btree ("affiliate_links_id");
  CREATE INDEX "payload_locked_documents_rels_claims_id_idx" ON "payload_locked_documents_rels" USING btree ("claims_id");
  CREATE INDEX "payload_locked_documents_rels_evidence_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("evidence_sources_id");
  CREATE INDEX "payload_locked_documents_rels_wellness_goals_id_idx" ON "payload_locked_documents_rels" USING btree ("wellness_goals_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "ingredients_common_uses" CASCADE;
  DROP TABLE "ingredients_approved_claims" CASCADE;
  DROP TABLE "ingredients_cautions" CASCADE;
  DROP TABLE "ingredients_food_sources" CASCADE;
  DROP TABLE "ingredients_product_types" CASCADE;
  DROP TABLE "ingredients_common_forms" CASCADE;
  DROP TABLE "ingredients" CASCADE;
  DROP TABLE "ingredients_rels" CASCADE;
  DROP TABLE "_ingredients_v_version_common_uses" CASCADE;
  DROP TABLE "_ingredients_v_version_approved_claims" CASCADE;
  DROP TABLE "_ingredients_v_version_cautions" CASCADE;
  DROP TABLE "_ingredients_v_version_food_sources" CASCADE;
  DROP TABLE "_ingredients_v_version_product_types" CASCADE;
  DROP TABLE "_ingredients_v_version_common_forms" CASCADE;
  DROP TABLE "_ingredients_v" CASCADE;
  DROP TABLE "_ingredients_v_rels" CASCADE;
  DROP TABLE "products_pros" CASCADE;
  DROP TABLE "products_cons" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "brands_certifications" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "retailers" CASCADE;
  DROP TABLE "affiliate_links" CASCADE;
  DROP TABLE "claims_country_applicability" CASCADE;
  DROP TABLE "claims" CASCADE;
  DROP TABLE "evidence_sources" CASCADE;
  DROP TABLE "wellness_goals" CASCADE;
  DROP TABLE "wellness_goals_rels" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "newsletter_subscribers" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_ingredients_common_uses_evidence_level";
  DROP TYPE "public"."enum_ingredients_cautions_severity";
  DROP TYPE "public"."enum_ingredients_product_types";
  DROP TYPE "public"."enum_ingredients_category";
  DROP TYPE "public"."enum_ingredients_evidence_rating";
  DROP TYPE "public"."enum_ingredients_status";
  DROP TYPE "public"."enum__ingredients_v_version_common_uses_evidence_level";
  DROP TYPE "public"."enum__ingredients_v_version_cautions_severity";
  DROP TYPE "public"."enum__ingredients_v_version_product_types";
  DROP TYPE "public"."enum__ingredients_v_version_category";
  DROP TYPE "public"."enum__ingredients_v_version_evidence_rating";
  DROP TYPE "public"."enum__ingredients_v_version_status";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum_products_format";
  DROP TYPE "public"."enum_products_vegan";
  DROP TYPE "public"."enum_products_vegetarian";
  DROP TYPE "public"."enum_products_gluten_free";
  DROP TYPE "public"."enum_products_sugar_free";
  DROP TYPE "public"."enum_products_third_party_tested";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_retailers_affiliate_program";
  DROP TYPE "public"."enum_claims_country_applicability";
  DROP TYPE "public"."enum_claims_evidence_level";
  DROP TYPE "public"."enum_claims_status";
  DROP TYPE "public"."enum_evidence_sources_type";
  DROP TYPE "public"."enum_evidence_sources_quality_score";
  DROP TYPE "public"."enum_wellness_goals_icon";
  DROP TYPE "public"."enum_articles_type";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_type";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_newsletter_subscribers_source";`)
}
