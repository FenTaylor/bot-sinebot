const greeting = require('./greeting');
const allowedChats = [-1001878806793, -1002112816469];

const buildReply = function (msg) {
    if (msg.new_chat_members || msg.text === '/start') {
        const newMemberName = msg.new_chat_member?.first_name ?? msg.from?.first_name ?? 'Синебот';

        if (!allowedChats.includes(msg.chat.id) && msg.chat.type != 'private') {
            console.log(`Access restricted for: ${msg.chat.id}`, msg);
            return false
        };

        return {
            response: greeting(newMemberName),
            originMsgId: msg.message_id
        };
    }

    return false;
}

module.exports = buildReply;