"use strict";

var firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/');


function appendVacancy(text) {
    var li = document.createElement('li');
    li.innerHTML = text;
    ;
    document.getElementById('vacancies').appendChild(li);
}

window.onload = function () {
    if (document.getElementById('applyForm')) {
        document.getElementById('applyForm').onsubmit = apply;
    }
    if (document.getElementById('vacancies')) {
        var projectsRef = firebase.child('projects');
        projectsRef.on("value", function (snapshot) {
            document.getElementById('vacancies').innerHTML = '';
            if (snapshot.hasChildren()) {
                snapshot.forEach(generateVacancyLI);
            } else {
                appendVacancy('<h4>Sorry no vacancies are available</h4>');
            }
        });
    }
}

function generateVacancyLI(vacancy) {
	    var vacancyObj = vacancy.val(), text = '<hr><div><p class="location">'
			+ vacancyObj.vacancyDates
			+ ' in '
			+ vacancyObj.vacancyLocations
			+ '</p><p class="name">'
			+ vacancyObj.vacancyName
			+ '</p><p class="details">'
			+ vacancyObj.organisationName
			+ ' need help with '
			+ vacancyObj.vacancySkills
			+ '</p><p><button id="showDetails" onclick="document.getElementById(\'description'
			+ vacancy.key()
			+ '\').classList.toggle(\'closed\');">Details</button> | <a href="#" onclick="applyForVacancy(\''
			+ vacancy.key()
			+ '\')">Apply</a></p><p class="description closed" id="description'
			+ vacancy.key() + '">'
			+ vacancyObj.vacancyDescription + '</p></div>';
	appendVacancy(text);
}


function showVacancyDetails(key) {
    console.log('showing vacancy details for '+key);
}
function applyForVacancy(key) {
    console.log('applying for vacancy '+key);
}

function apply(e) {
    var applyForm = document.getElementById('applyForm'),
        applicantName = applyForm.elements['name'].value,
        applicantEmail = applyForm.elements['email'].value,
        applicantSkills = applyForm.elements['skills'].value,
        application = {
            "name": applicantName,
            "email": applicantEmail,
            "skills": applicantSkills
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
