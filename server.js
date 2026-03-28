const express = require('express');
const path    = require('path');

const app     = express();
const PORT    = process.env.PORT || 3000;
const API_KEY = process.env.FD_API_KEY;          // set this in Render dashboard
const FD_BASE = 'https://api.football-data.org/v4/competitions/PL';

// Proxy helper — forwards requests to football-data.org with the secret key
async function proxy(endpoint, query, res) {
  const qs  = new URLSearchParams(query).toString();
  const url = `${FD_BASE}${endpoint}${qs ? '?' + qs : ''}`;
  const r   = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
  const data = await r.json();
  res.status(r.status).json(data);
}

// Serve the front-end from /public
app.use(express.static(path.join(__dirname, 'public')));

// API routes — key never reaches the browser
app.get('/api/standings', (req, res) =>
  proxy('/standings', {}, res).catch(e => res.status(500).json({ error: e.message })));

app.get('/api/matches', (req, res) =>
  proxy('/matches', req.query, res).catch(e => res.status(500).json({ error: e.message })));

app.listen(PORT, () => console.log(`PL Tracker running on port ${PORT}`));
