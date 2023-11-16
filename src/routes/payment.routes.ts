/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import { paymentController } from '../controller/payment.controller';

export const paymentRoutes = express.Router();
const bodyParser = require('body-parser');

paymentRoutes.use(express.urlencoded({ extended: true }));
paymentRoutes.post('/create-checkout-session', paymentController.createSession);
paymentRoutes.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  paymentController.createWebhook
);
