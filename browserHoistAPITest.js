"use strict";

window.onload = function () {
    console.log('About to test raising an event via Hoist API');
    // stuff
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.hoi.io/events/signup', true);
    xhr.onreadystatechange = function() {
        console.log('onreadystatechange' + this.readyState + ' ' + this.status + ' ' + this.statusText + ' ' + ( this.responseText ? JSON.parse(this.responseText) : ''));
    };
    xhr.onload = function () {
        console.log('onload' + this.responseText);
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Hoist 6S1yaWVN0IYcvlylwMcURVad7dIraXJF');
    var xhrBody = JSON.stringify({
        "email":"adrian.g.parker@gmail.com",
        "name":"Adrian Parker",
        "skills": "Just a test please ignore"
    });
    xhr.send(xhrBody);
    console.log('Done.');
}