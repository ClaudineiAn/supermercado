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
import { generalController } from './controllers/generalControllers.js';

// Serve static files from 'visions' directory
app.use(express.static(path.join(__dirname, '../visions')));

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../visions/index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found.');
        }
    });
});

app.get('/data', async (req, res) => {
    res.json(await generalController.load());
});

app.post('/toggleActive', (req, res) => {
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

// Export as serverless function
export const handler = serverless(app);