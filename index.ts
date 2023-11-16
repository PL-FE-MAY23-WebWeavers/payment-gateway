import express from 'express';
import 'dotenv/config';
import cors, { CorsOptions } from 'cors';
import { paymentRoutes } from './src/routes/payment.routes';

const PORT = Number(process.env.PORT);

const stripeApp = express();

// CORS configuration

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'development') {
      // Allow all origins in development
      callback(null, true);
    } else {
      // Restrict origins in production
      const whitelist = [
        'https://pl-fe-may23-webweavers.github.io/product_catalog/',
        'https://localhost:5001',
      ];
      if (whitelist.indexOf(origin as string) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
};

stripeApp.use(cors(corsOptions));

stripeApp.use('/payment', paymentRoutes);
stripeApp.use('/', (req, res) => {
  res.send('Payment gateway');
});
stripeApp.listen(4242, () =>
  console.log('Payment gateway running on port 4242')
);
