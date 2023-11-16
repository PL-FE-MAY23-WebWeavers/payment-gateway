import { apiServices } from '../service/api.services';

/* eslint-disable @typescript-eslint/no-var-requires */

const stripeKey = process.env.STRIPE_TEST_KEY;
const stripe = require('stripe')(stripeKey);

const BASE_URL = process.env.STRIPE_URL;
const frontUrl = process.env.CLIENT_URL;
export const products = async () => {
  try {
    const all = await apiServices.getAll();
    if (all) {
      all.forEach(
        async (product) =>
          // async (product) => await stripe.products.del(product.phoneId)
          await stripe.products.del({
            id: product.itemId,
            active: true,
            created: product.createdAt,
            default_price_data: {
              created: product.createdAt,
              currency: 'pln',
              metadata: {},
              tax_behavior: 'unspecified',
              unit_amount: product.price,
            },
            images: [BASE_URL + product.image],
            name: product.name,
            shippable: true,
            statement_descriptor: 'Nice Gadgets',
            tax_code: 'txcd_34021000',
            url: `${frontUrl}#/phones/:${product.phoneId}`,
          })
      );
    }
  } catch (err) {
    throw new Error(`${err}`);
  }
};

// export const getProducts = async () => {
//   try {
//     const prices = await stripe.prices.list({
//       limit: 20,
//     });
//     console.log(prices);
//     // const all = await apiServices.getAll();
//     if (prices) {
//       await prices.data.forEach(async (price: { id: string }) => {
//         console.log(price.id);
//         await stripe.prices.update(price.id, { active: false });
//       });
//     }

//     return products;
//   } catch (err) {
//     throw new Error(`${err}`);
//   }
// };
