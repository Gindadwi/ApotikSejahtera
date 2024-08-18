const functions = require('firebase-functions');
const midtransClient = require('midtrans-client');
const cors = require('cors');

const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'SB-Mid-server-G4zGIr1_80xa0pqHaCPLB_OW',
    clientKey: 'SB-Mid-client-tN5lJrODMKqfbgfh'
});

exports.createTransaction = functions.https.onRequest((req, res) => {
    cors({ origin: 'https://apotik-sejahtera.vercel.app' })(req, res, async () => {
        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Origin', 'https://apotik-sejahtera.vercel.app');
            res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.status(204).send('');
            return;
        }

        try {
            const { orderDetails, user, totalAmount } = req.body;

            const parameter = {
                payment_type: orderDetails.paymentMethod,
                transaction_details: {
                    order_id: `order-${Math.floor(Math.random() * 1000000)}`,
                    gross_amount: totalAmount
                },
                customer_details: {
                    first_name: orderDetails.nama,
                    phone: orderDetails.nomor,
                    address: orderDetails.alamat,
                    email: user.email
                }
            };

            const transaction = await coreApi.charge(parameter);

            res.set('Access-Control-Allow-Origin', 'https://apotik-sejahtera.vercel.app');
            res.json({ transaction });

        } catch (error) {
            console.error('Error creating transaction:', error);
            res.set('Access-Control-Allow-Origin', 'https://apotik-sejahtera.vercel.app');
            res.status(500).send('Transaction creation failed');
        }
    });
});
