var Hoist = require('@hoist/node-sdk');
console.log('raising sample event');
Hoist.setApiKey("6S1yaWVN0IYcvlylwMcURVad7dIraXJF");
Hoist.raise("signup", {
    "email":"adrian@iceknife.com"
});

console.log('sent sample event');
