const filterObj = require("../../../utils/filterObj");

describe("filterObj", () => {
  it("returns only the allowed fields", () => {
    const result = filterObj({ name: "Alice", password: "secret", roles: ["admin"] }, "name", "roles");
    expect(result).toEqual({ name: "Alice", roles: ["admin"] });
    expect(result).not.toHaveProperty("password");
  });

  it("returns an empty object when no fields match", () => {
    const result = filterObj({ foo: 1, bar: 2 }, "baz");
    expect(result).toEqual({});
  });

  it("returns an empty object when the source object is empty", () => {
    const result = filterObj({}, "name");
    expect(result).toEqual({});
  });

  it("handles no allowed fields argument", () => {
    const result = filterObj({ name: "Alice" });
    expect(result).toEqual({});
  });

  it("does not mutate the original object", () => {
    const original = { name: "Alice", password: "secret" };
    filterObj(original, "name");
    expect(original).toHaveProperty("password");
  });
});
