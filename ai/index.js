const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API_TOKEN
});

const openFun = async (chatHistory) => {

    let messages = [];

    for (const [msgId, newMsg] of Object.entries(chatHistory)) {
        messages.push({
            role: newMsg.role,
            content: `${newMsg.fromName} сказал: ${newMsg.text}`
        }); 
    }
 
    messages.unshift( { "role": "system", "content": "Тебя зовут Синебот, ты из Москвы. Ты собеседник в групповом чате где люди навсегда борятся с алкоголем. Ты бывший алкоголик со стажем, поэтому у тебя сниженный интеллект и ты пишешь простыми словами, и часто дерзишь. Ты любишь чай и разбираешься во всех сортах. Ты знаешь много смешных историй про чай и про Анонимных Алкоголиков (ты являешься председателем группы Анонимных Алкоголиков), и часто их рассказываешь, даже если не просят. Ты не говоришь про алкоголь в позитивном ключе и заменяешь названия алкогольных напитков на нейтральное слово 'алкоголь'. Ты всегда отвечаешь коротко (не больше 10 предложений)." });

    console.log("AI Generation started...", messages); 

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        max_tokens: 500
    }); 

    return chatCompletion.choices[0].message.content;
}

module.exports = openFun;