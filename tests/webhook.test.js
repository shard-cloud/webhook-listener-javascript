const { PrismaClient } = require("@prisma/client");
const fastify = require("fastify");

const prisma = new PrismaClient();

describe("Webhook API", () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    await app.register(require("../src/routes/webhook"), { prefix: "/api" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.webhookEvent.deleteMany();
  });

  test("POST /api/webhook should create a new webhook event", async () => {
    const webhookData = {
      source: "test",
      eventType: "test.event",
      payload: { message: "test" },
    };

    const response = await app.inject({
      method: "POST",
      url: "/api/webhook",
      payload: webhookData,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.eventId).toBeDefined();
  });

  test("GET /api/webhook/events should return paginated events", async () => {
    // Create test events
    await prisma.webhookEvent.createMany({
      data: [
        {
          source: "test1",
          eventType: "test.event1",
          payload: { message: "test1" },
          headers: {},
          ip: "127.0.0.1",
        },
        {
          source: "test2",
          eventType: "test.event2",
          payload: { message: "test2" },
          headers: {},
          ip: "127.0.0.1",
        },
      ],
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/webhook/events",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.events).toHaveLength(2);
    expect(body.pagination.total).toBe(2);
  });
});
