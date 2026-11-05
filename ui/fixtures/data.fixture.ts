import { SEED_ASSET_NAMES, SEED_PROJECT_NAMES } from '../../config/demoSeed';

/** Stable labels from the demo app seed (for UI expectations). */
export const demoData = {
  projectNames: SEED_PROJECT_NAMES,
  assetNames: SEED_ASSET_NAMES,
  primaryProject: 'Demo Project 1',
  /** Seeded with status `Archived`. */
  archivedProject: 'Demo Project 3',
  primaryAsset: 'Demo Asset A',
} as const;

export type ProjectFormInput = {
  name: string;
  owner: string;
  status: string;
};

export type AssetFormInput = {
  name: string;
  type: string;
  status: string;
};

/** Unique across parallel workers (two workers can share a `Date.now()` millisecond). */
function uniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Unique project row for create-flow tests. */
export function createProjectInput(): ProjectFormInput {
  const id = uniqueId();
  return {
    name: `E2E Project ${id}`,
    owner: `E2E Owner ${id}`,
    status: 'Active',
  };
}

/** Unique asset row for create-flow tests. */
export function createAssetInput(): AssetFormInput {
  const id = uniqueId();
  return {
    name: `E2E Asset ${id}`,
    type: 'Laptop',
    status: 'Available',
  };
}
