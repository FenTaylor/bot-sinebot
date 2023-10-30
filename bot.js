const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const handler = require('./handlers');

dotenv.config();

const token = process.env.API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", console.log);
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const botReply = handler(msg);

  if (botReply) {
    const messageSent = bot.sendMessage(chatId, botReply.response)
      .then(result => setTimeout(
        () => {
          bot.deleteMessage(chatId, result.message_id);
          bot.deleteMessage(chatId, botReply.originMsgId);
        },
        1000 * 60 * 3)
      );
  }

});