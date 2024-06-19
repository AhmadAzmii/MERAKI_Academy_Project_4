const twilio = require('twilio');
const client = twilio('AC37f9cc27affc4e0c21ecde692bff3d52', 'a293b5ba54191d0141353e7e1d844b9a');

const sendSms = (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: '+12073833958', 
        to: phoneNumber,
    });
};

module.exports = sendSms;
