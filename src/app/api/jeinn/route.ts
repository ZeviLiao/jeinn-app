// pages/api/notifyExpireProducts.ts
// import { getExpireProductsListBroadcast } from '@/services/lineBotService';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   return NextResponse.json({ message: 'Hello, this is a GET request!' });
// }

// // Handle POST requests (if applicable)
// export async function POST(request: Request) {
//   const data = await getExpireProductsListBroadcast();
//   return NextResponse.json({ message: 'Data received', data });
// }

import { Client, middleware, MiddlewareConfig, WebhookEvent } from '@line/bot-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Setup LINE SDK configuration
const config: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || ''
};

// Create LINE client instance
const client = new Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
});

// Handle POST request
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse incoming webhook event body
    const body = await request.json();

    // Handle events from LINE webhook
    const events: WebhookEvent[] = body.events;

    // Process each event
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;
        const replyToken = event.replyToken;

        // Send reply to the user
        try {
          await client.replyMessage(replyToken, {
            type: 'text',
            text: `你說了: ${userMessage}`,
          });
        } catch (error) {
          console.error('Error replying to message:', error);
          return new Response(JSON.stringify({ message: 'Error replying to message' }), { status: 500 });
        }
      }
    }

    // Return a success response to acknowledge receipt of the webhook
    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ message: 'Error processing request' }), { status: 500 });
  }
}



