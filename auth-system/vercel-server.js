import { createServer } from 'http';
import app from './src/index'; // Adjust the path to your `index.ts`

const server = createServer(app);

export default async function handler(req, res) {
  await new Promise((resolve) => {
    server.emit('request', req, res);
    res.on('finish', resolve);
  });
}
