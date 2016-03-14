"use strict";

window.onload = function () {
    document.getElementById('loginButton').onclick = function (e) {
        var ref = new Firebase('https://scorching-fire-2466.firebaseIO.com/');
        ref.authWithOAuthPopup("google", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    };
}