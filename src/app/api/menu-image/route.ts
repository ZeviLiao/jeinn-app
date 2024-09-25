// app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import { Client } from '@line/bot-sdk';
import formidable from 'formidable';
import fs from 'fs';

// Initialize LINE client
const client = new Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
});

// Disable Next.js body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Rich Menu Image Upload Handler
export async function POST(req: Request) {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        return reject(NextResponse.json({ error: 'Failed to parse form' }, { status: 400 }));
      }

      const richMenuId = Array.isArray(fields.richMenuId) ? fields.richMenuId[0] : fields.richMenuId;
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

      if (!richMenuId || !imageFile) {
        return reject(NextResponse.json({ error: 'Missing richMenuId or image file.' }, { status: 400 }));
      }

      try {
        // Read the image file as a buffer
        const imageBuffer = fs.readFileSync(imageFile.filepath);

        // Upload the image to LINE
        await client.setRichMenuImage(richMenuId, imageBuffer, 'image/jpeg');

        resolve(NextResponse.json({ message: 'Image uploaded successfully.' }));
      } catch (error) {
        console.error('Error uploading image:', error);
        reject(NextResponse.json({ error: 'Failed to upload image to LINE' }, { status: 500 }));
      }
    });
  });
}
