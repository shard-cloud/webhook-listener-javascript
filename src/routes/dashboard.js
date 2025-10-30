const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

async function dashboardRoutes(fastify, options) {
  // Dashboard stats
  fastify.get('/dashboard/stats', async (request, reply) => {
    try {
      const [totalEvents, sources, eventTypes] = await Promise.all([
        prisma.webhookEvent.count(),
        prisma.webhookEvent.groupBy({
          by: ['source'],
          _count: { source: true }
        }),
        prisma.webhookEvent.groupBy({
          by: ['eventType'],
          _count: { eventType: true }
        })
      ]);

      return {
        totalEvents,
        sources: sources.map(s => ({ name: s.source, count: s._count.source })),
        eventTypes: eventTypes.map(e => ({ name: e.eventType, count: e._count.eventType }))
      };
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error);
      reply.status(500).send({ error: 'Failed to fetch stats' });
    }
  });

  // Recent events
  fastify.get('/dashboard/recent', async (request, reply) => {
    try {
      const limit = parseInt(request.query.limit) || 10;
      const events = await prisma.webhookEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          source: true,
          eventType: true,
          createdAt: true
        }
      });

      return { events };
    } catch (error) {
      logger.error('Error fetching recent events:', error);
      reply.status(500).send({ error: 'Failed to fetch recent events' });
    }
  });
}

module.exports = dashboardRoutes;
