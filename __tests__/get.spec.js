const app = require("../server");
const request = require("supertest");
const { expect, beforeAll } = require("@jest/globals");



describe("Test Handlers", () => {

  test("responds to /", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/auctions");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });

  test("responds to /auctions/:id", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/auctions/6711c034b2e1f0216158a5b1");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });

  test("responds to /", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/reviews");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });

  test("responds to /reviews/:id", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/reviews/671d1b58f9ca76fc66025f22");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });

  test("responds to /", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/stores");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });

  test("responds to /stores/:id", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/stores/671d1f83f9ca76fc66025f23");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });

  test("responds to /", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/users");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });

  test("responds to /users/:id", async () => {
    setTimeout(async() => {
        const response = await request(app).get("/users/6711bf51b2e1f0216158a5b0");
        expect(response.statusCode).toBe(200);
    }, 2000)
  });
});
