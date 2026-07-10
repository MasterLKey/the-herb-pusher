import * as migration_20260710_151649_initial from './20260710_151649_initial';

export const migrations = [
  {
    up: migration_20260710_151649_initial.up,
    down: migration_20260710_151649_initial.down,
    name: '20260710_151649_initial'
  },
];
