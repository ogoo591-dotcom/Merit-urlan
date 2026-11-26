CREATE TABLE "md_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text,
	"phone" text,
	"image_url" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "md_user" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_brand" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_brand_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "md_brand" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"type" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_category_type_parent_id_slug_unique" UNIQUE NULLS NOT DISTINCT("type","parent_id","slug")
);
--> statement-breakpoint
ALTER TABLE "md_category" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_color" (
	"key" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"hex" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_color" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_product" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"category_id" uuid NOT NULL,
	"brand_id" uuid,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"availability" text DEFAULT 'ready' NOT NULL,
	"lead_days" integer,
	"origin" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_product_price_check" CHECK (price >= 0),
	CONSTRAINT "md_product_stock_check" CHECK (stock >= 0)
);
--> statement-breakpoint
ALTER TABLE "md_product" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_product_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"path" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_product_image" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rl_product_color" (
	"product_id" text NOT NULL,
	"color_key" text NOT NULL,
	CONSTRAINT "rl_product_color_product_id_color_key_pk" PRIMARY KEY("product_id","color_key")
);
--> statement-breakpoint
ALTER TABLE "rl_product_color" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_course" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" integer NOT NULL,
	"cover_image" text NOT NULL,
	"level" text DEFAULT 'beginner' NOT NULL,
	"total_duration" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_course_price_check" CHECK (price >= 0)
);
--> statement-breakpoint
ALTER TABLE "md_course" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_course_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" text NOT NULL,
	"path" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_course_image" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_course_outcome" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" text NOT NULL,
	"content" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_course_outcome" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_course_topic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" text NOT NULL,
	"topic" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_course_topic" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_lesson" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"duration" text DEFAULT '' NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"video_url" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_lesson" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rl_course_material" (
	"course_id" text NOT NULL,
	"product_id" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rl_course_material_course_id_product_id_pk" PRIMARY KEY("course_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "rl_course_material" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_pattern" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"cover_image" text NOT NULL,
	"type" text NOT NULL,
	"level" text DEFAULT 'beginner' NOT NULL,
	"size" text DEFAULT '' NOT NULL,
	"source_language" text DEFAULT '' NOT NULL,
	"credit" text,
	"file_path" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_pattern_price_check" CHECK (price >= 0)
);
--> statement-breakpoint
ALTER TABLE "md_pattern" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_pattern_material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pattern_id" text NOT NULL,
	"name" text NOT NULL,
	"product_id" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_pattern_material" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_order" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "md_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1001 CACHE 1),
	"user_id" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"address_district" text NOT NULL,
	"address_khoroo" text DEFAULT '' NOT NULL,
	"address_detail" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"total" integer NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"ready_by" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_order_total_check" CHECK (total >= 0)
);
--> statement-breakpoint
ALTER TABLE "md_order" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" text,
	"name" text NOT NULL,
	"image" text,
	"price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"made_to_order" boolean DEFAULT false NOT NULL,
	"lead_days" integer,
	"options" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "md_order_item_price_check" CHECK (price >= 0),
	CONSTRAINT "md_order_item_quantity_check" CHECK (quantity > 0)
);
--> statement-breakpoint
ALTER TABLE "md_order_item" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" integer NOT NULL,
	"status" text NOT NULL,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"changed_by" text
);
--> statement-breakpoint
ALTER TABLE "md_order_status_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fin_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"user_id" text NOT NULL,
	"order_id" integer,
	"amount" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"provider" text DEFAULT 'bank_transfer' NOT NULL,
	"provider_invoice_id" text,
	"provider_payment_id" text,
	"paid_at" timestamp with time zone,
	"summary" text DEFAULT '' NOT NULL,
	"customer_name" text,
	"customer_phone" text,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fin_payment_code_unique" UNIQUE("code"),
	CONSTRAINT "fin_payment_provider_invoice_id_unique" UNIQUE("provider_invoice_id"),
	CONSTRAINT "fin_payment_amount_check" CHECK (amount >= 0)
);
--> statement-breakpoint
ALTER TABLE "fin_payment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rl_payment_course" (
	"payment_id" uuid NOT NULL,
	"course_id" text NOT NULL,
	"price" integer NOT NULL,
	CONSTRAINT "rl_payment_course_payment_id_course_id_pk" PRIMARY KEY("payment_id","course_id")
);
--> statement-breakpoint
ALTER TABLE "rl_payment_course" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rl_payment_pattern" (
	"payment_id" uuid NOT NULL,
	"pattern_id" text NOT NULL,
	"price" integer NOT NULL,
	CONSTRAINT "rl_payment_pattern_payment_id_pattern_id_pk" PRIMARY KEY("payment_id","pattern_id")
);
--> statement-breakpoint
ALTER TABLE "rl_payment_pattern" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rl_user_course" (
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"payment_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rl_user_course_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
ALTER TABLE "rl_user_course" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rl_user_pattern" (
	"user_id" text NOT NULL,
	"pattern_id" text NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"payment_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rl_user_pattern_user_id_pattern_id_pk" PRIMARY KEY("user_id","pattern_id")
);
--> statement-breakpoint
ALTER TABLE "rl_user_pattern" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "md_notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audience" text NOT NULL,
	"user_id" text,
	"message" text NOT NULL,
	"href" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "md_notification" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "md_category" ADD CONSTRAINT "md_category_parent_id_md_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."md_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_product" ADD CONSTRAINT "md_product_category_id_md_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."md_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_product" ADD CONSTRAINT "md_product_brand_id_md_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."md_brand"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_product_image" ADD CONSTRAINT "md_product_image_product_id_md_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."md_product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_product_color" ADD CONSTRAINT "rl_product_color_product_id_md_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."md_product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_product_color" ADD CONSTRAINT "rl_product_color_color_key_md_color_key_fk" FOREIGN KEY ("color_key") REFERENCES "public"."md_color"("key") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "md_course_image" ADD CONSTRAINT "md_course_image_course_id_md_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."md_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_course_outcome" ADD CONSTRAINT "md_course_outcome_course_id_md_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."md_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_course_topic" ADD CONSTRAINT "md_course_topic_course_id_md_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."md_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_lesson" ADD CONSTRAINT "md_lesson_course_id_md_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."md_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_course_material" ADD CONSTRAINT "rl_course_material_course_id_md_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."md_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_course_material" ADD CONSTRAINT "rl_course_material_product_id_md_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."md_product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_pattern_material" ADD CONSTRAINT "md_pattern_material_pattern_id_md_pattern_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."md_pattern"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_pattern_material" ADD CONSTRAINT "md_pattern_material_product_id_md_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."md_product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_order" ADD CONSTRAINT "md_order_user_id_md_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."md_user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_order_item" ADD CONSTRAINT "md_order_item_order_id_md_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."md_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_order_item" ADD CONSTRAINT "md_order_item_product_id_md_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."md_product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_order_status_history" ADD CONSTRAINT "md_order_status_history_order_id_md_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."md_order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fin_payment" ADD CONSTRAINT "fin_payment_user_id_md_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."md_user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fin_payment" ADD CONSTRAINT "fin_payment_order_id_md_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."md_order"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_payment_course" ADD CONSTRAINT "rl_payment_course_payment_id_fin_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."fin_payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_payment_course" ADD CONSTRAINT "rl_payment_course_course_id_md_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."md_course"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_payment_pattern" ADD CONSTRAINT "rl_payment_pattern_payment_id_fin_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."fin_payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_payment_pattern" ADD CONSTRAINT "rl_payment_pattern_pattern_id_md_pattern_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."md_pattern"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_user_course" ADD CONSTRAINT "rl_user_course_user_id_md_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."md_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_user_course" ADD CONSTRAINT "rl_user_course_course_id_md_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."md_course"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_user_course" ADD CONSTRAINT "rl_user_course_payment_id_fin_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."fin_payment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_user_pattern" ADD CONSTRAINT "rl_user_pattern_user_id_md_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."md_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_user_pattern" ADD CONSTRAINT "rl_user_pattern_pattern_id_md_pattern_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."md_pattern"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rl_user_pattern" ADD CONSTRAINT "rl_user_pattern_payment_id_fin_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."fin_payment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "md_notification" ADD CONSTRAINT "md_notification_user_id_md_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."md_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "md_category_parent_id_index" ON "md_category" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "md_product_type_category_id_index" ON "md_product" USING btree ("type","category_id");--> statement-breakpoint
