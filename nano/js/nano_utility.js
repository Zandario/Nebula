/**
 * Reroutes alerts to BYOND.
 * @param {*} str
 */
globalThis.nanoAlert = function (str) {
	window.location = `byond://?nano_err=${encodeURIComponent(str)}`;
	window.alert(str);
};

/**
 * NanoUtility is the place to store utility functions.
 */
class NanoUtilityClass {
	constructor() {
		this._urlParameters = {}; // This is populated with the base url parameters (used by all links), which is probaby just the "src" parameter
	}

	init() {
		this._urlParameters = JSON.parse(document.querySelector('#UrlParameters').textContent);
	}

	/**
	 * Generates a Byond href, combines _urlParameters with parameters.
	 * @param {Object} parameters - The parameters to be combined with _urlParameters.
	 * @returns {string} The generated href.
	 */
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
	nanoAlert('ERROR: Javascript library failed to load!');
}
if (typeof doT == 'undefined') {
	nanoAlert('ERROR: Template engine failed to load!');
}



// All scripts are initialised here, this allows control of init order
document.addEventListener('DOMContentLoaded', function () {
	NanoUtility.init();
	NanoStateManager.init();
	NanoTemplate.init();
});

$.ajaxSetup({
	cache: false
});

if (!String.prototype.ckey) {
	/**
	 * A replication of the ckey proc from BYOND.
	 * @returns {string} The string with all non-alphanumeric characters removed and converted to lower case.
	 */
	String.prototype.ckey = function () {
		return this.replace(/\W/g, '').toLowerCase();
	};
}