import * as migration_20261105_212538_initial_payload from './20261105_212538_initial_payload';
import * as migration_20261123_224340_cms_collections from './20261123_224340_cms_collections';

export const migrations = [
  {
    up: migration_20261105_212538_initial_payload.up,
    down: migration_20261105_212538_initial_payload.down,
    name: '20261105_212538_initial_payload',
  },
  {
    up: migration_20261123_224340_cms_collections.up,
    down: migration_20261123_224340_cms_collections.down,
    name: '20261123_224340_cms_collections',
  },
];
