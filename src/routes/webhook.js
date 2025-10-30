const { PrismaClient } = require("@prisma/client");
const logger = require("../utils/logger");

const prisma = new PrismaClient();

const webhookSchema = {
  type: "object",
  required: ["source", "eventType", "payload"],
  properties: {
    source: { type: "string" },
    eventType: { type: "string" },
    payload: { type: "object" },
  },
};

async function webhookRoutes(fastify, options) {
  // Receive webhook
  fastify.post(
    "/webhook",
    {
      schema: {
        body: webhookSchema,
      },
    },
    async (request, reply) => {
      try {
        const { source, eventType, payload } = request.body;
        const headers = request.headers;
        const ip = request.ip;
        const userAgent = request.headers["user-agent"];

        const event = await prisma.webhookEvent.create({
          data: {
            source,
            eventType,
            payload,
            headers,
            ip,
            userAgent,
          },
        });

        logger.info("Webhook received", {
          id: event.id,
          source,
          eventType,
        });

        return {
          success: true,
          eventId: event.id,
          message: "Webhook received successfully",
        };
      } catch (error) {
        logger.error("Error processing webhook:", error);
        reply.status(500).send({ error: "Failed to process webhook" });
      }
    }
  );

  // Get webhook events
  fastify.get("/webhook/events", async (request, reply) => {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 20;
      const source = request.query.source;
      const eventType = request.query.eventType;

      const where = {};
      if (source) where.source = source;
      if (eventType) where.eventType = eventType;

      const [events, total] = await Promise.all([
        prisma.webhookEvent.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.webhookEvent.count({ where }),
      ]);

      return {
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Error fetching events:", error);
      reply.status(500).send({ error: "Failed to fetch events" });
    }
  });

  // Get event by ID
  fastify.get("/webhook/events/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const event = await prisma.webhookEvent.findUnique({
        where: { id },
      });

      if (!event) {
        return reply.status(404).send({ error: "Event not found" });
      }

      return event;
    } catch (error) {
      logger.error("Error fetching event:", error);
      reply.status(500).send({ error: "Failed to fetch event" });
    }
  });
}

module.exports = webhookRoutes;
