import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Status & Health Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      system: 'TrustLine / Aegis Private Banking KYC Platform',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/info', (_req, res) => {
    res.json({
      appName: 'Aegis Global Private Banking & Wealth Management',
      supportedPortals: ['/superadmin', '/operations', '/compliance', '/relationship'],
      version: '2026.1.0'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TrustLine Platform] Express server running on port ${PORT}`);
  });
}

startServer();
