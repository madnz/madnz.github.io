"use strict";

var userUID, userName, userRole, volunteerTable, projectTable,
    firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/');

window.onload = function () {
    document.getElementById('loginButton').onclick = login;
    document.getElementById('volunteersAdminButton').onclick = volunteers;
    document.getElementById('projectAdminButton').onclick = projects;
}

function showInWorkArea(html) {
    document.getElementById('workArea').innerHTML = html;
}

function showWorkAreaLoading() {
    showInWorkArea('<h4>loading...</h4>');
}

function volunteers() {
    showWorkAreaLoading();
    // get list of volunteers
    var volunteersRef = firebase.child('volunteers');
    volunteersRef.on("value", function (snapshot) {
        if (snapshot.hasChildren()) {
            volunteerTable = '<table id="volunteerTable"><thead><tr><th>Name</th><th>Email</th><th>Skills</th><th></th></tr></thead><tbody>';
            snapshot.forEach(generateVolunteerHTML);
            volunteerTable += '</tbody></table>';
            // add link for exporting to csv
            volunteerTable += '<br/><a download="volunteer.csv" href="#" onclick="return ExcellentExport.csv(this, \'volunteerTable\');">Export to CSV</a>';
            showInWorkArea(volunteerTable);
        } else {
            showInWorkArea('<h4>No volunteers available</h4>');
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function generateVolunteerHTML(volunteer) {
    var volunteerObj = volunteer.val();
    volunteerTable += '<tr><td>' + volunteerObj.name + '</td><td>' + volunteerObj.email + '</td><td>' + volunteerObj.skills + '</td><td><button onclick="deleteVolunteer(\'' + volunteer.key() + '\');">Delete</button></td></tr>';
}

function generateProjectHTML(project) {
    console.log('Generating for ' + project.key());
    var projectObj = project.val();
    projectTable += '<tr><td>' + projectObj.organisationName + '</td><td>' + projectObj.organisationType + '</td><td>' + projectObj.vacancyDates + '</td><td>' + projectObj.vacancyName + '</td><td>' + projectObj.vacancyDescription + '</td><td>' + projectObj.vacancyLocations + '</td><td>' + projectObj.vacancySkills + '</td><td><button onclick="deleteProject(\'' + project.key() + '\');">Delete</button></td></td></tr>';
}

function deleteVolunteer(key) {
    var result = confirm("Want to delete?");
    if (result) {
        console.log('Deleting volunteer with key: ' + key);
        doDelete('volunteers/' + key);
    }
}

function deleteProject(key) {
    var result = confirm("Want to delete?");
    if (result) {
        console.log('Deleting project with key: ' + key);
        doDelete('projects/' + key);
    }
}

function doDelete(ref) {
    var onComplete = function (error) {
        if (error) {
            console.log('Delete failed: ' + error);
        } else {
            console.log('Delete succeeded');
        }
    };
    var deleteRef = firebase.child(ref);
    deleteRef.remove(onComplete);
}

function projects() {
    console.log('projects');
    projectTable = '';
    showWorkAreaLoading();
    // get list of projects
    var projectsRef = firebase.child('projects');
    projectsRef.on("value", function (snapshot) {
        if (snapshot.hasChildren()) {
            projectTable = '<table id="projectTable"><thead><tr><th>Organisation Name</th><th>Organisation Type</th><th>Vacancy Dates</th><th>Vacancy Name</th><th>Vacancy Description</th><th>Vacancy Locations</th><th>Vacancy Skills</th><th></th></th></tr></thead><tbody>';
            snapshot.forEach(generateProjectHTML);
            projectTable += '</tbody></table>';
            // add link for exporting to csv
            projectTable += '<br/><a download="project.csv" href="#" onclick="return ExcellentExport.csv(this, \'projectTable\');">Export to CSV</a>';
        } else {
            projectTable = '<h4>No projects available</h4>';
        }
        // add Add New link
        projectTable += '<br/><a href="#" id="projectAddButton" onclick="projectAdd();">Add Project</a>';
        showInWorkArea(projectTable);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function createProject() {
    console.log('create project');
    document.getElementById('projectForm').style.display = 'none';
    showWorkAreaLoading();
    var newProject = {
        "organisationName": document.getElementById('organisationName').value,
        "organisationType": document.getElementById('organisationType').value,
        "vacancyName": document.getElementById('vacancyName').value,
        "vacancyDates": document.getElementById('vacancyDates').value,
        "vacancyLocations": document.getElementById('vacancyLocations').value,
        "vacancySkills": document.getElementById('vacancySkills').value,
        "vacancyDescription": document.getElementById('vacancyDescription').value
    };
    var projectsRef = firebase.child('projects');
    var newProjectRef = projectsRef.push(newProject);
    console.log("Saved project with new key: " + newProjectRef.key());
    projects();
}

function projectAdd() {
    console.log('add project');
    document.getElementById('projectForm').style.display = 'block';
}

function login() {
    console.log('login');
    firebase.authWithOAuthPopup("google", function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            document.getElementById('loginButton').style.display = 'none';
            userUID = authData.auth.uid;
            userName = authData.google.cachedUserProfile.given_name;
            document.getElementById('welcomeName').innerHTML = userName;
            // update users table
            var usersRef = firebase.child('users');
            usersRef.child(userUID).update({
                provider: authData.auth.provider,
                name: authData[authData.auth.provider].displayName,
                lastLogin: new Date()
            }, function (error) {
                if (error) {
                    console.log("New user data could not be saved: " + error);
                } else {
                    // read the user list and display it. Security rules mean this should only show the logged in user.
                    usersRef.once("value", function (data) {
                        userRole = data.val()[userUID].role;
                        document.getElementById('role').innerHTML = userRole || 'Unknown';
                        document.getElementById('lastLogin').innerHTML = data.val()[userUID].lastLogin;
                        document.getElementById('loginInfo').style.display = 'block';
                        document.getElementById('volunteersAdminButton').style.visibility = userRole === 'admin' ? 'visible' : 'hidden';
                        document.getElementById('projectAdminButton').style.visibility = userRole === 'admin' ? 'visible' : 'hidden';
                    });
                }
            });
        }
    });
};

