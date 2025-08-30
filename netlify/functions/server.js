// netlify/functions/server.js
import { generalController } from '../../controllers/generalControllers.js';
import { readFile } from 'fs/promises';
import path from 'path';

const projectRoot = process.cwd();
const visionsPath = path.join(projectRoot, 'visions');

export async function handler(event, context) {
  console.log('Request received:', event.path, event.httpMethod);

  try {
    // Handle API routes
    if (event.path.startsWith('/api/')) {
      return await handleApiRequest(event);
    }

    // Handle static file requests
    if (event.path.startsWith('/static/')) {
      return await handleStaticFile(event);
    }

    // Serve the main HTML for all other routes (SPA behavior)
    return await serveIndexHtml();
    
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
}

async function handleApiRequest(event) {
  const { path, httpMethod, body } = event;
  
  switch (path) {
    case '/api/data':
      if (httpMethod === 'GET') {
        const data = await generalController.load();
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
      }
      break;

    case '/api/toggleActive':
      if (httpMethod === 'POST') {
        const requestBody = parseBody(body);
        generalController.toggle(requestBody);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Action received successfully!' })
        };
      }
      break;

    case '/api/new':
      if (httpMethod === 'POST') {
        const requestBody = parseBody(body);
        generalController.new(requestBody);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'New successfully Added!' })
        };
      }
      break;

    case '/api/delete':
      if (httpMethod === 'POST') {
        const requestBody = parseBody(body);
        generalController.deleteItem(requestBody);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Deleted successfully!' })
        };
      }
      break;

    default:
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'API endpoint not found' })
      };
  }

  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}

async function handleStaticFile(event) {
  const filePath = event.path.replace('/static/', '');
  const fullPath = path.join(visionsPath, filePath);
  
  try {
    const content = await readFile(fullPath, 'utf8');
    const contentType = getContentType(filePath);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': contentType },
      body: content
    };
  } catch (error) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'File not found' })
    };
  }
}

async function serveIndexHtml() {
  try {
    const html = await readFile(path.join(visionsPath, 'index.html'), 'utf8');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to load index.html' })
    };
  }
}

function parseBody(body) {
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

function getContentType(filename) {
  const extension = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return contentTypes[extension] || 'text/plain';
}