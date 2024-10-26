import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

//TODO: replace error messages with actual backedn responses
test("on page load, i see the dropdown and retrieve table button", async ({ page }) => {
  await expect(page.getByLabel("dropdown", {exact: true})).toBeVisible();
  await expect(page.getByLabel("retrieve")).toBeVisible();
});

test("after I click the retrieve table button, i see the selected table in the output area", async ({
  page,
}) => {
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();

  await page
    .getByLabel("dropdown", { exact: true })
    .selectOption("Mocked Star Data");
  await page
    .getByLabel("dropdownVisOption", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();

  await expect(page.getByText("Name")).not.toBeVisible();
  await expect(page.getByText("Student_13")).not.toBeVisible();
  await page
    .getByLabel("dropdown", { exact: true })
    .selectOption("Select a file");
  await page.getByLabel("retrieve").click();
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();
});

test('handle async retrieve - possibly instant response', async ({ page }) => {
  await page.getByLabel("dropdown", { exact: true }).selectOption("Nonexistent table");
  await page.getByLabel("dropdownVisOption", { exact: true }).selectOption("Table");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("No data available for the selected table.")).toBeVisible();
});

test("if i click the retrieve button without choosing a display mode or dataset, i get prompted with an error message", async ({
  page,
}) => {
  await expect(page.getByText("Please choose one of the tables in the dropdown menu to display it.")).toBeVisible();

  await page.getByLabel("retrieve").click();
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();
  await page.getByLabel("dropdown", {exact: true}).selectOption("Mocked Star Data");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("Please choose a display mode.")).toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();
});

test("if I select multiple datasets, the one I selected before pressing the button is displayed", async ({ page }) => {
  await page.getByLabel("dropdown", {exact: true}).selectOption("census/income_by_race.csv");
  await page.getByLabel("dropdown", {exact: true}).selectOption("Nonexistent table");
  await page.getByLabel("dropdown", {exact: true}).selectOption("Mocked Star Data");
  await page
    .getByLabel("dropdownVisOption", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();
});

test("after I choose vertical bar chart display mode, i see data displayed as a vertical bar chart", async ({
  page,
}) => {
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();

  await page.getByLabel("dropdown", {exact: true}).selectOption("Mocked Star Data");
  await page.getByLabel("dropdownVisOption", {exact: true}).selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(
    page.getByText("Couldn't parse the following headers: ProperName")
  ).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();

  await page.getByLabel("dropdown", {exact: true}).selectOption("Nonexistent table");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();

  await page.getByLabel("dropdown", {exact: true}).selectOption("Select a file");
  await page.getByLabel("retrieve").click();
  await expect(
    page.getByText(
      "Please choose one of the tables in the dropdown menu to display it."
    )
  ).toBeVisible();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
});

test("dataset chosen and vertical bar view mode, no valid headers", async ({
  page,
}) => {
  await page.getByLabel("dropdown", {exact: true}).selectOption("Empty Table");
  await page.getByLabel("dropdownVisOption", {exact: true}).selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  // Unparasable data message is not visible anymore
  await expect(
    page.getByText("Couldn't parse the following headers: ProperName")
  ).not.toBeVisible();
  await expect(
    page.getByText("Selected dataset contains no numerical Y values.")
  ).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
});

test("same data set, alternating view modes", async ({
  page,
}) => {
  await page.getByLabel("dropdown", {exact: true}).selectOption("Mocked Star Data");
  await page.getByLabel("dropdownVisOption", {exact: true}).selectOption("Stacked Bar Chart");
  await page.getByLabel("retrieve").click();
  let canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();
  // change to another data set
  await page.getByLabel("dropdownVisOption", {exact: true}).selectOption("Table");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();
  await expect(
    page.getByText("Selected dataset contains no numerical Y values.")
  ).toBeVisible();
  // go back to table 
  await page.getByLabel("dropdownVisOption", {exact: true}).selectOption("Stacked Bar Chart");
  await page.getByLabel("retrieve").click();
  canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();
  await expect(page.getByText("Andreas")).not.toBeVisible();
  await expect(page.getByText("StarID")).not.toBeVisible();
  await expect(page.getByText("-169.738")).not.toBeVisible();
});

// API REQUEST TESTS
test("api query dataset, table and bar chart display mode", async ({
  page,
}) => {
  await page
    .getByLabel("dropdown", { exact: true })
    .selectOption("census/postsecondary_education.csv");
  await page
    .getByLabel("dropdownVisOption", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  // Unparasable data message is not visible anymore
  await expect(
    page.getByText("Couldn't parse the following headers: ")
  ).not.toBeVisible();
  await expect(page.getByText("Brown University")).toBeVisible();
  await expect(page.getByText("Two or More Races")).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();

  await page
    .getByLabel("dropdownVisOption", { exact: true })
    .selectOption("Vertical Bar Chart");
  await page.getByLabel("retrieve").click();
  // Unparasable data message is not visible anymore
  await expect(
    page.getByText("Couldn't parse the following headers: ")
  ).not.toBeVisible();
  await expect(page.getByText("Brown University")).not.toBeVisible();
  await expect(page.getByText("Two or More Races")).not.toBeVisible();
  canvas = page.getByRole("img");
  await expect(canvas).toBeVisible();
});

test("alternating between datasets and display mode, mock and non-mock", async ({
  page,
}) => {
  await page
    .getByLabel("dropdown", { exact: true })
    .selectOption("census/postsecondary_education.csv");
  await page
    .getByLabel("dropdownVisOption", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  // Unparasable data message is not visible anymore
  await expect(
    page.getByText("Couldn't parse the following headers: ")
  ).not.toBeVisible();
  await expect(page.getByText("Brown University")).toBeVisible();
  await expect(page.getByText("Two or More Races")).toBeVisible();
  let canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();

  await page
    .getByLabel("dropdown", { exact: true })
    .selectOption("Mocked Star Data");
  await page
    .getByLabel("dropdownVisOption", { exact: true })
    .selectOption("Table");
  await page.getByLabel("retrieve").click();
  // Unparasable data message is not visible anymore
  await expect(
    page.getByText("Couldn't parse the following headers: ")
  ).not.toBeVisible();
  await expect(page.getByText("Brown University")).not.toBeVisible();
  await expect(page.getByText("Two or More Races")).not.toBeVisible();
  await expect(page.getByText("Andreas")).toBeVisible();
  await expect(page.getByText("StarID")).toBeVisible();
  await expect(page.getByText("-169.738")).toBeVisible();
  canvas = page.getByRole("img");
  await expect(canvas).not.toBeVisible();
});
