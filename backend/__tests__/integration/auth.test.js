const request = require("supertest");
const app = require("../../app");
const { connect, close, clear } = require("../helpers/testDb");
const User = require("../../models/user");
const Role = require("../../models/role");
const { encryptPassword } = require("../../utils/encryption");

// Don't send real emails during tests
jest.mock("../../utils/email", () => ({
  sendEmail: jest.fn().mockResolvedValue([]),
  sendEmailWithImageAttachment: jest.fn().mockResolvedValue(undefined),
}));

beforeAll(async () => {
  await connect();
  // Seed a role and an active user
  const role = await Role.create({ name: "Member" });
  const password = await encryptPassword("ValidPass123!");
  await User.create({
    email: "active@test.com",
    password,
    first_name: "Test",
    last_name: "User",
    isActive: true,
    isPaid: true,
    roles: [role._id],
  });
});

afterAll(async () => {
  await close();
});

afterEach(async () => {
  // Don't clear users between tests — seeded user is shared
});

describe("POST /api/auth/login", () => {
  it("returns 400 when email or password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "test@test.com" });
    expect(res.status).toBe(400);
  });

  it("returns 401 when user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "anything" });
    expect(res.status).toBe(401);
    expect(res.body.status).toBe("fail");
  });

  it("returns 401 when password is wrong", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "active@test.com", password: "WrongPassword!" });
    expect(res.status).toBe(401);
    expect(res.body.status).toBe("fail");
  });

  it("returns 200 and a token on successful login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "active@test.com", password: "ValidPass123!" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.token).toBeTruthy();
    // Password must not leak in the response
    expect(JSON.stringify(res.body)).not.toContain("ValidPass123!");
  });

  it("does not include password hash in login response", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "active@test.com", password: "ValidPass123!" });
    expect(res.body.existingUser?.password).toBeUndefined();
  });
});

describe("POST /api/auth/signup", () => {
  it("returns 404 when email not found in DB", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "notfound@test.com", password: "Pass123!" });
    expect(res.status).toBe(404);
  });

  it("returns 400 when password is too short", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "active@test.com", password: "ab" });
    expect(res.status).toBe(400);
  });
});
