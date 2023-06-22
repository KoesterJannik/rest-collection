import app from "../../server";
import supertest from "supertest";

describe("Auth Router tests", () => {
  it("Tests the /login endpoint", async () => {
    return await supertest(app).get("/api/v1/auth/login").expect(200);
  });
});
