import { mongoose } from "@typegoose/typegoose";
import request from "supertest";
import app from "../../src/app";

const databaseName = "testdb";

let userToken = "";
let adminToken = "";

let appId = "";
let commentId = "";

beforeAll(async () => {
  const url = `mongodb://localhost:27017/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

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

  const res = await request(app)
    .post("/api/v1/applications")
    .set({ authorization: `Bearer ${adminToken}` })
    .send({
      company: "Microsoft",
      position: "AI Engineer",
      submissionLink: "microsoft.com/ai",
      status: "applied",
      submissionDate: new Date().toISOString().substr(0, 10),
    })
    .expect(200);
  appId = res.body._id;
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
}

describe("POST /api/v1/comments/:id", () => {
  it("should return 200 OK", async () => {
    commentId = (
      await request(app)
        .post(`/api/v1/comments/${appId}`)
        .set({ authorization: `Bearer ${adminToken}` })
        .send({
          text: "some comment",
        })
        .expect(200)
    ).body._id;
  });
  it("should return 400 Bad Request", async () => {
    await request(app)
      .post(`/api/v1/comments/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        invalid: "some comment",
      })
      .expect(400);
  });
  it("should return 403 Unauthorized", async () => {
    await request(app)
      .post(`/api/v1/comments/${appId}`)
      .set({ authorization: `Bearer ${userToken}` })
      .send({
        text: "some comment",
      });
  });
  it("should return 404 Not Found", async () => {
    await request(app)
      .post(`/api/v1/comments/${mongoose.Types.ObjectId()}`)
      .set({ authorization: `Bearer ${userToken}` })
      .send({
        text: "some comment",
      })
      .expect(404);
  });
});

describe("GET /api/v1/comments/:application-id", () => {
  it("should return 200 OK", async () => {
    await request(app)
      .get(`/api/v1/comments/${appId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(200);
  });
  it("should return 403 Unauthorized", async () => {
    await request(app)
      .get(`/api/v1/comments/${appId}`)
      .set({ authorization: `Bearer ${userToken}` })
      .expect(403);
  });
  it("should return 404 Not Found", async () => {
    await request(app)
      .get(`/api/v1/comments/${mongoose.Types.ObjectId()}`)
      .set({ authorization: `Bearer ${userToken}` })
      .expect(404);
  });
});

describe("DELETE /api/v1/comments/:id", () => {
  it("should return 403 Unauthorized", async () => {
    await request(app)
      .delete(`/api/v1/comments/${commentId}`)
      .set({ authorization: `Bearer ${userToken}` })
      .expect(403);
  });
  it("should return 404 Not Found", async () => {
    await request(app)
      .delete(`/api/v1/comments/${mongoose.Types.ObjectId()}`)
      .set({ authorization: `Bearer ${userToken}` })
      .expect(404);
  });
  it("should return 200 OK", async () => {
    await request(app)
      .delete(`/api/v1/comments/${commentId}`)
      .set({ authorization: `Bearer ${adminToken}` })
      .expect(200);
  });
});

afterAll(async () => {
  await removeAllCollections();
  await mongoose.disconnect();
});
