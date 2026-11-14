import * as migration_20261105_212538_initial_payload from './20261105_212538_initial_payload';

export const migrations = [
  {
    up: migration_20261105_212538_initial_payload.up,
    down: migration_20261105_212538_initial_payload.down,
    name: '20261105_212538_initial_payload'
  },
];
