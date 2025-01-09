import cors from 'cors';

const corsConfig = (isProduction: boolean) =>
  cors({
    origin: isProduction ? 'https://authapp-k4sd.onrender.com' : 'http://localhost:8000',
    credentials: true,
  });
  
export default corsConfig;
