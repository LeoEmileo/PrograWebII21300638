const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT = 'AZxAR3DL8hT8AHI9jszVPrV5buzphGTDHMbsCbVbeZ9asZtcUjj17q7XZUWKZkwz25ILm3mc1NGdBFHl';
const SECRET = 'EFzV0nkdfOaVzJid0QhJmPvBiNShroRQWgtKv9Gqiwddt5MxhzhPTU2MPEPwOc_W8SKQjVq-kOsQcUYn';
const base = 'https://api-m.sandbox.paypal.com';

async function generarToken() {
  const res = await axios({
    url: `${base}/v1/oauth2/token`,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    auth: { username: CLIENT, password: SECRET },
    data: 'grant_type=client_credentials'
  });
  return res.data.access_token;
}

router.post('/', async (req, res) => {
  const total = req.body.total;

  const accessToken = await generarToken();

  const response = await axios.post(`${base}/v2/checkout/orders`, {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'MXN',
        value: total
      }
    }],
    application_context: {
      return_url: 'http://localhost:4200/pago-exitoso',
      cancel_url: 'http://localhost:4200/pago-cancelado'
    }
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  res.json({ id: response.data.id, links: response.data.links });
});

module.exports = router;
