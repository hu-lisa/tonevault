import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar, boolean, primaryKey, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 })
    .notNull()
    .unique(),
  createdAt: timestamp({mode: 'date'})
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const gearItems = pgTable("gear_items", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade'} ),
  type: varchar({ enum: ['guitar', 'amp', 'pedal'] })
    .notNull(),
  name: varchar({length: 255})
    .notNull(),
  notes: text(),
  createdAt: timestamp({mode: 'date'})
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => [
  index().on(table.userId),
]);
export type GearItem = typeof gearItems.$inferSelect;
export type NewGearItem = typeof gearItems.$inferInsert;

export const loadouts = pgTable("loadouts", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 })
    .notNull(),
  isDefault: boolean()
    .default(false)
    .notNull(),
  createdAt: timestamp({mode: 'date'})
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => [
  index().on(table.userId),
]);
export type Loadout = typeof loadouts.$inferSelect;
export type NewLoadout = typeof loadouts.$inferInsert;

export const loadoutItems = pgTable(
  "loadout_gear_items", 
  {
    loadoutId: integer()
      .notNull()
      .references(() => loadouts.id, { onDelete: 'cascade' }),
    gearItemId: integer()
      .notNull()
      .references(() => gearItems.id, { onDelete: 'cascade' }),
  }, 
  (table) => [
    primaryKey({ columns: [table.loadoutId, table.gearItemId] }),
    index().on(table.gearItemId),
  ],
);
export type LoadoutItem = typeof loadoutItems.$inferSelect;
export type NewLoadoutItem = typeof loadoutItems.$inferInsert;

export const songs = pgTable("songs", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 })
    .notNull(),
  artist: varchar({ length: 255 })
    .notNull(),
  status: varchar({ enum: ['want_to_learn', 'currently_learning', 'learned'] })
    .notNull(),
  source_link: text(),
  lastPracticedAt: timestamp(),
  createdAt: timestamp({mode: 'date'})
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => [
  index().on(table.userId),
]);
export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export const tags = pgTable("tags", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar({ length: 50 })
    .notNull(),
}, (table) => [
  index().on(table.userId),
]);
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const songTags = pgTable(
  "song_tags", 
  {
    songId: integer()
      .notNull()
      .references(() => songs.id, { onDelete: 'cascade' }),
    tagId: integer()
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.songId, table.tagId] }),
    index().on(table.tagId),
  ],
);
export type SongTag = typeof songTags.$inferSelect;
export type NewSongTag = typeof songTags.$inferInsert;

export const presets = pgTable("presets", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  songId: integer()
    .notNull()
    .references(() => songs.id, { onDelete: 'cascade' }),
  loadoutId: integer()
    .notNull()
    .references(() => loadouts.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }),
  isPublic: boolean()
    .default(false)
    .notNull(),
  createdBy: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp({mode: 'date'})
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => [
  index().on(table.userId),
  index().on(table.songId),
  index().on(table.loadoutId),
  index().on(table.createdBy),
]);
export type Preset = typeof presets.$inferSelect;
export type NewPreset = typeof presets.$inferInsert;

export const presetSettings = pgTable(
  "preset_settings", 
  {
    presetId: integer()
      .notNull() 
      .references(() => presets.id, { onDelete: 'cascade' }),
    gearItemId: integer()
      .notNull()
      .references(() => gearItems.id, { onDelete: 'cascade' }),
    settings: text(),
  }, (table) => [
    primaryKey({ columns: [table.presetId, table.gearItemId] }),
    index().on(table.gearItemId),
  ],
);
export type PresetSetting = typeof presetSettings.$inferSelect;
export type NewPresetSetting = typeof presetSettings.$inferInsert;


//RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  gearItems: many(gearItems),
  loadouts: many(loadouts),
  songs: many(songs),
  tags: many(tags),
  ownedPresets: many(presets, { relationName: "preset_owner" }),
  createdPresets: many(presets, { relationName: "preset_creator" }),
}));

export const gearItemsRelations = relations(gearItems, ({ one, many }) => ({
  user: one(users, { fields: [gearItems.userId], references: [users.id]}),
  loadoutItems: many(loadoutItems),
  presetSettings: many(presetSettings),
}));

export const loadoutsRelations = relations(loadouts, ({ one, many }) => ({
  user: one(users, { fields: [loadouts.userId], references: [users.id] }),
  loadoutItems: many(loadoutItems),
}));

export const loadoutItemsRelations = relations(loadoutItems, ({ one }) => ({
  gearItem: one(gearItems, { fields: [loadoutItems.gearItemId], references: [gearItems.id] }),
  loadout: one(loadouts, { fields: [loadoutItems.loadoutId], references: [loadouts.id] }),
}));

export const songsRelations = relations(songs, ({one, many}) => ({
  user: one(users, { fields: [songs.userId], references: [users.id] }),
  presets: many(presets),
  songTags: many(songTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  songTags: many(songTags),
}));

export const songTagsRelations = relations(songTags, ({ one }) => ({
  song: one(songs, { fields: [songTags.songId], references: [songs.id] }),
  tag: one(tags, { fields: [songTags.tagId], references: [tags.id] }),
}));

export const presetsRelations = relations(presets, ({ one, many }) => ({
  owner: one(users, { fields: [presets.userId], references: [users.id] }),
  creator: one(users, { fields: [presets.createdBy], references: [users.id] }),
  song: one(songs, { fields: [presets.songId], references: [songs.id] }),
  loadout: one(loadouts, { fields: [presets.loadoutId], references: [loadouts.id] }),
  presetSettings: many(presetSettings),
}));

export const presetSettingsRelations = relations(presetSettings, ({ one }) => ({
  gearItem: one(gearItems, { fields: [presetSettings.gearItemId], references: [gearItems.id] }),
  preset: one(presets, { fields: [presetSettings.presetId], references: [presets.id] }),
}));