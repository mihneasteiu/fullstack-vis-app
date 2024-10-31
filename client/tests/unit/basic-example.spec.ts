import { expect, test } from "vitest";
import * as broadband from "../../src/components/select/SelectBroadbandHistory.tsx";

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

test("test broadband retrieval", async () => {
  expect(await broadband.getBroadBand("wrong state", "wrong county")).rejects.toThrow(Error);
  expect(
    await broadband.getBroadBand("California", "wrong county")
  ).rejects.toThrow(Error);
    expect(
      await broadband.getBroadBand("wrong state", "Providence")
    ).rejects.toThrow(Error);
  expect(await broadband.getBroadBand("Rhode Island", "Providence")).toBe(
    "Providence, Rhode Island broadband coverage is 85.4%"
  );
});


// For more information on how to make unit tests, visit:
// https://jestjs.io/docs/using-matchers
