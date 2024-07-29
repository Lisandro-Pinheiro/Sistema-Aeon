const express = require('express');
const msal = require('@azure/msal-node');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos, como a página HTML e scripts

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

app.get('/auth', async (req, res) => {
  try {
    const authUrl = await cca.getAuthCodeUrl({
      scopes: ["https://graph.microsoft.com/.default"],
      redirectUri: "http://localhost:3000/callback",
    });

    res.redirect(authUrl);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/callback', async (req, res) => {
  try {
    const tokenResponse = await cca.acquireTokenByCode({
      code: req.query.code,
      scopes: ["https://graph.microsoft.com/.default"],
      redirectUri: "http://localhost:3000/callback",
    });

    const accessToken = tokenResponse.accessToken;
    res.redirect(`/calendar.html?accessToken=${accessToken}`); // Redireciona para a página do calendário com o token de acesso
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/create-event', async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];

  const event = {
    subject: req.body.subject,
    start: { dateTime: req.body.start, timeZone: 'Pacific Standard Time' },
    end: { dateTime: req.body.end, timeZone: 'Pacific Standard Time' },
  };

  try {
    const response = await axios.post('https://graph.microsoft.com/v1.0/me/events', event, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
