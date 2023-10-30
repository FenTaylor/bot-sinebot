const greeting = require('./greeting');

const buildReply = function(msg) {
    if (msg.new_chat_members || msg.text === '/start') {
        const newMemberName = msg.new_chat_member?.first_name ?? msg.from?.first_name ?? 'Синебот';
        
        return {
            response: greeting(newMemberName),
            originMsgId: msg.message_id
        };
    }

    return false;
}

module.exports = buildReply;