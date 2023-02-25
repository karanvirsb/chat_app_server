import { BooleanToDBBoolean, StringToDBString } from ".";

describe("Testing out DBUpdateString", () => {
  it("Testing out String", () => {
    const result = StringToDBString("name", "john");
    expect(result).toBe("'name' = \"john\"");
  });
  it("Testing out Boolean", () => {
    const result = BooleanToDBBoolean("name", "true");
    expect(result).toBe("'name' = TRUE");
  });
  it.skip("Testing out Number", () => {});
  it.skip("Testing out Date", () => {});
  it.skip("Testing out Null", () => {});
  it.skip("Testing out Array", () => {});
});
