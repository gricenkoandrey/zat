import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // API to upload and permanently save the background photo to server
  app.post('/api/upload-bg', (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const publicDir = path.resolve(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const targetPath = path.join(publicDir, 'default_user_bg.jpg');
      fs.writeFileSync(targetPath, buffer);

      return res.json({ success: true, url: '/default_user_bg.jpg?t=' + Date.now() });
    } catch (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ error: 'Failed to save background image' });
    }
  });

  // API to check server background
  app.get('/api/bg-status', (req, res) => {
    const targetPath = path.resolve(process.cwd(), 'public', 'default_user_bg.jpg');
    res.json({
      exists: fs.existsSync(targetPath),
      url: '/default_user_bg.jpg',
    });
  });

  // Serve static public assets (images, audio) directly
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
