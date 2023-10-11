const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_KEY);

app.use(express.json());
app.use(cors());

app.post('/payments', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});