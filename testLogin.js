"use strict";

window.onload = function () {
    document.getElementById('loginButton').onclick = function (e) {
        var firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/');
        firebase.authWithOAuthPopup("google", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                document.getElementById('welcomeName').innerHTML = authData.google.cachedUserProfile.given_name;
                // update users table
                var usersRef = firebase.child('users');
                usersRef.child(authData.auth.uid).update({
                    provider: authData.auth.provider,
                    name: authData[authData.auth.provider].displayName,
                    lastLogin: new Date()
                }, function (error) {
                    if (error) {
                        console.log("New user data could not be saved: " + error);
                    } else {
                        // read the user list and display it. Security rules mean this should only show the logged in user.
                        usersRef.once("value", function(data) {
                            console.log(data.val());
                        });
                    }
                });
            }
        });
    };
}

