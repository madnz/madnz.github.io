var Sendgrid = require("sendgrid-web");

var sendgrid = new Sendgrid({
    user: "madnz",
    key: "PASSWORD"
});

sendgrid.send({
    to: 'adrian@iceknife.com',
    from: 'madnz@iceknife.com',
    subject: 'Hello world!',
    html: '<h1>Hello world!</h1>'
}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Success.");
    }
});
