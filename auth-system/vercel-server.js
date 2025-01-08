import app from './src/index'; // Adjust path as necessary
import { createServer } from 'http';

const server = createServer(app);

export default async function handler(req, res) {
  await new Promise((resolve) => {
    server.emit('request', req, res);
    res.on('finish', resolve);
  });
}
