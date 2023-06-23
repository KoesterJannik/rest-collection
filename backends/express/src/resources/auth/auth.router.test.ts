import app from "../../server";
import supertest from "supertest";
import { prisma } from "../../db";
import { generateRandomString } from "../../utils/test/utils";
import { hashPassword } from "../../utils/auth";

describe("Auth Router tests", () => {
  const randomEmail = generateRandomString(10) + "@gmail.com";
  const randomPassword = generateRandomString(10);
  let apiUserEmail: string;
  let apiUserPassword: string;
  let jwt: string;

  beforeAll(async () => {
    const hashedPw = await hashPassword(randomPassword);
    await prisma.user.create({
      data: {
        email: randomEmail,
        password: hashedPw,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("Logs in with correct data", async () => {
    const res = await supertest(app).post("/api/v1/auth/login").send({
      email: randomEmail,
      password: randomPassword,
    });

    expect(res.body.jwt).toBeDefined();
    jwt = res.body.jwt;
  });
  it("Logs in with wrong password", async () => {
    const res = await supertest(app).post("/api/v1/auth/login").send({
      email: randomEmail,
      password: "randomPassword",
    });

    expect(res.statusCode).toBe(400);
  });

  it("Logs in with wrong email", async () => {
    const res = await supertest(app).post("/api/v1/auth/login").send({
      email: "idonotexist@web.de",
      password: randomPassword,
    });

    expect(res.statusCode).toBe(400);
  });
  it("Logs in but forgots email", async () => {
    const res = await supertest(app).post("/api/v1/auth/login").send({
      password: randomPassword,
    });

    expect(res.statusCode).toBe(400);
  });
  it("Registers a new user", async () => {
    apiUserEmail = generateRandomString(10) + "@gmail.com";
    apiUserPassword = generateRandomString(10);

    const res = await supertest(app).post("/api/v1/auth/register").send({
      email: apiUserEmail,
      password: apiUserPassword,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.jwt).toBeDefined();
  });

  it("Returns 400 if user already exists", async () => {
    // Assuming `randomEmail` and `randomPassword` from the previous test
    const res = await supertest(app).post("/api/v1/auth/register").send({
      email: apiUserEmail,
      password: apiUserPassword,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
  it("Returns 400 if data is missing", async () => {
    const res = await supertest(app).post("/api/v1/auth/register").send({
      email: apiUserEmail,
    });

    expect(res.statusCode).toBe(400);
  });
});
