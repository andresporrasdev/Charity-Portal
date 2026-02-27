const request = require("supertest");
const app = require("../../app");
const { connect, close } = require("../helpers/testDb");

// Mock email so no real emails are sent
jest.mock("../../utils/email", () => ({
  sendEmail: jest.fn().mockResolvedValue([]),
  sendEmailWithImageAttachment: jest.fn().mockResolvedValue(undefined),
}));

beforeAll(async () => { await connect(); });
afterAll(async () => { await close(); });

const validPayload = { name: "Alice", email: "alice@example.com", message: "Hello there!" };

describe("POST /api/contact/send-contact-email", () => {
  it("returns 200 on a valid contact form submission", async () => {
    const res = await request(app).post("/api/contact/send-contact-email").send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app).post("/api/contact/send-contact-email").send({ email: "a@b.com", message: "Hi" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is missing", async () => {
    const res = await request(app).post("/api/contact/send-contact-email").send({ name: "Alice", message: "Hi" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is missing", async () => {
    const res = await request(app).post("/api/contact/send-contact-email").send({ name: "Alice", email: "a@b.com" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when email format is invalid", async () => {
    const res = await request(app).post("/api/contact/send-contact-email").send({ name: "Alice", email: "not-an-email", message: "Hi" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when message exceeds 2000 characters", async () => {
    const res = await request(app)
      .post("/api/contact/send-contact-email")
      .send({ name: "Alice", email: "a@b.com", message: "x".repeat(2001) });
    expect(res.status).toBe(400);
  });

  it("sanitizes HTML in name before sending (no XSS)", async () => {
    const { sendEmail } = require("../../utils/email");
    await request(app)
      .post("/api/contact/send-contact-email")
      .send({ name: "<script>alert(1)</script>", email: "a@b.com", message: "Hi" });
    const callArgs = sendEmail.mock.calls[sendEmail.mock.calls.length - 1][0];
    // The HTML email bodies must not contain raw <script> tags
    const htmlBodies = callArgs.map((opt) => opt.html || "").join("");
    expect(htmlBodies).not.toContain("<script>");
    expect(htmlBodies).toContain("&lt;script&gt;");
  });
});
