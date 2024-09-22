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

import { NextResponse } from 'next/server';
import axios from 'axios';

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/reply';
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN || '';  // Ensure this is set in your .env.local

type LineWebhookEvent = {
  type: string;
  replyToken: string;
  message: {
    type: string;
    text: string;
  };
};

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const events: LineWebhookEvent[] = body.events;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const replyToken = event.replyToken;
        const userMessage = event.message.text;

        // Construct the reply message
        const replyMessage = {
          replyToken: replyToken,
          messages: [
            {
              type: 'text',
              text: `你說了: ${userMessage}`, // Reply with the user's message
            },
          ],
        };

        // Send reply message to LINE Messaging API
        await axios.post(LINE_MESSAGING_API, replyMessage, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${LINE_ACCESS_TOKEN}`, // Use Bearer token for auth
          },
        });
      }
    }

    // Return success response to LINE
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
  }
}

