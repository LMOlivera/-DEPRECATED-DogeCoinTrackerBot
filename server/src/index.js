// IMPORTS
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const Binance = require('node-binance-api');
const routes = require('../routes/route');
require('../database/mongoose');

// Anti-break
const server = http.createServer(app);
const port = process.env.PORT || 3000;


// API KEYS AND SECRETS
const BOT_API_KEY = process.env.BOT_API_KEY;
const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_SECRET = process.env.BINANCE_SECRET;


// CONFIG
const BINANCE_CONFIG = new Binance().options({
  APIKEY: BINANCE_API_KEY,
  APISECRET: BINANCE_SECRET
});
const BOT = new TelegramBot(BOT_API_KEY, {polling: true});


// Commands in Bot
routes(BOT, BINANCE_CONFIG);

// Anti-break
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});