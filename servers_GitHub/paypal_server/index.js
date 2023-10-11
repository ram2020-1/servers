const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const paypal = require('paypal-rest-sdk');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Configure PayPal SDK with your credentials
paypal.configure({
    mode: 'live', // Set to 'live' for production
    client_id: 'AQ9E-cy9P45VOGHSqNxGn7GdmR6gRidDqxJ6rD2czj1gdeOdoSXsJ-0LGzwExt6CM4KnU8tFTJMvqZnl',
    client_secret: 'EFfv5-jmqJdYU9bI7ZktIwpMRwhhoNLMHY3w4qfWwo96qykHuL2im3nyraSAkp2-_Vv5yABtnJgEkcTF',
});

// Define an endpoint to handle order creation
app.post('/api/orders', (req, res) => {
    const { amount, currency = 'EUR' } = req.body;

    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        transactions: [
            {
                amount: {
                    total: amount,
                    currency,
                },
            },
        ],
        redirect_urls: {
            return_url: '/success',
            cancel_url: '/cancel',
        },
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to create payment' });
        } else {
            console.log('Create Payment Response');
            console.log(payment);
            res.json({ paymentID: payment.id });
        }
    });
});

// Define an endpoint to handle payment execution
app.get('/api/execute-payment', (req, res) => {
    const { paymentID, payerID } = req.query;

    const execute_payment_json = {
        payer_id: payerID,
    };

    paypal.payment.execute(paymentID, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to execute payment' });
        } else {
            console.log('Execute Payment Response');
            console.log(payment);
            res.json({ message: 'Payment executed successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});