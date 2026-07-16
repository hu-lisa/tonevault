ALTER TABLE "presets" ALTER COLUMN "loadoutId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "loadouts" DROP COLUMN "isDefault";