CREATE INDEX "md_product_brand_id_index" ON "md_product" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "md_product_image_product_id_position_index" ON "md_product_image" USING btree ("product_id","position");--> statement-breakpoint
CREATE INDEX "rl_product_color_color_key_index" ON "rl_product_color" USING btree ("color_key");--> statement-breakpoint
CREATE INDEX "md_course_image_course_id_position_index" ON "md_course_image" USING btree ("course_id","position");--> statement-breakpoint
CREATE INDEX "md_course_outcome_course_id_position_index" ON "md_course_outcome" USING btree ("course_id","position");--> statement-breakpoint
CREATE INDEX "md_course_topic_course_id_index" ON "md_course_topic" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "md_course_topic_topic_index" ON "md_course_topic" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "md_lesson_course_id_position_index" ON "md_lesson" USING btree ("course_id","position");--> statement-breakpoint
CREATE INDEX "rl_course_material_product_id_index" ON "rl_course_material" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "md_pattern_material_pattern_id_position_index" ON "md_pattern_material" USING btree ("pattern_id","position");--> statement-breakpoint
CREATE INDEX "md_pattern_material_product_id_index" ON "md_pattern_material" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "md_order_user_id_index" ON "md_order" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "md_order_status_created_at_index" ON "md_order" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "md_order_item_order_id_index" ON "md_order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "md_order_item_product_id_index" ON "md_order_item" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "md_order_status_history_order_id_changed_at_index" ON "md_order_status_history" USING btree ("order_id","changed_at");--> statement-breakpoint
CREATE INDEX "fin_payment_status_created_at_index" ON "fin_payment" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "fin_payment_user_id_index" ON "fin_payment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "fin_payment_order_id_index" ON "fin_payment" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "rl_payment_course_course_id_index" ON "rl_payment_course" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "rl_payment_pattern_pattern_id_index" ON "rl_payment_pattern" USING btree ("pattern_id");--> statement-breakpoint
CREATE INDEX "rl_user_course_course_id_index" ON "rl_user_course" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "rl_user_pattern_pattern_id_index" ON "rl_user_pattern" USING btree ("pattern_id");--> statement-breakpoint
CREATE INDEX "md_notification_audience_user_id_created_at_index" ON "md_notification" USING btree ("audience","user_id","created_at");