import app from "./server";

beforeEach(() => {
  console.log("beforeEach");
});

test("Test Express Server", () => {
  expect(app).toBeDefined();
});
