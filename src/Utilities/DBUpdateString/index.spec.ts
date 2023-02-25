import {
  BooleanToDBBoolean,
  DateToDBDate,
  NumberToDBNumber,
  StringToDBString,
} from ".";

describe("Testing out DBUpdateString", () => {
  it("Testing out String", () => {
    const result = StringToDBString("name", "john");
    expect(result).toBe("'name' = \"john\"");
  });
  it("Testing out Boolean", () => {
    const result = BooleanToDBBoolean("name", "true");
    expect(result).toBe("'name' = TRUE");
  });
  it("Testing out Number", () => {
    const res = NumberToDBNumber("num", 15);
    expect(res).toBe("'num' = 15");
  });
  it("Testing out Date", () => {
    const date = new Date();
    const res = DateToDBDate("date", date);
    expect(res).toBe(`'date' = to_timestamp(${date.getTime()}/1000)`);
  });
  it.skip("Testing out Null", () => {});
  it.skip("Testing out Array", () => {});
});
