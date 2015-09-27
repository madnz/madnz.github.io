var Sendgrid = require("sendgrid-web");

module.exports = function(event) {
    var toEmail = event.payload.email,
        toName = event.payload.name || '',
        toSkills = event.payload.skills || '',
        sendgrid = new Sendgrid({
            user: "madnz",
            key: ""
        });
    Hoist.log('Processing signup event to: '+toEmail);
    sendgrid.send({
        to: toEmail,
        cc: 'shiffynayar@gmail.com',
        from: 'madnz@iceknife.com',
        subject: 'Thank you ' + toName,
        html: '<h1>Thank you.</h1><p>Hi '+toName+'.</p><p>Shiffy from Make A Difference will be in touch shortly.</p><p>Skills: ' + toSkills + '</p>'
    }, function (err) {
        if (err) {
            Hoist.log('Error sending signup email: '+err);
        } else {
            Hoist.log('Successfully sent signup email');
        }
    });
    return Hoist.log('Completed processing signup event: '+event.payload);
};
