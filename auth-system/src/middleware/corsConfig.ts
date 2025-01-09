import cors from 'cors';

const allowedOrigins = [
  'http://localhost:8000',
  'https://authapp-k4sd.onrender.com',
  'https://hairpos.onrender.com',
];

const corsConfig = (isProduction: boolean) =>
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

export default corsConfig;
