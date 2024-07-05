const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://user:user@crypto.yo7kyoq.mongodb.net/?retryWrites=true&w=majority&appName=crypto', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const cryptoSchema = new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String,
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

app.use(express.static('public'));

app.get('/api/crypto', async (req, res) => {
    try {
        const cryptos = await Crypto.find({});
        res.json(cryptos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const fetchDataAndStore = async () => {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const data = response.data;

        // Clear the existing data
        await Crypto.deleteMany({});

        // Insert the top 10 cryptocurrencies by volume
        const top10 = Object.values(data).sort((a, b) => b.volume - a.volume).slice(0, 10);
        top10.forEach(async (crypto) => {
            const newCrypto = new Crypto({
                name: crypto.name,
                last: crypto.last,
                buy: crypto.buy,
                sell: crypto.sell,
                volume: crypto.volume,
                base_unit: crypto.base_unit,
            });
            await newCrypto.save();
        });
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

// Fetch data every 10 minutes
setInterval(fetchDataAndStore, 300000);

// Initial fetch
fetchDataAndStore();
