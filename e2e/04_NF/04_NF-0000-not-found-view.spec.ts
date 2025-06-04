import { fakerFR } from '@faker-js/faker';
import test, { expect } from '@playwright/test';
import NotFoundPage from '@pw-pages/not-found.page';

test.describe('Not Found View', { tag: '@NotFoundPage' }, () => {
  const RANDOM_PATH = fakerFR.internet.domainWord();

  test('Should redirect to Not Found view for unknown route', async ({ page }) => {
    const notFoundPage = new NotFoundPage(page);

    await page.goto(RANDOM_PATH);

    await expect(page).toHaveURL(notFoundPage.urlRegExp);
    await expect(notFoundPage.title).toBeVisible();
    await expect(notFoundPage.subTitle).toBeVisible();
  });
});
