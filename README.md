# DogeCoinTrackerBot 1.0
![alt text](https://github.com/LMOlivera/DogeCoinTrackerBot/blob/main/images/dogecoin.png "Dogecoin logo")

DogeCoinTrackerBot is a Telegram bot that sends you a Telegram message when the Dogecoin's value fluctuates. You can set up the bot to tell you when it has exceeded certain value or is lower than a certain value, so you know when it is a good time to buy, hold or sell.

## How to use it
Look for "DogeCoinTracker" on Telegram. The bot is only available 18 hours a day, so the period from 12:00 to 18:00 GMT the bot will not work

### Why it's only available 18 hours a day?
I am hosting on the free plan of Heroku and I am not planning on paying for hosting this bot. The idea of this bot was to stop checking the phone too much, but the truth is that I am most active on my mobile between 12:00 and 18:00 GMT so the notifications are convenient outside of that time.

### Is it okay if I host it myself?
Sure!

## Set up for development
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
