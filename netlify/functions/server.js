// netlify/functions/server.js
import bodyParser from 'body-parser';
import express from 'express';
import serverless from 'serverless-http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import your controller
import { generalController } from '../../controllers/generalControllers.js';

// Serve static files from 'visions' directory with proper MIME types
app.use('/static', express.static(path.join(__dirname, '../../visions'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// API routes
app.get('/api/data', async (req, res) => {
  res.json(await generalController.load());
});

app.post('/api/toggleActive', (req, res) => {
  const data = req.body;
  generalController.toggle(data);
  res.json({ message: 'Action received successfully!' });
});

app.post('/api/new', (req, res) => {
  const data = req.body;
  generalController.new(data);
  res.json({ message: 'New successfully Added!' });
});

app.post('/api/delete', (req, res) => {
  const data = req.body;
  generalController.deleteItem(data);
  res.json({ message: 'Deleted successfully!' });
});

// For all other routes, serve the main HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../visions/index.html'));
});

export const handler = serverless(app);