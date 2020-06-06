import request from "supertest";
import app from "../src/app";
import { mongoose } from "@typegoose/typegoose";

const databaseName = "testdb";
beforeAll(async () => {
  const url = `mongodb://localhost:27017/${databaseName}`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
}

describe("GET /api/v1", () => {
  it("should return 200 OK", async () => {
    return await request(app).get("/api/v1").expect(200);
  });
});

describe("GET /api/v1/ise", () => {
  it("should return 500 Internal Server Error", async () => {
    return await request(app).get("/api/v1/ise").expect(500);
  });
});

afterAll(async () => {
  await removeAllCollections();
  await mongoose.disconnect();
});
