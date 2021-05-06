const User = require('../models/User');

const STANDARD_MENU = {
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
            ['Tell me what is the value of Dogecoin'],
            ['I want to set a few reminders'],
            ['Delete all my data']
        ],
    }
};

const REMINDER_MENU = {
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
            ['Tell me when Dogecoin exceeds a certain value'],
            ['Tell me when Dogecoin is worth less than a certain value'],
            ['Delete all my reminders'],
            ['Take me back to the main menu']
        ],
    }
};

function hooks(bot, binance) {
    // "/start" command, when the user starts the bot
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const ourChatId = await User.findOne({chatId}).exec();

        // Check if user exists on database or not
        if (ourChatId) {
            await bot.sendMessage(chatId, `Hello ${msg.chat.first_name}! It's good to see you again, what do you need today?`, STANDARD_MENU);

        } else {         
            let ticker = await binance.prices();
            let dogeUSDCurrentValue = ticker.DOGEUSDT;  

            await bot.sendMessage(chatId, "Hello!");
            await bot.sendMessage(chatId,
                                `I will let you know whenever the Dogecoin USD value (current value: ${dogeUSDCurrentValue}) fluctuates, so you know when it's a good idea to buy and when to hold or sell.`
            );
            await bot.sendMessage(chatId,
                                `But first, I need some data from you. This is what I will be using:\n1- Your name.\n2- Our chatId (this let's me know it's you and not some other person).\n\nIs this okay for you? I can't work without this data.`,
                                {
                                    reply_markup: {
                                        resize_keyboard: true,
                                        one_time_keyboard: true,
                                        keyboard: [
                                            ['Yes'],
                                            ['No']
                                        ]
                                    }
                                }
            );   

        }
    });
    
    
    bot.onText(/\/max (.+)/, async (msg, match) => {
        try {
            const maxValue = match[1].replace(',', '.');
            if (Number.isNaN(maxValue)) {
                await bot.sendMessage(msg.chat.id, `I can only set up reminders with numbers, please look at the example and try again.`);
            } else {
                await bot.sendMessage(msg.chat.id, `I will set up a reminder for this value. Give me a second.`);
                await User.findOneAndUpdate({chatId: msg.chat.id}, {maxReminder: maxValue}).exec();
                await bot.sendMessage(msg.chat.id, `Done! I will let you know when Dogecoin exceeds ${maxValue}.`, STANDARD_MENU);
            }
            
        } catch(e) {
            // TODO: Send error email
            await bot.sendMessage(msg.chat.id, `Mmm... Something went wrong, please try again.`, STANDARD_MENU);
            console.log(e);
        }
    });  
    
    bot.onText(/\/min (.+)/, async (msg, match) => {
        try {
            const minValue = match[1].replace(',', '.');
            if (Number.isNaN(maxValue)) {
                await bot.sendMessage(msg.chat.id, `I can only set up reminders with numbers, please look at the example and try again.`);
            } else {
                await bot.sendMessage(msg.chat.id, `I will set up a reminder for this value. Give me a second.`);
                await User.findOneAndUpdate({chatId: msg.chat.id}, {minReminder: minValue}).exec();
                await bot.sendMessage(msg.chat.id, `Done! I will let you know when Dogecoin is lower than ${minValue}.`, STANDARD_MENU);
            }
        } catch(e) {
            // TODO: Send error email
            await bot.sendMessage(msg.chat.id, `Mmm... Something went wrong, please try again.`, STANDARD_MENU);
            console.log(e);
        }
      });

    
    // Responses for buttons
    bot.on('message', async (msg) => {
        const userCommand = msg.text.toString().toLowerCase();
        
        switch(userCommand) {
            /****************************************************** FIRST /start ******************************************************/
            case 'no':
                await bot.sendMessage(msg.chat.id, 'Okay then, it\'s your choice. If you wish to change your answer, just type "/start".');
                break;

            case 'yes':
                try{
                    let userExists = await User.findOne({chatId: msg.chat.id}).exec();

                    if (userExists) {
                        await bot.sendMessage(msg.chat.id, `Hey ${msg.chat.first_name}, it seems you already exist in my database.`, STANDARD_MENU);
                    } else {
                        await bot.sendMessage(msg.chat.id, `Okay ${msg.chat.first_name}! Give me a second while I process some data.`);    

                        const newUser = await new User({chatId: msg.chat.id});
                        await newUser.save();

                        await bot.sendMessage(msg.chat.id, 'I am ready to work! Please interact with me using the buttons on the screen.', STANDARD_MENU);
                    }

                } catch(e) {
                    // TODO: Send error email
                    await bot.sendMessage(msg.chat.id, `Mmm... Something went wrong. Please type "/start" again.`, STANDARD_MENU);
                    console.log(e);

                }                
                break;

            /****************************************************** STANDARD COMMANDS ******************************************************/
            case 'tell me what is the value of dogecoin':
                try {
                    await bot.sendMessage(msg.chat.id, 'Sure, just give me a second to check it on online.');

                    let ticker = await binance.prices();
                    let dogeUSDCurrentValue = ticker.DOGEUSDT;

                    await bot.sendMessage(msg.chat.id, `Okay ${msg.chat.first_name}, it seems Dogecoin is at USD ${dogeUSDCurrentValue}`, STANDARD_MENU);
                    
                } catch(e) {
                    // TODO: Send error email
                    await bot.sendMessage(msg.chat.id, `Mmm... Something went wrong, please try again.`, STANDARD_MENU);
                    console.log(e);
                    
                }                
                break;

            case 'delete all my data':
                await bot.sendMessage(msg.chat.id, 
                                `Hey ${msg.chat.first_name}, deleting your account is an irreversible action, are you sure you want me to delete the data I have of you?`,
                                {
                                    reply_markup: {
                                        resize_keyboard: true,
                                        one_time_keyboard: true,
                                        keyboard: [
                                            ['Yes, delete all my data'],
                                            ['No, I changed my mind']
                                        ]
                                    }
                                });
                break;

            case 'i want to set a few reminders':
                bot.sendMessage(msg.chat.id, `I can notify you whenever Dogecoin's value is useful for you, what type of reminder do you want?`, REMINDER_MENU);
                break;

            /****************************************************** REMINDER COMMANDS ******************************************************/
            case 'tell me when dogecoin exceeds a certain value':
                bot.sendMessage(msg.chat.id, `Sure, just type "/max YOUR_AMOUNT", I will let you know when Dogecoin exceeds it.\n\nExample: /max 0.26000000`);
                break;

            case 'tell me when dogecoin is worth less than a certain value':
                bot.sendMessage(msg.chat.id, `Sure, just type "/min YOUR_AMOUNT", I will let you know when Dogecoin is lower than that.\n\nExample: /min 0.26000000`);
                break;

            case 'take me back to the main menu':
                bot.sendMessage(msg.chat.id, `Okay ${msg.chat.first_name}.`, STANDARD_MENU);
                break;

            case 'delete all my reminders':
                bot.sendMessage(msg.chat.id, `Are you sure you want me to delete all your reminders, ${msg.chat.first_name}?`, {
                    reply_markup: {
                        resize_keyboard: true,
                        one_time_keyboard: true,
                        keyboard: [
                            ['Yes, delete all my reminders'],
                            ['No, I changed my mind']
                        ]
                    }
                });
                break;

            /****************************************************** DATA DELETION COMMANDS ******************************************************/
            case 'yes, delete all my reminders':
                try {
                    await User.findOneAndUpdate({chatId: msg.chat.id}, {maxReminder: null, minReminder: null}).exec();
                    await bot.sendMessage(msg.chat.id, `Okay ${msg.chat.first_name}. All your reminders were deleted. Do you need anything else?`, STANDARD_MENU);
                    
                } catch(e) {
                    // TODO: Send error email
                    await bot.sendMessage(msg.chat.id, `Mmm... Something went wrong, please try again.`, STANDARD_MENU);
                    console.log(e);
                }
                break;
                
            case 'yes, delete all my data':
                try {
                    await User.deleteOne({ chatId: msg.chat.id }).exec();
                    await bot.sendMessage(msg.chat.id, 'Okay, I have deleted all of your data. If you ever wish to use me again, just type "/start". Take care!');
                    
                } catch(e) {
                    // TODO: Send error email
                    await bot.sendMessage(msg.chat.id, `Mmm... Something went wrong, please try again.`, STANDARD_MENU);
                    console.log(e);
                }
                break;
                
            case 'no, i changed my mind':
                bot.sendMessage(msg.chat.id, `Okay ${msg.chat.first_name}.`, STANDARD_MENU);
                break;
        }
    });
    
    // Error handling
    bot.on('polling_error', (error) => {
        // TODO: Send error email
        console.log(error.code);
    });

    // Check every 5 minutes how Dogecoin is doing
    setInterval(async () => {
        let ticker = await binance.prices();
        let dogeUSDCurrentValue = ticker.DOGEUSDT;

        const allUsers = (await User.find({}).exec()).map((record) => {
            return {chatId: record.chatId, maxReminder: record.maxReminder, minReminder: record.minReminder}
        });

        for(let user of allUsers) {
            if (user.maxReminder && (dogeUSDCurrentValue > user.maxReminder)) {
                try {
                    await User.findOneAndUpdate({chatId: user.chatId}, {maxReminder: null}).exec();
                    bot.sendMessage(user.chatId,
                        `REMINDER - Dogecoin value has exceeded ${user.maxReminder}, it is now: ${dogeUSDCurrentValue}!\n\n\nNote: This reminder has been deactivated, if you want me to tell you when the value reaches a new top you have to set a new reminder.`,
                        STANDARD_MENU);
                } catch(e) {
                    // TODO: Send error email
                }                
            }
            if (user.minReminder && (dogeUSDCurrentValue < user.minReminder)) {
                try {
                    await User.findOneAndUpdate({chatId: user.chatId}, {minReminder: null}).exec();
                    bot.sendMessage(user.chatId,
                        `REMINDER - Dogecoin value is less than ${user.minReminder}, it is now: ${dogeUSDCurrentValue}!\n\n\nNote: This reminder has been deactivated, if you want me to tell you when the value reaches a new low you have to set a new reminder.`,
                        STANDARD_MENU);
                } catch(e) {
                    // TODO: Send error email
                }   
                
            }            
        }
    },300000);
}


module.exports = hooks;