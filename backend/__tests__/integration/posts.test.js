const request = require("supertest");
const app = require("../../app");
const { connect, close } = require("../helpers/testDb");

jest.mock("../../utils/email", () => ({
  sendEmail: jest.fn().mockResolvedValue([]),
  sendEmailWithImageAttachment: jest.fn().mockResolvedValue(undefined),
}));

beforeAll(async () => { await connect(); });
afterAll(async () => { await close(); });

describe("GET /api/post/getPostsForNonMember", () => {
  it("returns 200 and an array (public route)", async () => {
    const res = await request(app).get("/api/post/getPostsForNonMember");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
  });
});

describe("POST /api/post/addPost — auth guard", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app)
      .post("/api/post/addPost")
      .field("subject", "Test")
      .field("content", "Test content");
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/post/deletePost/:id — auth guard", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).delete("/api/post/deletePost/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/post/notify-users — auth guard", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app)
      .post("/api/post/notify-users")
      .send({ subject: "Test", messageBody: "<p>Hi</p>", emails: ["a@b.com"] });
    expect(res.status).toBe(401);
  });
});
