const bcrypt = require('bcryptjs');

const hash = "$2b$10$l52VGH6rqy0IFKbaLiQLwuiRH4Ry06/4wrDH1IWOn3B7VHXr8K5JC";

console.log('Match Aa116600stt:', bcrypt.compareSync('Aa116600stt', hash));
console.log('Match 123456:', bcrypt.compareSync('123456', hash));
