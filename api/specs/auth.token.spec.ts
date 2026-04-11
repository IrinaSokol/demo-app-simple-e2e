import { expect, test } from '../fixtures/apiTest';
import { env } from '../../config/env';

test.describe('API — auth token', () => {
  test('returns a bearer token for valid demo credentials', async ({ api }) => {
    const token = await api.auth.getToken(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
    expect(token).toBe('demo-token');
  });
});
