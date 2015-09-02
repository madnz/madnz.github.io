"use strict";

window.onload = function () {
	var queryString = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length),
		name = queryString.substring(queryString.indexOf('&name=')+6, queryString.length),
		key = queryString.substring(queryString.indexOf('?key=')+5, (queryString.length - (name.length + 6)));
	document.getElementById('ThankYou-name').innerHTML = decodeURI(name);
	document.getElementById('ThankYou-key').innerHTML = decodeURI(key);
}
