"use strict";

var firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/');

window.onload = function () {
    if (document.getElementById('applyForm')) {
        document.getElementById('applyForm').onsubmit = apply;
    }
    var queryString = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length),
        org = queryString.substring(queryString.indexOf('&org=') + 5, queryString.length),
        name = queryString.substring(queryString.indexOf('&name=') + 6, queryString.length - (org.length + 5)),
        key = queryString.substring(queryString.indexOf('?key=') + 5, (queryString.length - ((name.length + 6) + (org.length + 5))));
    document.getElementById('vacancyName').innerHTML = '<em>You are applying for:</em> ' + decodeURI(name) + ' @ ' + decodeURI(org);
    document.getElementById('role').value = decodeURI(name);
    document.getElementById('org').value = decodeURI(org);
}

function apply(e) {
    var applyForm = document.getElementById('applyForm'),
        applicantName = applyForm.elements['name'].value,
        applicantEmail = applyForm.elements['email'].value,
        applicantSkills = applyForm.elements['skills'].value,
        specificRole = applyForm.elements['role'].value,
        specificOrg = applyForm.elements['org'].value,
        application = {
            "name": applicantName,
            "email": applicantEmail,
            "skills": applicantSkills,
            "role": specificRole,
            "organisation": specificOrg
        },
        volunteersRef,
        newVolunteer,
        newVolunteerKey,
        formInError = false;
    if (e.preventDefault) {
        e.preventDefault();
    }
    // validate inputs. Browser may do this for us, but it might not.
    if (application.name === null || application.name === undefined || application.name.length === 0) {
        formInError = setFormFieldError('name-error', 'Please enter your name');
    }
    if (application.skills === null || application.skills === undefined || application.skills.length === 0) {
        formInError = setFormFieldError('skills-error', 'Please enter your skills');
    }
    if (application.email === null || application.email === undefined || application.email.length === 0) {
        formInError = setFormFieldError('email-error', 'Please enter your email');
    } else if (!validateEmail(application.email)) {
        formInError = setFormFieldError('email-error', 'Please enter a valid email');
    }
    if (!formInError) {
        // saves this volunteer application as a new unique entry in the volunteers list on Firebase
        volunteersRef = firebase.child('volunteers');
        newVolunteer = volunteersRef.push();
        newVolunteer.set(application, function (error) {
            if (error) {
                console.log("New volunteer data could not be saved: " + error);
                //TODO notify user of form submit failure
            } else {
                newVolunteerKey = newVolunteer.key();
                var request = new XMLHttpRequest();
                request.open('POST', 'https://zaa1vg3a3d.execute-api.us-west-2.amazonaws.com/prod', true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.onreadystatechange = function() {
                    if(request.readyState == 4 && request.status == 200) {
                        window.location = 'thank-you.html?key=' + encodeURI(newVolunteerKey) + '&name=' + encodeURI(application.name);
                    } else {
                        //TODO thank you email failure
                    }

                }
                request.send(JSON.stringify(application));
            }
        });
    }
    // prevent form default behaviour
    return false;
}

function setFormFieldError(fieldId, error) {
    document.getElementById(fieldId).innerHTML = error;
    return true;
}

// see http://output.jsbin.com/ozeyag/19
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
