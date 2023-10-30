const greeting = require('./greeting');

const buildReply = function(msg) {
    if (msg.new_chat_members || msg.text === '/start') {
        const newMemberName = msg.from?.first_name ?? 'Синебот';
        
        return greeting(newMemberName);
    }
    
    return false;
}

module.exports = buildReply;