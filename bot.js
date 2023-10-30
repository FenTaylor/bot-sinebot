const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const handler = require('./handlers');

dotenv.config();

const token = process.env.API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", console.log);
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const allowedChats = [-1001878806793, -1002112816469]

  if (!allowedChats.includes(chatId) && msg.chat.type != 'private') {
    console.log(`Access restricted for: ${chatId}`);
    return false
  };

  const botReply = handler(msg);

  if (botReply) {
    const messageSent = bot.sendMessage(chatId, botReply)
      .then(result => setTimeout(
        () => bot.deleteMessage(chatId, result.message_id),
        1000 * 60)
      );
  }

});