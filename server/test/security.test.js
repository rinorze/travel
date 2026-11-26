// Security regression tests for the auth fixes.
// Run: npm test (Node's built-in runner + supertest + in-memory MongoDB).
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../src/app.js");
const { default: User } = await import("../src/models/User.js");

let mongo;
const app = createApp();

before(async () => {
  // First start on Windows can be slow while the mongod binary unpacks.
  mongo = await MongoMemoryServer.create({ instance: { launchTimeout: 60_000 } });
  await mongoose.connect(mongo.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

const register = (email, password = "correct-horse-1") =>
  request(app).post("/api/auth/register").send({ name: "Test User", email, password });

describe("passwords", () => {
  it("stores a bcrypt hash, never the password itself", async () => {
    await register("a@example.com", "correct-horse-1").expect(201);
    const user = await User.findOne({ email: "a@example.com" }).lean();
    assert.notEqual(user.password, "correct-horse-1");
    assert.match(user.password, /^\$2[aby]\$12\$/);
  });

  it("logs in with the right password and rejects a wrong one", async () => {
    await register("b@example.com", "correct-horse-1").expect(201);
    await request(app)
      .post("/api/auth/login")
      .send({ email: "b@example.com", password: "correct-horse-1" })
      .expect(200);
    await request(app)
      .post("/api/auth/login")
      .send({ email: "b@example.com", password: "wrong-password" })
      .expect(401);
  });

  it("never returns the password hash in API responses", async () => {
    const res = await register("c@example.com").expect(201);
    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${res.body.token}`)
      .expect(200);
    assert.equal(me.body.user.password, undefined);
  });
});

describe("admin role", () => {
  it("is never granted just by registering with a particular email", async () => {
    // The old hard-coded admin address must now get an ordinary account.
    const res = await register("rzeqiri03@gmail.com").expect(201);
    assert.equal(res.body.user.role, "user");

    await request(app)
      .post("/api/auth/login")
      .send({ email: "rzeqiri03@gmail.com", password: "correct-horse-1" })
      .expect(200)
      .then((login) => assert.equal(login.body.user.role, "user"));

    await request(app)
      .get("/api/bookings?scope=all")
      .set("Authorization", `Bearer ${res.body.token}`)
      .expect(200)
      .then((list) => assert.equal(list.body.bookings.length, 0));

    const stored = await User.findOne({ email: "rzeqiri03@gmail.com" }).lean();
    assert.equal(stored.role, "user");
  });

  it("comes from the database role", async () => {
    const res = await register("admin@example.com").expect(201);
    await User.updateOne({ email: "admin@example.com" }, { role: "admin" });
    await request(app)
      .post("/api/destinations/seed")
      .set("Authorization", `Bearer ${res.body.token}`)
      .expect(201);
  });
});

describe("seeding destinations", () => {
  it("is refused without a token", async () => {
    await request(app).post("/api/destinations/seed").expect(401);
  });

  it("is refused for a normal user", async () => {
    const res = await register("user@example.com").expect(201);
    await request(app)
      .post("/api/destinations/seed")
      .set("Authorization", `Bearer ${res.body.token}`)
      .expect(403);
  });
});

describe("destination search", () => {
  it("treats the search text literally, not as a regular expression", async () => {
    await request(app).get("/api/destinations").query({ search: "(a+)+$" }).expect(200);
    const res = await request(app).get("/api/destinations").query({ search: ".*" }).expect(200);
    assert.equal(res.body.destinations.length, 0);
  });
});
