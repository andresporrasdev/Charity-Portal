const bcrypt = require("bcrypt");
const { encryptPassword } = require("../../../utils/encryption");

describe("encryptPassword", () => {
  it("returns a bcrypt hash for a valid password", async () => {
    const hash = await encryptPassword("mySecret123");
    expect(hash).toBeTruthy();
    expect(hash).toMatch(/^\$2b\$/); // bcrypt hash prefix
  });

  it("returns a hash that verifies against the original password", async () => {
    const password = "testPassword!";
    const hash = await encryptPassword(password);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);
  });

  it("returns a different hash each time (salted)", async () => {
    const hash1 = await encryptPassword("same");
    const hash2 = await encryptPassword("same");
    expect(hash1).not.toBe(hash2);
  });

  it("returns null when bcrypt throws", async () => {
    // Pass a non-string to trigger bcrypt failure
    const result = await encryptPassword(null);
    expect(result).toBeNull();
  });
});
