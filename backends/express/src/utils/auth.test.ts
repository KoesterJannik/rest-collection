import {
  generateAccessToken,
  hashPassword,
  verifyAccessToken,
  verifyPassword,
} from "./auth";
import { generateRandomString } from "./test/utils";

describe("Various utils functions used in that application", () => {
  it("hashes a password and decrypts it", async () => {
    const randomPassword = generateRandomString(10);
    const hashedPassword = await hashPassword(randomPassword);
    const werePasswordsValid = await verifyPassword(
      randomPassword,
      hashedPassword
    );
    expect(werePasswordsValid).toBe(true);
  });

  it("Creates a jwt and decrypts it", () => {
    const payload = {
      email: generateRandomString(10) + "@gmail.com",
      id: generateRandomString(10),
    };
    const token = generateAccessToken(payload);
    const decryptedPayload = verifyAccessToken(token);
    expect(decryptedPayload.email).toBe(payload.email);
    expect(decryptedPayload.id).toBe(payload.id);
  });
});
