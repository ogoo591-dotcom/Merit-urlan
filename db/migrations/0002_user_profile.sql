CREATE TABLE "md_address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"district" text NOT NULL,
	"khoroo" text DEFAULT '' NOT NULL,
	"detail" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_address" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_person_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "md_person" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "md_address" ADD CONSTRAINT "md_address_person_id_md_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."md_person"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_person" ADD CONSTRAINT "md_person_user_id_md_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."md_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "md_address_person_id_index" ON "md_address" USING btree ("person_id");--> statement-breakpoint
CREATE UNIQUE INDEX "md_address_person_default_uq" ON "md_address" USING btree ("person_id") WHERE "md_address"."is_default";