import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '..', '.env') });

export type AppEnv = {
  BASE_URL: string;
  API_URL: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
};

function required(name: keyof AppEnv, fallback: string): string {
  const v = process.env[name];
  return v && v.length > 0 ? v : fallback;
}

/** Central env for Playwright (load from project root `.env`; see `.env.example`). */
export const env: AppEnv = {
  BASE_URL: required('BASE_URL', 'http://localhost:5173'),
  API_URL: required('API_URL', 'http://localhost:3001'),
  ADMIN_EMAIL: required('ADMIN_EMAIL', 'admin@demo.com'),
  ADMIN_PASSWORD: required('ADMIN_PASSWORD', 'admin123'),
};
