const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

const VERIFICATION_TOKEN = 'cardquest_2025_ebay_auth_verification';
const ENDPOINT_URL = 'https://77c2-2603-8000-b200-d551-a0f4-acf3-bcae-2e50.ngrok-free.app/webhook'; // Use current ngrok URL

// Handle eBay's challenge verification
app.get('/webhook', (req, res) => {
  const challengeCode = req.query.challenge_code;
  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const hash = crypto.createHash('sha256');
  hash.update(challengeCode + VERIFICATION_TOKEN + ENDPOINT_URL);
  const challengeResponse = hash.digest('hex');

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ challengeResponse });
});

// Handle webhook events
app.post('/webhook', (req, res) => {
  console.log('🔔 Webhook received:', req.body);
  res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
});
