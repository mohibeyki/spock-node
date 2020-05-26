import request from "supertest";
import app from "../../src/app";
import { mongoose } from "@typegoose/typegoose";

const databaseName = "testdb";

let userToken = "";
let adminToken = "";

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
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
}

describe("POST /api/v1/applications", () => {
  it("should return 200 OK", async () => {
    await request(app)
      .post("/api/v1/applications")
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        company: "Microsoft",
        position: "AI Engineer",
        submissionLink: "microsoft.com/ai",
        status: "applied",
      })
      .expect(200);
  });
  it("should return 400 Bad Request", async () => {
    const res = await request(app)
      .post("/api/v1/applications")
      .set({ authorization: `Bearer ${adminToken}` })
      .send({
        position: "AI Engineer",
        submissionLink: "microsoft.com/ai",
        status: "applied",
      })
      .expect(400);
  });
});

afterAll(async () => {
  await removeAllCollections();
  await mongoose.disconnect();
});
