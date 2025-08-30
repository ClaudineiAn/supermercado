// api/data.js
import { generalController } from '../controllers/generalControllers.js';

export default async function handler(request, response) {
  try {
    const data = await generalController.load();
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
