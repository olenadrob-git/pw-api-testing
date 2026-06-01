import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [ 
    ['html', {open: 'never'}], 
    ['list'] ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure'
    
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
   
    
    // extraHTTPHeaders: {
    //   Authorization: 'dffgrergfrr'
    // }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-testing',
      testDir: './tests/api-tests',
      testMatch: ['example.spec.ts', 'negativeTests.spec.ts', 'harFlow.spec.ts', 'workingWithAPI.spec.ts' ],
      
      //dependencies: ['api-smoke-tests'], // api project will run only after smoke
    },
    {
      name: 'api-smoke-tests',
      testDir: './tests/api-tests',
      testMatch: 'smokeTest.spec.ts',
    },
    {
      name: 'ui-testing',
      testDir: './tests/ui-tests',
      testMatch: 'smokeUITests.spec.ts',
      use: {
        browserName: 'chromium'
      }
    }
  ],

});
