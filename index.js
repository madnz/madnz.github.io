"use strict";

window.onload = function () {
	document.getElementById('applyForm').onsubmit = function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}

		var applyForm = document.getElementById('applyForm'),
			applicantName = applyForm.elements['name'].value,
			applicantEmail = applyForm.elements['email'].value,
			applicantSkills = applyForm.elements['skills'].value,
			application = {
				"name": applicantName,
				"email": applicantEmail,
				"skills": applicantSkills
			};

		alert('form submitted with '+JSON.stringify(application));

		// prevent form default behaviour
		return false;
	}
}