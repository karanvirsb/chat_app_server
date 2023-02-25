import { StringToDBString } from ".";

describe("Testing out DBUpdateString", () => {
  it("Testing out String", () => {
    const result = StringToDBString("name", "john");
    expect(result).toBe("'name' = \"john\"");
  });
  it.skip("Testing out Boolean", () => {});
  it.skip("Testing out Number", () => {});
  it.skip("Testing out Date", () => {});
  it.skip("Testing out Null", () => {});
  it.skip("Testing out Array", () => {});
});
