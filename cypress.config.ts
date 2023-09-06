import { defineConfig } from 'cypress';
// Populate process.env with values from .env file
require('dotenv').config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    experimentalModifyObstructiveThirdPartyCode: true,
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
