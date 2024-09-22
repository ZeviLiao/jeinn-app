// ref : https://dlackty.com/line-messaging-api-sdk-revamped

import { NextRequest, NextResponse } from 'next/server';
import { messagingApi, middleware, TextMessage, WebhookEvent, MiddlewareConfig } from '@line/bot-sdk';

const config: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

// Initialize Line client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
});

// POST request handler for Line webhook
export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-line-signature');

  // Verify the request signature
  if (!signature || !middleware(config)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = await req.json();
  const events: WebhookEvent[] = body.events;

  // Handle each event (only handling message events)
  const results = await Promise.all(events.map(handleEvent));

  return NextResponse.json({ results }, { status: 200 });
}

// Function to handle different event types
async function handleEvent(event: WebhookEvent) {
  if (event.type === 'message' && event.message.type === 'text') {
    // Reply to text message
    const replyText = `你說了: ${event.message.text}`;

    const message: TextMessage = {
      type: 'text',
      text: replyText,
    };

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [message],
    });
  }

  // Ignore other event types for now
  return Promise.resolve(null);
}
