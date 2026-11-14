import * as migration_20261105_212538_initial_payload from './20261105_212538_initial_payload';
import * as migration_20261114_114829_academics_pages from './20261114_114829_academics_pages';

export const migrations = [
  {
    up: migration_20261105_212538_initial_payload.up,
    down: migration_20261105_212538_initial_payload.down,
    name: '20261105_212538_initial_payload',
  },
  {
    up: migration_20261114_114829_academics_pages.up,
    down: migration_20261114_114829_academics_pages.down,
    name: '20261114_114829_academics_pages'
  },
];
