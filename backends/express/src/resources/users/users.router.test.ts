import app from "../../server";
import supertest from "supertest";
import { prisma } from "../../db";
import { generateRandomString } from "../../utils/test/utils";
import { hashPassword } from "../../utils/auth";

describe("Auth Router tests", () => {
  const randomEmail = generateRandomString(10) + "@gmail.com";
  const randomPassword = generateRandomString(10);
  let jwt: string;

  beforeAll(async () => {
    const hashedPw = await hashPassword(randomPassword);
    await prisma.user.create({
      data: {
        email: randomEmail,
        password: hashedPw,
      },
    });
    const res = await supertest(app).post("/api/v1/auth/login").send({
      email: randomEmail,
      password: randomPassword,
    });

    expect(res.body.jwt).toBeDefined();
    jwt = res.body.jwt;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("tries to access a protected route", async () => {
    console.log("JWT", jwt);
    const res = await supertest(app)
      .get("/api/v1/users/me")
      .set({
        Authorization: `Bearer ${jwt}`,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(randomEmail);
  });
  it("tries to access a protected route without a jwt", async () => {
    console.log("JWT", jwt);
    const res = await supertest(app).get("/api/v1/users/me");

    expect(res.statusCode).toBe(401);
  });

  it("tries to change password with valid input", async () => {
    const res = await supertest(app)
      .put("/api/v1/users/change-password")
      .set({
        Authorization: `Bearer ${jwt}`,
      })
      .send({
        oldPassword: randomPassword,
        newPassword: "newPassword",
      });

    expect(res.statusCode).toBe(200);
  });
  it("tries to change password with invalid input", async () => {
    const res = await supertest(app)
      .put("/api/v1/users/change-password")
      .set({
        Authorization: `Bearer ${jwt}`,
      })
      .send({
        oldPassword: "randomPassword",
        newPassword: "newPassword",
      });

    expect(res.statusCode).toBe(400);
  });
});
