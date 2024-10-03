// app/api/upload-image/route.ts
import { NextResponse } from 'next/server';
import { messagingApi } from '@line/bot-sdk';
import formidable from 'formidable';
import fs from 'fs';

// Initialize LINE client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
});

// Disable Next.js body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadImageToRichMenu(richMenuId: string, imageBuffer: Buffer) {
  const url = `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
      'Content-Type': 'image/png', // Adjust this if using a different image type
    },
    body: imageBuffer, // Directly send the image buffer
  });

  if (!response.ok) {
    throw new Error(`Error uploading image: ${response.statusText}`);
  }

  console.log('Image uploaded successfully!');
}

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
        // Read the image file as a buffer from the temporary file location provided by formidable
        const imageBuffer = fs.readFileSync(imageFile.filepath);

        // Upload the image to LINE
        await uploadImageToRichMenu(richMenuId, imageBuffer);

        resolve(NextResponse.json({ message: 'Image uploaded successfully.' }));
      } catch (error) {
        console.error('Error uploading image:', error);
        reject(NextResponse.json({ error: 'Failed to upload image to LINE' }, { status: 500 }));
      }
    });
  });
}
