import * as migration_20261105_212538_initial_payload from './20261105_212538_initial_payload';
import * as migration_20261109_200647_page_collections from './20261109_200647_page_collections';
import * as migration_20261110_201709_page_drafts from './20261110_201709_page_drafts';

export const migrations = [
  {
    up: migration_20261105_212538_initial_payload.up,
    down: migration_20261105_212538_initial_payload.down,
    name: '20261105_212538_initial_payload',
  },
  {
    up: migration_20261109_200647_page_collections.up,
    down: migration_20261109_200647_page_collections.down,
    name: '20261109_200647_page_collections',
  },
  {
    up: migration_20261110_201709_page_drafts.up,
    down: migration_20261110_201709_page_drafts.down,
    name: '20261110_201709_page_drafts'
  },
];
