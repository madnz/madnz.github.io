"use strict";

var firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/');


function appendVacancy(text) {
    var li = document.createElement('li');
    li.innerHTML = text;
    document.getElementById('vacancies').appendChild(li);
}

window.onload = function () {
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

function applyForVacancy(key) {
    console.log('applying for vacancy '+key);
    var vacancyList = firebase.child('projects').child(key);
    vacancyList.on("value", function(vacancy) {
        var vacancyObj = vacancy.val();
        console.log("Processing" + JSON.stringify(vacancyObj));
        window.location = 'volunteer.html?key=' + encodeURI(key) + '&name=' + encodeURI(vacancyObj.vacancyName) +'&org=' +encodeURI(vacancyObj.organisationName);
    });
}

