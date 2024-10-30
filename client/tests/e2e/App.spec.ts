import { expect, test } from "@playwright/test";

// Configure the base setup for all tests
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

// Verify initial page state and core UI elements
test("on page load, i see the dropdown and retrieve table button", async ({ page }) => {
  await expect(page.getByLabel("Select a data file", {exact: true})).toBeVisible();
  await expect(page.getByLabel("retrieve")).toBeVisible();
});

// Comprehensive test for data display functionality across different datasets and view modes
test("after I click the retrieve table button, i see the selected table in the output area", async ({
  page,
}) => {
  // Verify initial state with prompt message
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();

  // Test Star Data in table mode
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("Star Data");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  // Verify expected data is visible
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();
  // Verify no parsing errors
  await expect(
    page.getByText("Couldn't parse the following headers: ProperName")
  ).not.toBeVisible();

  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("Star Data");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  // Verify expected data is visible
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();
  // Verify no parsing errors
  await expect(
    page.getByText("Couldn't parse the following headers: ProperName")
  ).toBeVisible();

  // Test Text Dataset with vertical bar chart
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("Text Dataset");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  // Verify previous data is cleared
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();
  await page.getByLabel("retrieve").click();
  // Verify error message for non-numerical data
  await expect(
    page.getByText("Selected dataset contains no numerical Y values.")
  ).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();

  // Test Text Dataset in table mode
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("john@email.com")).toBeVisible();
  await expect(
    page.getByText("Selected dataset contains no numerical Y values.")
  ).not.toBeVisible();

  // Test Number Dataset with stacked bar chart
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("Number Dataset");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Stacked Bar Chart");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();
  await expect(page.getByText("Score1")).not.toBeVisible();

  // Test Number Dataset in table mode
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
  await expect(page.getByText("Score1")).toBeVisible();

  // Test Empty Dataset handling
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("Empty Dataset");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
  await expect(page.getByText("Score1")).not.toBeVisible();

  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Stacked Bar Chart");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
  await expect(page.getByText("Score1")).not.toBeVisible();
  await expect(
    page.getByText("Selected dataset contains no numerical Y values.")
  ).toBeVisible();

  // Test resetting to default state
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("Select a file");
  await page.getByLabel("retrieve").click();
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();
});

// Test handling of nonexistent data sources
test('handle async retrieve - possibly instant response', async ({ page }) => {
  await page.getByLabel("Select a data file", { exact: true }).selectOption("Nonexistent table");
  await page.getByLabel("Select display mode", { exact: true }).selectOption("Table");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("Bad request: File not found:")).toBeVisible();
});

// Test error handling for missing selections
test("if i click the retrieve button without choosing a display mode or dataset, i get prompted with an error message", async ({
  page,
}) => {
  // Verify initial state
  await expect(page.getByText("Please choose one of the tables in the dropdown menu to display it.")).toBeVisible();

  // Test clicking retrieve without selections
  await page.getByLabel("retrieve").click();
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();

  // Test clicking retrieve with dataset but no display mode
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Star Data");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("Please choose a display mode.")).toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();
});

// Test that only the final dataset selection is considered
test("if I select multiple datasets, the one I selected before pressing the button is displayed", async ({ page }) => {
  // Make multiple dataset selections
  await page.getByLabel("Select a data file", {exact: true}).selectOption("census/income_by_race.csv");
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Nonexistent table");
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Star Data");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  
  // Verify only the last selected dataset is displayed
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();
});

// Test vertical bar chart display mode
test("after I choose vertical bar chart display mode, i see data displayed as a vertical bar chart", async ({
  page,
}) => {
  // Verify initial state
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();

  // Test star data with vertical bar chart
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Star Data");
  await page.getByLabel("Select display mode", {exact: true}).selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(
    page.getByText("Couldn't parse the following headers: ProperName")
  ).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();

  // Test nonexistent table
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Nonexistent table");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();

  // Test reset to default state
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Select a file");
  await page.getByLabel("retrieve").click();
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
});

// Test handling of empty datasets with vertical bar chart
test("dataset chosen and vertical bar view mode, no valid headers", async ({
  page,
}) => {
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Empty Dataset");
  await page.getByLabel("Select display mode", {exact: true}).selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  // Verify error messages
  await expect(
    page.getByText("Couldn't parse the following headers: ProperName")
  ).not.toBeVisible();
  await expect(
    page.getByText("Selected dataset contains no numerical Y values.")
  ).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
});

// Test switching between different view modes with same dataset
test("same data set, alternating view modes", async ({
  page,
}) => {
  // Test initial stacked bar chart view
  await page.getByLabel("Select a data file", {exact: true}).selectOption("Star Data");
  await page.getByLabel("Select display mode", {exact: true}).selectOption("Stacked Bar Chart");
  await page.getByLabel("retrieve").click();
  let canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();

  // Switch to table view
  await page.getByLabel("Select display mode", {exact: true}).selectOption("Table");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();

  // Switch back to stacked bar chart
  await page.getByLabel("Select display mode", {exact: true}).selectOption("Stacked Bar Chart");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();
});

// Test API integration with census data
test("api query dataset, table and bar chart display mode", async ({
  page,
}) => {
  // Test table view of census data
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("census/postsecondary_education.csv");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  
  await expect(page.getByText("0.090909091")).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();

  // Test vertical bar chart view of same data
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("0.090909091")).not.toBeVisible();
  await expect(page.getByText("Two or More Races")).not.toBeVisible();
  canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();
});

// Test switching between API and mock data
test("alternating between datasets and display mode, mock and non-mock", async ({
  page,
}) => {
  // Test census data in table view
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("census/postsecondary_education.csv");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("0.090909091")).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();

  // Switch to mock data in table view
  await page
    .getByLabel("Select a data file", { exact: true })
    .selectOption("Star Data");
  await page
    .getByLabel("Select display mode", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("Brown University")).not.toBeVisible();
  await expect(page.getByText("0.090909091")).not.toBeVisible();
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
});

// Test keyboard navigation functionality
test("user input keys work to select dataset and table type", async ({
  page,
}) => {
  // Verify accessibility instruction message
  await expect(
    page.getByText('Use Tab to move between controls, arrow keys to change options, and Enter to select')
  ).toBeVisible();
  
  // Test keyboard navigation sequence
  await page.click('body')
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press("Tab");
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press("Tab");
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  
  // Verify data display after keyboard navigation
  await expect(page.getByText("85413")).toBeVisible();
});