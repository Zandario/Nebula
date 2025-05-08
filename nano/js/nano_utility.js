// NanoUtility is the place to store utility functions
class NanoUtilityClass {
	constructor() {
		this._urlParameters = {}; // This is populated with the base url parameters (used by all links), which is probaby just the "src" parameter
	}

	init() {
		this._urlParameters = JSON.parse(document.querySelector('#UrlParameters').textContent);
	}

	// generate a Byond href, combines _urlParameters with parameters
	generateHref(parameters) {
		const url = new URL(window.location.href); // Use the current URL as the base
		const urlParams = new URLSearchParams(this._urlParameters);

		Object.entries(parameters).forEach(([key, value]) => {
			urlParams.set(key, value); // Add or update parameters
		});

		url.search = urlParams.toString().replace(/&/g, ';'); // Replace '&' with ';' if needed
		return url.search;
	}
}

const NanoUtility = new NanoUtilityClass();


if (typeof jQuery == 'undefined') {
	alert('ERROR: Javascript library failed to load!');
}
if (typeof doT == 'undefined') {
	alert('ERROR: Template engine failed to load!');
}

(function() {
	var _alert = window.alert;
	window.alert = function(str) {
		window.location = "byond://?nano_err=" + encodeURIComponent(str);
		_alert(str);
	};
})();

// All scripts are initialised here, this allows control of init order
document.addEventListener('DOMContentLoaded', function () {
	NanoUtility.init();
	NanoStateManager.init();
	NanoTemplate.init();
});

$.ajaxSetup({
	cache: false
});

// Replicate the ckey proc from BYOND
if (!String.prototype.ckey) {
	String.prototype.ckey = function () {
		return this.replace(/\W/g, '').toLowerCase();
	};
}