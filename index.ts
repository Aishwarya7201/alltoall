const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');

const app = express();
const port = 3003;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

async function fetchConversionRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const url = `https://open.er-api.com/v6/latest/${fromCurrency}`;
    return new Promise((resolve, reject) => {
        https.get(url, (res:any) => {
            let data = '';
            res.on('data', (chunk: string) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    const rate = jsonData.rates[toCurrency];
                    if (typeof rate === 'number') {
                        resolve(rate);
                    } else {
                        reject(new Error(`Rate is not a number for currency: ${toCurrency}`));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (err:any) => {
            reject(err);
        });
    });
}

async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
        const rate = await fetchConversionRate(fromCurrency, toCurrency);
        return amount * rate;
    } catch (error:any) {
        throw new Error(`Error converting currency: ${error.message}`);
    }
}

app.post('/api/convert', async (req:any, res:any) => {
    const { amount, fromCurrency, toCurrency } = req.body;

    try {
        const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
        res.json({ convertedAmount });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
