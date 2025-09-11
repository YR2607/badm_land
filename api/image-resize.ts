export default async function handler(req: any, res: any) {
  const { url, width = 400, height = 300, quality = 80 } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    // Fetch the image
    const imageResponse = await fetch(url as string);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    // Get image data as array buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Get content type
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    
    // Return the image
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
}
