import Medusa from '@medusajs/js-sdk';

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || '/', // e.g. http://localhost:9000
  debug: import.meta.env.DEV,
  auth: { type: 'session' },
});
