import { expect, test } from "vitest";

// all exports from main will now be available as main.X
// import * as main from '../mock/src/main';
import * as mockedDData from "../../src/data/data";

// Notice how you can test vanilla TS functions using Playwright as well!
test("test getTable", async () => {
  expect(await mockedDData.getTable("key_not_there")).toBe(undefined);
  expect((await mockedDData.getTable("census/income_by_race.csv"))?.length).toBe(324);
  expect((await mockedDData.getTable("census/postsecondary_education"))?.length).toBe(17);
  expect((await mockedDData.getTable("stars/ten-star.csv"))?.length).toBe(11);
});

// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers
