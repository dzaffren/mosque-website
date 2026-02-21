import * as migration_20260221_072716_initial from './20260221_072716_initial';

export const migrations = [
  {
    up: migration_20260221_072716_initial.up,
    down: migration_20260221_072716_initial.down,
    name: '20260221_072716_initial'
  },
];
