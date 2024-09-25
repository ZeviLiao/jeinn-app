import { messagingApi } from '@line/bot-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Line client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
});

// Disable Next.js body parsing
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };


// Rich Menu Operations
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { action, richMenuId, userId, richMenu, updatedMenuData } = req.body;

    console.log('zevi:', req.body);
    switch (action) {
      case 'create':
        // const newRichMenu: messagingApi.RichMenuRequest = JSON.parse(richMenu);
        // const newRichMenuId = await client.createRichMenu(newRichMenu);
        // return res.status(200).json({ richMenuId: newRichMenuId, message: 'Rich menu created successfully.' });
        return res.status(200).json({ richMenuId: richMenuId, message: 'Rich menu created successfully.' });

      case 'read':
        const richMenus = await client.getRichMenuList();
        return res.status(200).json({ richMenus });

      case 'update':
        if (!richMenuId) {
          return res.status(400).json({ error: 'Missing richMenuId.' });
        }
        await client.deleteRichMenu(richMenuId);
        const updatedRichMenu: messagingApi.RichMenuRequest = JSON.parse(updatedMenuData);
        const updatedRichMenuId = await client.createRichMenu(updatedRichMenu);
        return res.status(200).json({ richMenuId: updatedRichMenuId, message: 'Rich menu updated successfully.' });

      case 'delete':
        if (!richMenuId) {
          return res.status(400).json({ error: 'Missing richMenuId.' });
        }
        await client.deleteRichMenu(richMenuId);
        return res.status(200).json({ message: 'Rich menu deleted successfully.' });

      case 'link':
        if (!userId || !richMenuId) {
          return res.status(400).json({ error: 'Missing userId or richMenuId.' });
        }
        await client.linkRichMenuIdToUser(userId, richMenuId);
        return res.status(200).json({ message: 'Rich menu linked to user.' });

      case 'setDefault':
        if (!richMenuId) {
          return res.status(400).json({ error: 'Missing richMenuId.' });
        }
        await client.setDefaultRichMenu(richMenuId);
        return res.status(200).json({ message: 'Rich menu set as default.' });

      default:
        return res.status(400).json({ error: 'Invalid action.' });
    }
  } catch (error) {
    console.error('Error in rich menu operation:', error);
    return res.status(500).json({ error: 'Operation failed' });
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
