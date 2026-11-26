ALTER TABLE "md_user" DROP CONSTRAINT "md_user_email_unique";--> statement-breakpoint
ALTER TABLE "md_user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "md_user" ALTER COLUMN "image_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "md_user" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "md_user" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "md_user_email_active_uq" ON "md_user" USING btree ("email") WHERE "md_user"."deleted_at" is null;--> statement-breakpoint
ALTER TABLE "md_user" DROP COLUMN "phone";