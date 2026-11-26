import * as migration_20261105_212538_initial_payload from './20261105_212538_initial_payload';
import * as migration_20261123_224340_cms_collections from './20261123_224340_cms_collections';
import * as migration_20261125_230544_review_fixes from './20261125_230544_review_fixes';
import * as migration_20261126_202409_home_sections from './20261126_202409_home_sections';

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
  {
    up: migration_20261125_230544_review_fixes.up,
    down: migration_20261125_230544_review_fixes.down,
    name: '20261125_230544_review_fixes',
  },
  {
    up: migration_20261126_202409_home_sections.up,
    down: migration_20261126_202409_home_sections.down,
    name: '20261126_202409_home_sections'
  },
];
