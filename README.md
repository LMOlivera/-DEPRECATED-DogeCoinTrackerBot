# DogeCoinTrackerBot 1.0
![alt text](https://github.com/LMOlivera/DogeCoinTrackerBot/blob/main/images/dogecoin.png "Dogecoin logo")

DogeCoinTrackerBot is a Telegram bot that sends you a Telegram message when the Dogecoin's value fluctuates. You can set up the bot to tell you when it has exceeded certain value or is lower than a certain value, so you know when it is a good time to buy, hold or sell.

## Set up
- Install the libraries from package.json
- Then, you have to create a folder called "config" inside server.
  - Inside this folder, create a file called "dev.env", this needs to contain:
    - A Telegram bot API key (go to Telegram and create a Bot).
    - A Binance API Key and Binance Secret Key (create a Binance account and get this Keys).
    - A MongoDB URL (I suggest you install MongoDB on your local machine for this).
- Then you are ready to work! Use 'npm run dev' command for local testing.

Feel free to contact me if you have any questions or problems when setting up the bot.

## Contributing
Anyone can create a Pull request. I will personally check, merge and deploy it to Production.
