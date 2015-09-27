var Sendgrid = require("sendgrid-web");

var sendgrid = new Sendgrid({
    user: "madnz",
    key: ""
});

sendgrid.send({
    to: 'adrian.g.parker@gmail.com',
    name: 'Adrian',
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
