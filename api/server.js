// api/server.js
import express from 'express';
import { generalController } from '../controllers/generalControllers.js';

const app = express();

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const data = await generalController.load();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/toggleActive', (req, res) => {
  try {
    generalController.toggle(req.body);
    res.json({ message: 'Action received successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add other routes...

export default app;