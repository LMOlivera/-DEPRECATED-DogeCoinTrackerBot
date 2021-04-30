// IMPORTS
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const Binance = require('node-binance-api');
const routes = require('../routes/route');
require('../database/mongoose');

// Heroku Anti-break
const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('I am a bot! Use me in Telegram!');
}
const server = http.createServer(requestListener);
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

// Heroku Anti-break
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});