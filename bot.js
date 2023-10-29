const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (chatId != -1002112816469) return false;

  if (msg.new_chat_members || messageText === '/start') {
    const newMemberName = msg.new_chat_member?.first_name ?? 'test user';
    const helloArray = [
      "добро пожаловать",
      "добро пожаловать в синюю долину",
      "добро пожаловать в чат синеботов",
      "добро пожаловать в чат синих человечков",
      "добро пожаловать в группу трезвых алкашей",
      "добро пожаловать в чат бухариков в завязке",
      "добро пожаловать в чат алкоголиков в завязке",
      "добро пожаловать в чат трезвеющих алкоголиков",
      "добро пожаловать в чат трезвых алкоголиков",
      "добро пожаловать в группу трезвых алкоголиков",
      "ты попал в чат синеботов, вставших на путь трезвости",
      "ты попал в чат синих человечков, вставших на путь трезвости",
      "ты попал в группу трезвых алкашей",
      "ты попал в чат бухариков в завязке",
      "ты попал в чат трезвеющих алкоголиков",
      "ты попал в чат трезвых алкоголиков",
      "ты попал в группу трезвых алкоголиков",
      "мы пытаемся тут трезветь, у некоторых даже получается"
    ];

    const randomGreeting = helloArray[Math.floor(Math.random() * helloArray.length)];

    let botReply = `Привет, ${newMemberName}, ${randomGreeting}!\r\n\r\n`;
    botReply += `В шапке чата есть правила чата и ссылка на медиатеку: https://t.me/+y3StcP5wH5NhYjcy - там много всего полезного разложено по разделам.\r\n\r\n`;
    botReply += `База для новичка (с чего стоит начать): Стеценко "Как не пить?": https://t.me/c/1878806793/341518`;

    const sentMessage = bot.sendMessage(chatId, botReply)
      .then(result => setTimeout(
        () => bot.deleteMessage(chatId, result.message_id),
        1000 * 60)
      );
  }

});