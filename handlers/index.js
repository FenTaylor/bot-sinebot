const greeting = require('./greeting');
const allowedChats = [-1001878806793, -1002112816469, -4051808094];

let fs = require('fs');
let newMembers = JSON.parse(fs.readFileSync('storage/users.json', 'utf8'));
let chatHistory = JSON.parse(fs.readFileSync('storage/chat.json', 'utf8'));

const buildReply = function (msg) {
    console.log(msg);

    if (msg.new_chat_members) {
        const newMemberName = msg.new_chat_member?.first_name;
        const newMemberId = msg.new_chat_member?.id;
        const newMemberUsername = msg.new_chat_member?.username;

        if (!allowedChats.includes(msg.chat.id) && msg.chat.type != 'private') {
            console.log(`Access restricted for: ${msg.chat.id}`, msg);
            return false
        };
        
        newMembers[newMemberId] = {
            id: newMemberId,
            name: newMemberName,
            username: newMemberUsername,
            joined: Date.now()
        };

        fs.writeFileSync('storage/users.json', JSON.stringify(newMembers));

        return {
            response: greeting(newMemberName),
            originMsgId: msg.message_id
        };
    }

    if (msg.text === 'Хочешь чаю?' || msg.sticker?.thumbnail?.file_unique_id === 'AQADNwAD1QiNOXI') {
        /*
        return {
            originMsgId: msg.message_id,
            sticker: "CAACAgIAAxkBAAOgZUBkkkoh_e_cH0s-mFinjLWOKlkAAjgAA9UIjTmWlPGVmKqJDzME"
        };
        */
       
        return {
            response: "Спасибо, не надо",
            originMsgId: msg.message_id
        };
    }

    if (msg.reply_to_message) {
        let msgId = msg.message_id;
        let replyToId = msg.reply_to_message.message_id;
        let replyToUsername = msg.reply_to_message.from.username;
    }

    return false;
}

module.exports = buildReply;