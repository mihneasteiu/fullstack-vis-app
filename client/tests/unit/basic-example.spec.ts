import { expect, test } from "vitest";

// all exports from main will now be available as main.X
// import * as main from '../mock/src/main';
import * as mockedDData from "../../src/mockedData";

// Notice how you can test vanilla TS functions using Playwright as well!
test("test getTable from mockedDData", () => {
  expect(mockedDData.getTable("key_not_there")).toBe(undefined);
  expect(mockedDData.getTable("Star Data")?.length).toBe(24);
  expect(mockedDData.getTable("Student Records")?.length).toBe(14);
  expect(mockedDData.getTable("Empty Table")?.length).toBe(1);
});

// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers
