import * as migration_20260221_073259_initial from './20260221_073259_initial';

export const migrations = [
  {
    up: migration_20260221_073259_initial.up,
    down: migration_20260221_073259_initial.down,
    name: '20260221_073259_initial'
  },
];
