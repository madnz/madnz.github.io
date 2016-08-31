var Sendgrid = require("sendgrid-web");

var sendgrid = new Sendgrid({
    user: "madnz",
    key: ""
});


exports.handler = function(event, context, callback) {
    var toEmail = event.email,
        toName = event.name || '',
        toSkills = event.skills || '';
    sendgrid.send({
        to: toEmail,
        cc: 'shiffynayar@gmail.com',
        bcc: 'adrian@iceknife.com',
        from: 'madnz@iceknife.com',
        subject: 'Thank you ' + toName,
        html: '<h1>Thank you.</h1><p>Hi '+toName+'.</p><p>Shiffy from Make A Difference will be in touch shortly.</p><p>Skills: ' + toSkills + '</p>'
    }, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(err, "Success");
        }
    });
};