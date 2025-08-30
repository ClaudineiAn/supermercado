import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generalController } from './controllers/generalControllers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory (go up one level from /api)
const rootDir = path.join(__dirname, '..');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(rootDir));

app.get('/', (req, res) => {
    const filePath = path.join(rootDir, 'visions', 'index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found.');
        }
    });
});

// ... rest of your API routes remain the same
app.get('/data', async (req, res) => {
    res.json(await generalController.load());
});

app.post('/api/toggleActive', (req, res) => {
    const data = req.body;
    generalController.toggle(data);
    res.json({
        message: 'Action received successfully!'
    });
});

app.post('/new', (req, res) => {
    const data = req.body;
    generalController.new(data);
    res.json({
        message: 'New successfully Added!'
    });
});

app.post('/delete', (req, res) => {
    const data = req.body;
    generalController.deleteItem(data);
    res.json({
        message: 'Deleted successfully!'
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;