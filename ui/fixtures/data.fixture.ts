import { SEED_ASSET_NAMES, SEED_PROJECT_NAMES } from '../../config/demoSeed';

/** Stable labels from the demo app seed (for UI expectations). */
export const demoData = {
  projectNames: SEED_PROJECT_NAMES,
  assetNames: SEED_ASSET_NAMES,
  primaryProject: 'Demo Project 1',
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

/** Unique project row for create-flow tests. */
export function createProjectInput(): ProjectFormInput {
  const id = Date.now();
  return {
    name: `E2E Project ${id}`,
    owner: `E2E Owner ${id}`,
    status: 'Active',
  };
}

/** Unique asset row for create-flow tests. */
export function createAssetInput(): AssetFormInput {
  const id = Date.now();
  return {
    name: `E2E Asset ${id}`,
    type: 'Laptop',
    status: 'Available',
  };
}
