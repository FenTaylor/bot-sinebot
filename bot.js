const TelegramBot = require('node-telegram-bot-api');
const handler = require('./handlers');

const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", console.log);
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const botReply = await handler(msg);

  if (botReply.response) {
    const messageSent = bot.sendMessage(botReply.chatId ? botReply.chatId : chatId, botReply.response,
      {
        "reply_to_message_id": botReply.originMsgId,
        "parse_mode": "HTML"
      })
      .then(result => {
        if (botReply.delete) {
          setTimeout(() => {
            bot.deleteMessage(chatId, result.message_id);
            bot.deleteMessage(chatId, botReply.originMsgId);
          },
            1000 * 60 * 5)
        }
      }
      );
  }

  if (botReply.sticker) {
    bot.sendSticker(chatId, botReply.sticker);
  }

});