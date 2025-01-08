import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from './utils/passportConfig';
import connectDB from './config/db';
import sessionConfig from './config/sessionConfig';
import corsConfig from './middleware/corsConfig';
import loggingMiddleware from './middleware/logging';
import errorHandler from './middleware/errorHandler';
import routes from './routes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import notificationRoutes from './routes/notificationRoutes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || '';
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(corsConfig(isProduction));
app.use(loggingMiddleware(isProduction));
app.use(sessionConfig(isProduction));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1', routes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Serve static assets in production
if (isProduction) {
  const __dirname = path.resolve();
  // Serve static files from Vite's build folder
  app.use(express.static(path.join(__dirname, 'pos', 'dist')));

  // Serve the index.html file for any unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pos', 'dist', 'index.html'));
  });
}

// Error Handling
app.use(errorHandler);

// Process-level error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Database connection and server start
connectDB(DB_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
