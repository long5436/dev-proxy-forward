import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import proxy from 'express-http-proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 8888;
const BACKEND_URL: string = process.env.BACKEND_URL || '';
const FRONTEND_URL: string = process.env.FRONTEND_URL || '';

const app = express();

const corsOptions = {
  origin: '*',
  // Headers : '*'
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

// app.use(express.static('public'))

const wsProxy = createProxyMiddleware(`ws://${FRONTEND_URL}`, {
  changeOrigin: true,
});

app.use('/api', proxy(BACKEND_URL));
app.use(wsProxy);
app.use('/', proxy(FRONTEND_URL));

app.listen(PORT, () => {
  console.log('app running on http://localhost:' + PORT);
});
