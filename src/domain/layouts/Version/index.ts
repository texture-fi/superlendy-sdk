import { struct } from '@solana/buffer-layout';
import { bool } from '@solana/buffer-layout-utils';

export interface VersionParamsLayout {
  no_error: boolean;
}

export const versionParamsLayout = struct<VersionParamsLayout>([
  bool('no_error'),
]);
