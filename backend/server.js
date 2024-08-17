const functions = require('firebase-functions');
const midtransClient = require('midtrans-client');

let coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'SB-Mid-server-G4zGIr1_80xa0pqHaCPLB_OW',
    clientKey: 'SB-Mid-client-tN5lJrODMKqfbgfh'
});

exports.createTransaction = functions.https.onRequest(async (req, res) => {
    try {
        const { orderDetails, user, totalAmount } = req.body;

        let parameter = {
            "payment_type": "gopay", // Or any other payment method
            "transaction_details": {
                "order_id": `order-${Math.floor(Math.random() * 1000000)}`,
                "gross_amount": totalAmount
            },
            "customer_details": {
                "first_name": orderDetails.nama,
                "phone": orderDetails.nomor,
                "address": orderDetails.alamat,
                "email": user.email
            }
        };

        const transaction = await coreApi.charge(parameter);
        res.json({ transaction });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).send('Transaction creation failed');
    }
});
