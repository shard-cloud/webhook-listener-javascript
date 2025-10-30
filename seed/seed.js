const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create sample webhook events
    const events = [
      {
        source: 'github',
        eventType: 'push',
        payload: {
          ref: 'refs/heads/main',
          commits: [
            {
              id: 'abc123',
              message: 'Add new feature',
              author: { name: 'John Doe', email: 'john@example.com' }
            }
          ]
        },
        headers: {
          'x-github-event': 'push',
          'x-github-delivery': '12345678-1234-1234-1234-123456789012'
        },
        ip: '192.168.1.1',
        userAgent: 'GitHub-Hookshot/abc123'
      },
      {
        source: 'stripe',
        eventType: 'payment.succeeded',
        payload: {
          id: 'evt_1234567890',
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: 'pi_1234567890',
              amount: 2000,
              currency: 'usd'
            }
          }
        },
        headers: {
          'stripe-signature': 't=1234567890,v1=abc123'
        },
        ip: '54.187.174.169',
        userAgent: 'Stripe/1.0'
      },
      {
        source: 'slack',
        eventType: 'message',
        payload: {
          type: 'message',
          text: 'Hello from Slack!',
          user: 'U1234567890',
          channel: 'C1234567890'
        },
        headers: {
          'x-slack-signature': 'v0=abc123',
          'x-slack-request-timestamp': '1234567890'
        },
        ip: '54.230.156.1',
        userAgent: 'Slackbot 1.0'
      }
    ];

    for (const event of events) {
      await prisma.webhookEvent.create({ data: event });
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
