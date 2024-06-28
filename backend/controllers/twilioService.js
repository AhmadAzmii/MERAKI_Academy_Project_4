const twilio = require('twilio');
const client = twilio('AC1fa03a30d1102e94d44ed05d0191d71c', 'f380f137e9f24532a7d609f4973434c7');

const sendSms = (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: '+12057746530', 
        to: phoneNumber,
    });
};

module.exports = sendSms;
