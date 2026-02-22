import * as migration_20260221_073259_initial from './20260221_073259_initial';
import * as migration_20260222_125318_add_logo_shape_media_purpose from './20260222_125318_add_logo_shape_media_purpose';
import * as migration_20260222_131024_add_media_image_sizes from './20260222_131024_add_media_image_sizes';

export const migrations = [
  {
    up: migration_20260221_073259_initial.up,
    down: migration_20260221_073259_initial.down,
    name: '20260221_073259_initial'
  },
  {
    up: migration_20260222_125318_add_logo_shape_media_purpose.up,
    down: migration_20260222_125318_add_logo_shape_media_purpose.down,
    name: '20260222_125318_add_logo_shape_media_purpose'
  },
  {
    up: migration_20260222_131024_add_media_image_sizes.up,
    down: migration_20260222_131024_add_media_image_sizes.down,
    name: '20260222_131024_add_media_image_sizes'
  },
];
