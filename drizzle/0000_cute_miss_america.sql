CREATE TABLE "gear_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gear_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"type" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loadout_gear_items" (
	"loadoutId" integer NOT NULL,
	"gearItemId" integer NOT NULL,
	CONSTRAINT "loadout_gear_items_loadoutId_gearItemId_pk" PRIMARY KEY("loadoutId","gearItemId")
);
--> statement-breakpoint
CREATE TABLE "loadouts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "loadouts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preset_settings" (
	"presetId" integer NOT NULL,
	"gearItemId" integer NOT NULL,
	"settings" text,
	CONSTRAINT "preset_settings_presetId_gearItemId_pk" PRIMARY KEY("presetId","gearItemId")
);
--> statement-breakpoint
CREATE TABLE "presets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "presets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"songId" integer NOT NULL,
	"loadoutId" integer NOT NULL,
	"name" varchar(255),
	"isPublic" boolean DEFAULT false NOT NULL,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "song_tags" (
	"songId" integer NOT NULL,
	"tagId" integer NOT NULL,
	CONSTRAINT "song_tags_songId_tagId_pk" PRIMARY KEY("songId","tagId")
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "songs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"status" varchar NOT NULL,
	"source_link" text,
	"lastPracticedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"passwordHash" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadout_gear_items" ADD CONSTRAINT "loadout_gear_items_loadoutId_loadouts_id_fk" FOREIGN KEY ("loadoutId") REFERENCES "public"."loadouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadout_gear_items" ADD CONSTRAINT "loadout_gear_items_gearItemId_gear_items_id_fk" FOREIGN KEY ("gearItemId") REFERENCES "public"."gear_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "loadouts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preset_settings" ADD CONSTRAINT "preset_settings_presetId_presets_id_fk" FOREIGN KEY ("presetId") REFERENCES "public"."presets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preset_settings" ADD CONSTRAINT "preset_settings_gearItemId_gear_items_id_fk" FOREIGN KEY ("gearItemId") REFERENCES "public"."gear_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presets" ADD CONSTRAINT "presets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presets" ADD CONSTRAINT "presets_songId_songs_id_fk" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presets" ADD CONSTRAINT "presets_loadoutId_loadouts_id_fk" FOREIGN KEY ("loadoutId") REFERENCES "public"."loadouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presets" ADD CONSTRAINT "presets_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "song_tags" ADD CONSTRAINT "song_tags_songId_songs_id_fk" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "song_tags" ADD CONSTRAINT "song_tags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gear_items_userId_index" ON "gear_items" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "loadout_gear_items_gearItemId_index" ON "loadout_gear_items" USING btree ("gearItemId");--> statement-breakpoint
CREATE INDEX "loadouts_userId_index" ON "loadouts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "preset_settings_gearItemId_index" ON "preset_settings" USING btree ("gearItemId");--> statement-breakpoint
CREATE INDEX "presets_userId_index" ON "presets" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "presets_songId_index" ON "presets" USING btree ("songId");--> statement-breakpoint
CREATE INDEX "presets_loadoutId_index" ON "presets" USING btree ("loadoutId");--> statement-breakpoint
CREATE INDEX "presets_createdBy_index" ON "presets" USING btree ("createdBy");--> statement-breakpoint
CREATE INDEX "song_tags_tagId_index" ON "song_tags" USING btree ("tagId");--> statement-breakpoint
CREATE INDEX "songs_userId_index" ON "songs" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "tags_userId_index" ON "tags" USING btree ("userId");