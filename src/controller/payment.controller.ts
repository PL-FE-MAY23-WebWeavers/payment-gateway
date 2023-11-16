/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import 'dotenv/config';

import { Request, Response } from 'express';

const testKey = process.env.STRIPE_TEST_KEY;
const stripe = require('stripe')(testKey);

const endpointSecret = process.env.ENDPOINT_SECRET;

const frontUrl = process.env.CLIENT_URL;

const fulfillOrder = (lineItems: any) => {
  console.log('Fulfilling order', lineItems);
};

// const createSession = (req: Request, res: Response) => {
//   res.send('OK');
// };
const createSession = async (req: Request, res: Response) => {
  console.log(req.body);
  const order = req.body.cart.split('-');
  order.pop();

  const order_items = order.map((line: string) => {
    const lineSplit = line.split(':');
    return [lineSplit[0], lineSplit[1], lineSplit[2]];
  });

  const line_items: {
    price_data: {
      currency: string;
      product_data: { name: any };
      unit_amount: number;
    };
    quantity: any;
  }[] = [];

  order_items.forEach((item: any[]) => {
    line_items.push({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item[0],
        },
        unit_amount: item[2],
      },
      quantity: item[1],
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: `${frontUrl}/#/success`,
    cancel_url: `${frontUrl}/#/cancel`,
  });

  res.redirect(303, session.url);
};

const createWebhook = async (request: Request, response: Response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      }
    );
    const lineItems = sessionWithLineItems.line_items;

    // Fulfill the purchase...
    fulfillOrder(lineItems);
  }

  response.status(200).end();
};

export const paymentController = {
  createSession,
  createWebhook,
};
