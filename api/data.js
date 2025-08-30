// api/data.js
import { generalController } from '../controllers/generalControllers.js';

export default async function handler(req, res) {
  try {
    const data = await generalController.load();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};