const ai = require('../ai');
const greeting = require('./greeting');
const allowedChats = [-1001878806793, -1002112816469, -4051808094];

let fs = require('fs');
let newMembers = JSON.parse(fs.readFileSync('storage/users.json', 'utf8'));
let chatHistory = JSON.parse(fs.readFileSync('storage/chat.json', 'utf8'));

const buildReply = async function (msg) {

    if (!allowedChats.includes(msg.chat.id) && 1 === 2) {
        console.log(`Access restricted for: ${msg.chat.id}`, msg);
        
        return {
            response: "Access restricted",
            originMsgId: msg.message_id
        };
    };

    if (msg.new_chat_members) {
        const newMemberName = msg.new_chat_member?.first_name;
        const newMemberId = msg.new_chat_member?.id;
        const newMemberUsername = msg.new_chat_member?.username;

        newMembers[newMemberId] = {
            id: newMemberId,
            name: newMemberName,
            username: newMemberUsername,
            joined: Date.now()
        };

        fs.writeFileSync('storage/users.json', JSON.stringify(newMembers));

        return {
            response: greeting(newMemberName),
            originMsgId: msg.message_id,
            delete: true
        };
    }

    if (msg.left_chat_member) {
        let memberId = msg.left_chat_member?.id;

        delete newMembers[memberId];

        fs.writeFileSync('storage/users.json', JSON.stringify(newMembers));
    }

    if (msg.text?.toLowerCase() === '!новички') {
        if (!Object.keys(newMembers).length) {
            return {
                response: "Новичков пока нет...",
                originMsgId: msg.message_id
            };
        }

        let newbies = 'Поприветствуем наших новичков! :-)\r\n\r\nРебята добро пожаловать в наше трезвое сообщество! \r\n\r\nНе стесняйтесь рассказать о себе и задать любые вопросы в чате.\r\n\r\n';

        Object.keys(newMembers).forEach(userId => {
            newbies += `<a href="tg://user?id=${newMembers[userId].id}">${newMembers[userId].name}</a> `;
            delete newMembers[userId];
        });

        return {
            response: newbies,
            originMsgId: msg.message_id,
            chatId: -1001878806793
        };
    }

    if (msg.text === 'Хочешь чаю?' || msg.sticker?.thumbnail?.file_unique_id === 'AQADNwAD1QiNOXI') {

        return { 
            originMsgId: msg.message_id,
            sticker: "CAACAgIAAxkBAAOgZUBkkkoh_e_cH0s-mFinjLWOKlkAAjgAA9UIjTmWlPGVmKqJDzME"
        };

        return {
            response: "Спасибо, не надо",
            originMsgId: msg.message_id
        };
    }

    if ((msg.text?.toLowerCase().includes('синебот') || msg.text?.toLowerCase().includes('sinebot') || msg.text?.toLowerCase().includes('antialkashkabot') || msg.reply_to_message?.from.id === 6578767077)) {

        let fromId = msg.from.id; 
        let fromName = msg.from.first_name;
        let msgId = msg.message_id;
        let replyToMsgId = msg.reply_to_message?.message_id;
        let replyToUserId = msg.reply_to_message?.from.id;

        let lastMsg = {
            msgId: msgId,
            fromId: fromId,
            fromName: fromName,
            replyToMsgId: replyToMsgId,
            replyToUserId: replyToUserId,
            text: msg.text,
            date: Date.now(),
            role: "user",
            chatId: msg.chat.id
        };

        let aiReply = await ai(chatHistory, lastMsg);

        chatHistory[msgId] = lastMsg;

        aiReply = aiReply.replace("<Синебот>: ", ""); 
        aiReply = aiReply.replace("<Sinebot>: ", "");
        aiReply = aiReply.replace("<", "");
        aiReply = aiReply.replace(">", "");

        console.log("AI Reply", aiReply);

        chatHistory[msgId + 1] = { 
            msgId: msgId + 1,
            fromId: 6578767077,
            fromName: "Синебот", 
            replyToMsgId: msgId, 
            replyToUserId: fromId,
            text: aiReply,
            date: Date.now(),
            role: "assistant"
        };

        if (Object.keys(chatHistory).length > 10) {
            chatHistory = {}
        }

        fs.writeFileSync('storage/chat.json', JSON.stringify(chatHistory));

        return ({
            response: aiReply,
            originMsgId: msgId
        });

    }

    return false; 
}

module.exports = buildReply; 