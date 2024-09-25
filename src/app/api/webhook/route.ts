import { NextRequest, NextResponse } from 'next/server';
import {
  messagingApi,
  middleware,
  WebhookEvent,
  TextMessage,
  ImageMapMessage,
  TemplateMessage,
  FlexMessage,
  MiddlewareConfig
} from '@line/bot-sdk';

// 主菜單和次菜單的 ID
const mainMenuId = 'YOUR_MAIN_MENU_ID';
const subMenuId = 'YOUR_SUB_MENU_ID';

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

  // Handle each event (message events, etc.)
  const results = await Promise.all(events.map(handleEvent));

  return NextResponse.json({ results }, { status: 200 });
}

// Function to handle different event types
async function handleEvent(event: WebhookEvent) {
  if (event.type === 'message' && event.message.type === 'text') {
    const userId = event.source.userId;

    switch (event.message.text) {
      case 'a':
      case 'b':
        // 回應 A 或 B 的消息
        const replyText = `你選擇了: ${event.message.text}`;
        return handleTextMessage(event);

      case 'sub':
        // 切換到次菜單
        await client.linkRichMenuIdToUser(userId!, subMenuId);
        break;
      case 'c':
      case 'd':
        // 回應 C 或 D 的消息
        return handleTextMessage(event);

      case 'back':
        // 返回主菜單
        await client.linkRichMenuIdToUser(userId!, mainMenuId);
        break;
    }
  }

  return Promise.resolve(null);
}

// Handle text messages
async function handleTextMessage(event: any) {
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

// Handle imagemap messages
async function handleImageMapMessage(event: any) {
  const message: ImageMapMessage = {
    type: 'imagemap',
    baseUrl: 'https://example.com/imagemap',  // Replace with your image URL
    altText: 'This is an imagemap',
    baseSize: {
      width: 1040,
      height: 1040,
    },
    actions: [
      {
        type: 'uri',
        linkUri: 'https://example.com',
        area: {
          x: 0,
          y: 0,
          width: 520,
          height: 1040,
        },
      },
      {
        type: 'message',
        text: 'You clicked the right side!',
        area: {
          x: 520,
          y: 0,
          width: 520,
          height: 1040,
        },
      },
    ],
  };

  // return client.replyMessage(event.replyToken, [message]);
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [message],
  });
}

// Handle template messages
async function handleTemplateMessage(event: any) {
  const message: TemplateMessage = {
    type: 'template',
    altText: 'This is a buttons template',
    template: {
      type: 'buttons',
      thumbnailImageUrl: 'https://res.cloudinary.com/demo/image/upload/w_400/sample.jpg',
      imageAspectRatio: 'rectangle',
      imageSize: 'cover',
      imageBackgroundColor: '#FFFFFF',
      title: 'Menu',
      text: 'Please select',
      actions: [
        {
          type: 'postback',
          label: 'Buy',
          data: 'action=buy&itemid=123',
        },
        {
          type: 'message',
          label: 'Say hello',
          text: 'Hello!',
        },
      ],
    },
  };

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [message],
  });
}

// Handle flex messages
async function handleFlexMessage(event: any) {
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [{
      type: 'flex',
      altText: 'This is a flex message',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Flex Header',
              weight: 'bold',
              size: 'xl',
            },
          ],
        },
        hero: {
          type: 'image',
          url: 'https://example.com/hero.jpg',
          size: 'full',
          aspectRatio: '20:13',
          aspectMode: 'cover',
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'This is the body text of the flex message',
              wrap: true,
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: 'Go to website',
                uri: 'https://example.com',
              },
            },
          ],
        },
      },
    }],
  });
}
