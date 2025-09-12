import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  // Setup code that runs once before all tests
  // eslint-disable-next-line no-console
  console.log('Setting up E2E tests...');

  // You can add database seeding, authentication setup, etc. here
  // For example:
  // - Start additional services
  // - Seed test database
  // - Set up test user accounts
  // - Configure test environment variables

  return async () => {
    // Teardown code
    // eslint-disable-next-line no-console
    console.log('Tearing down E2E tests...');
  };
}

export default globalSetup;