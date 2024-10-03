import { messagingApi } from '@line/bot-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Line client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
});

// Rich Menu Operations
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, richMenuId, userId, richMenu, updatedMenuData, aliasId } = body;

    console.log('Request Body:', body);

    switch (action) {
      case 'create':
        if (!richMenu) {
          return NextResponse.json({ error: 'Missing richMenu data.' }, { status: 400 });
        }
        const newRichMenuId = await client.createRichMenu(richMenu);
        return NextResponse.json(newRichMenuId);

      case 'read':
        const richMenus = await client.getRichMenuList();
        return NextResponse.json(richMenus);

      case 'update':
        if (!richMenuId) {
          return NextResponse.json({ error: 'Missing richMenuId.' }, { status: 400 });
        }
        await client.deleteRichMenu(richMenuId);
        // const updatedRichMenu: messagingApi.RichMenuRequest = JSON.parse(updatedMenuData || '{}');
        const updatedRichMenuId = await client.createRichMenu(updatedMenuData);
        return NextResponse.json(updatedRichMenuId);

      case 'delete':
        if (!richMenuId) {
          return NextResponse.json({ error: 'Missing richMenuId.' }, { status: 400 });
        }
        await client.deleteRichMenu(richMenuId);
        return NextResponse.json({ message: 'Rich menu deleted successfully.' });

      case 'link':
        if (!userId || !richMenuId) {
          return NextResponse.json({ error: 'Missing userId or richMenuId.' }, { status: 400 });
        }
        await client.linkRichMenuIdToUser(userId, richMenuId);
        return NextResponse.json({ message: 'Rich menu linked to user.' });

      case 'setDefault':
        if (!richMenuId) {
          return NextResponse.json({ error: 'Missing richMenuId.' }, { status: 400 });
        }
        await client.setDefaultRichMenu(richMenuId);
        return NextResponse.json({ message: 'Rich menu set as default.' });

      case 'alias':
        if (!aliasId || !richMenuId) {
          return NextResponse.json({ error: 'Missing aliasId or richMenuId.' }, { status: 400 });
        }
        await client.createRichMenuAlias({
          richMenuAliasId: aliasId,
          richMenuId: richMenuId,
        });
        return NextResponse.json({ message: `Rich menu alias '${aliasId}' created successfully.` });

      default:
        return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in rich menu operation:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}

// post menu body.
// {
//   "action": "create",
//   "richMenu": {
//     "size": {
//       "width": 2500,
//       "height": 1686
//     },
//     "selected": true,
//     "name": "Main Menu",
//     "chatBarText": "Tap to open",
//     "areas": [
//       {
//         "bounds": {
//           "x": 0,
//           "y": 0,
//           "width": 1250,
//           "height": 843
//         },
//         "action": {
//           "type": "postback",
//           "data": "action=buy"
//         }
//       },
//       {
//         "bounds": {
//           "x": 1250,
//           "y": 0,
//           "width": 1250,
//           "height": 843
//         },
//         "action": {
//           "type": "uri",
//           "uri": "https://example.com"
//         }
//       }
//     ]
//   }
// }

// create
// {
//   "richMenuId": {
//       "richMenuId": "richmenu-625cfd2f65ade6ae049741daf9c85059"
//   },
//   "message": "Rich menu created successfully."
// }