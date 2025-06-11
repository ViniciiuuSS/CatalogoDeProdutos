import sharp from 'sharp';

export async function generateBlurFromBuffer(buffer: Buffer): Promise<string> {
  const resized = await sharp(buffer, { failOnError: false })
  .resize(20)
  .toFormat('webp')
  .toBuffer();


  const base64 = resized.toString('base64');
  return `data:image/webp;base64,${base64}`;
}
