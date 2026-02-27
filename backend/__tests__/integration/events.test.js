const request = require("supertest");
const app = require("../../app");
const { connect, close, clear } = require("../helpers/testDb");
const User = require("../../models/user");
const Role = require("../../models/role");
const Event = require("../../models/event");
const jwt = require("jsonwebtoken");

jest.mock("../../utils/email", () => ({
  sendEmail: jest.fn().mockResolvedValue([]),
  sendEmailWithImageAttachment: jest.fn().mockResolvedValue(undefined),
}));

let adminToken;

beforeAll(async () => {
  await connect();
  // Seed an Administrator role + user
  const role = await Role.create({ name: "Administrator" });
  const user = await User.create({
    email: "admin@test.com",
    first_name: "Admin",
    last_name: "User",
    isActive: true,
    isPaid: true,
    roles: [role._id],
  });
  // Sign a token for the admin user
  adminToken = jwt.sign({ email: user.email }, process.env.SECRET_STR || "test-secret", { expiresIn: "1h" });
  // Patch JWT secret for tests
  process.env.SECRET_STR = process.env.SECRET_STR || "test-secret";

  await Event.create({ name: "Test Event", description: "desc", time: "2030-01-01T10:00", place: "Hall" });
});

afterAll(async () => {
  await close();
});

describe("GET /api/event/readEvent", () => {
  it("returns 200 and an events array (public route)", async () => {
    const res = await request(app).get("/api/event/readEvent");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data.events)).toBe(true);
  });

  it("includes pagination metadata", async () => {
    const res = await request(app).get("/api/event/readEvent");
    expect(res.body).toHaveProperty("totalResults");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("currentPage");
  });

  it("respects ?limit=1 pagination param", async () => {
    const res = await request(app).get("/api/event/readEvent?limit=1&page=1");
    expect(res.status).toBe(200);
    expect(res.body.data.events.length).toBe(1);
    expect(res.body.totalPages).toBeGreaterThanOrEqual(1);
  });
});

describe("POST /api/event/addEvent — auth guard", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).post("/api/event/addEvent").send({ name: "Unauth Event" });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/event/deleteEvent/:id — auth guard", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).delete("/api/event/deleteEvent/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });
});
