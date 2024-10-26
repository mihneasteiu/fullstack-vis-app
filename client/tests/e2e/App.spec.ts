import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

  test("user input keys work to select dataset and table type", async ({
    page,
  }) => {
    await expect(
      page.getByText('Use Tab to move between controls, arrow keys to change options, and Enter to select')
    ).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    
    await expect(
      page.getByText("RI")
    ).toBeVisible();
  });

  test("user input keys work to select dataset and table type", async ({
    page,
  }) => {
    await expect(
      page.getByText('Use Tab to move between controls, arrow keys to change options, and Enter to select')
    ).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    
    await expect(
      page.getByText("RI")
    ).toBeVisible();
  });