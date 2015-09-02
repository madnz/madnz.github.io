"use strict";

window.onload = function () {
	document.getElementById('applyForm').onsubmit = function(e) {
		var firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/'),
			applyForm = document.getElementById('applyForm'),
			applicantName = applyForm.elements['name'].value,
			applicantEmail = applyForm.elements['email'].value,
			applicantSkills = applyForm.elements['skills'].value,
			application = {
				"name": applicantName,
				"email": applicantEmail,
				"skills": applicantSkills
			},
			applicationRef;
		if (e.preventDefault) {
			e.preventDefault();
		}

		// saves this volunteer application as a new unique entry in the volunteers list on Firebase
		applicationRef = firebase.child('volunteers').push(application);

		alert('Application saved with key: '+applicationRef.key());

		// prevent form default behaviour
		return false;
	}
}