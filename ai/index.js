const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.CHATGPT_API_TOKEN
});

const openFun = async (chatHistory, lastMsg) => {

    let messages = [];

    for (const [msgId, newMsg] of Object.entries(chatHistory)) {    
        messages.push({
            role: newMsg.role,
            content: `<${newMsg.fromName}>: ${newMsg.text}` 
        }); 
    }

    messages.push({
        role: lastMsg.role,
        content: `<${lastMsg.fromName}>: ${lastMsg.text}`  
    }); 
    
    messages.unshift( { "role": "system", "content": process.env.BOT_PROMPT }); 

    console.log("AI Generation started...", messages);   

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000
    }); 

    return chatCompletion.choices[0].message.content;
} 

module.exports = openFun; 