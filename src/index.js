const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const rateLimit = require('@fastify/rate-limit');
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');
const webhookRoutes = require('./routes/webhook');
const dashboardRoutes = require('./routes/dashboard');

const prisma = new PrismaClient();

// Register plugins
fastify.register(cors, {
  origin: true,
  credentials: true
});

fastify.register(helmet);

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Register routes
fastify.register(webhookRoutes, { prefix: '/api' });
fastify.register(dashboardRoutes, { prefix: '/api' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  logger.error('Error occurred:', error);
  reply.status(500).send({ error: 'Internal Server Error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    logger.info('Server started successfully');
  } catch (err) {
    logger.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
