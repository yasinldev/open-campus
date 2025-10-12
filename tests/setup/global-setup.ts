import { test as setup } from '@playwright/test';

setup.describe.configure({ mode: 'serial' });

setup('setup', async ({ page }) => {
  // Any global setup if needed
});
