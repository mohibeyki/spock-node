import request from "supertest";
import app from "../../src/app";
import { mongoose } from "@typegoose/typegoose";

const databaseName = "testdb";
beforeAll(async () => {
  const url = `mongodb://localhost:27017/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

let userToken = "";
let adminToken = "";

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
}

describe("POST /api/v1/users", () => {
  it("should return 200 OK", async () => {
    adminToken = (
      await request(app)
        .post("/api/v1/users")
        .send({
          username: "admin",
          password: "adminpassword",
          email: "admin@test.com",
        })
        .expect(200)
    ).body.token;
    userToken = (
      await request(app)
        .post("/api/v1/users")
        .send({
          username: "user",
          password: "userpassword",
          email: "user@test.com",
        })
        .expect(200)
    ).body.token;
  });
  it("should return 400", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        username: "user",
        password: "pass",
        email: "user@test.com",
      })
      .expect(400);
  });
  it("should return 401 Unauthorized", async () => {
    return await request(app).get("/api/v1/users").expect(401);
  });
  it("should return 409", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        username: "user",
        password: "userpassword",
        email: "user@test.com",
      })
      .expect(409);
  });
});

describe("POST /api/v1/users/signin", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .post("/api/v1/users/signin")
      .send({ email: "user@test.com", password: "userpassword" })
      .expect(200);
    expect(res.body.token).toBeTruthy();
  });

  it("should return 200 OK", async () => {
    const res = await request(app)
      .post("/api/v1/users/signin")
      .send({ email: "admin@test.com", password: "adminpassword" })
      .expect(200);
    expect(res.body.token).toBeTruthy();
  });

  it("should return 400 Bad Request", async () => {
    await request(app)
      .post("/api/v1/users/signin")
      .send({ email: "u", password: "userpassword" })
      .expect(400);
  });

  it("should return 404 Not Found", async () => {
    await request(app)
      .post("/api/v1/users/signin")
      .send({ email: "username@test.com", password: "password" })
      .expect(404);
  });
});

describe("GET /api/v1/users with userToken", () => {
  it("should return 403 unauthorized", async () => {
    await request(app)
      .get("/api/v1/users")
      .set({ authorization: `Bearer ${userToken}` })
      .expect(403);
  });
});

describe("GET /api/v1/users with adminToken", () => {
  it("should return 200", async () => {
    await request(app)
      .get("/api/v1/users")
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(200);
  });
});

afterAll(async () => {
  await removeAllCollections();
  await mongoose.disconnect();
});
