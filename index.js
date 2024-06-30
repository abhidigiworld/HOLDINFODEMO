const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hodlinfo',
  password: '1234',
  port: 5432,
});

const app = express();
app.use(bodyParser.json());

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10);

    await pool.query('TRUNCATE TABLE storedataholdinfo');

    for (const ticker of tickers) {
      await pool.query(
        'INSERT INTO storedataholdinfo (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
        [ticker.name, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit]
      );
    }

    console.log('Data fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fetch data initially
fetchData();

// Set up a cron job to fetch data every hour
setInterval(fetchData, 3600000);

app.get('/api/tickers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM storedataholdinfo');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
