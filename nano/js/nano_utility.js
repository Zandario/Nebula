/**
 * NanoUtility is the place to store utility functions.
 * @returns {Object} An object with utility methods.
 */
let NanoUtility = (function () {
  /**
   * This is populated with the base url parameters (used by all links), which is probably just the "src" parameter.
   * @type {Object}
   */
  let _urlParameters = {};

  return {
    /**
     * Initializes the utility by storing data in the body tag.
     */
    init: function () {

      // let body = $('body'); // We store data in the body tag, it's as good a place as any

      _urlParameters = JSON.parse(
        document.getElementById('nanoui:urlParameters').text
      );
    },
    /**
     * Generates a Byond href, combines _urlParameters with parameters.
     * @param {Object} parameters - The parameters to be combined with _urlParameters.
     * @returns {string} The generated href.
     */
    generateHref: function (parameters) {
      let queryString = '?';

      for (let key in _urlParameters) {
        if (_urlParameters.hasOwnProperty(key)) {
          if (queryString !== '?') {
            queryString += ';';
          }
          queryString += key + '=' + _urlParameters[key];
        }
      }

      for (let key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          if (queryString !== '?') {
            queryString += ';';
          }
          queryString += key + '=' + parameters[key];
        }
      }
      return queryString;
    },
  };
})();

if (typeof jQuery == 'undefined') {
  alert('ERROR: Javascript library failed to load!');
}
if (typeof doT == 'undefined') {
  alert('ERROR: Template engine failed to load!');
}

(function () {
  let _alert = window.alert;
  window.alert = function (str) {
    window.location = 'byond://?nano_err=' + encodeURIComponent(str);
    _alert(str);
  };
})();

/**
 * All scripts are initialised here, this allows control of init order.
 */
$(document).ready(function () {
  NanoUtility.init();
  NanoStateManager.init();
  NanoTemplate.init();
});

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/) {
    let len = this.length;

    let from = Number(arguments[1]) || 0;
    from = from < 0 ? Math.ceil(from) : Math.floor(from);
    if (from < 0) from += len;

    for (; from < len; from++) {
      if (from in this && this[from] === elt) return from;
    }
    return -1;
  };
}

if (!String.prototype.format) {
  String.prototype.format = function (args) {
    let str = this;
    return str.replace(String.prototype.format.regex, function (item) {
      let intVal = parseInt(item.substring(1, item.length - 1));
      let replace;
      if (intVal >= 0) {
        replace = args[intVal];
      } else if (intVal === -1) {
        replace = '{';
      } else if (intVal === -2) {
        replace = '}';
      } else {
        replace = '';
      }
      return replace;
    });
  };
  String.prototype.format.regex = new RegExp('{-?[0-9]+}', 'g');
}

/**
 * Adds a size method to the Object prototype that returns the number of properties in the object.
 * @returns {number} The number of properties in the object.
 */
Object.size = function (obj) {
  let size = 0,
    key;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

if (!window.console) {
  window.console = {
    log: function (str) {
      return false;
    },
  };
}

/**
 * Adds a toTitleCase method to the String prototype that converts the string to title case.
 * @returns {string} The string converted to title case.
 */
String.prototype.toTitleCase = function () {
  let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

  return this.replace(/([^\W_]+[^\s-]*) */g, function (match, p1, index, title) {
    if (
      index > 0 &&
      index + p1.length !== title.length &&
      p1.search(smallWords) > -1 &&
      title.charAt(index - 2) !== ':' &&
      title.charAt(index - 1).search(/[^\s-]/) < 0
    ) {
      return match.toLowerCase();
    }

    if (p1.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};

$.ajaxSetup({
  cache: false,
});

/**
 * Adds an inheritsFrom method to the Function prototype that sets up inheritance from a parent class or object.
 * @param {Object|Function} parentClassOrObject - The parent class or object to inherit from.
 * @returns {Function} The function with inheritance set up.
 */
Function.prototype.inheritsFrom = function (parentClassOrObject) {
  this.prototype = new parentClassOrObject();
  this.prototype.constructor = this;
  this.prototype.parent = parentClassOrObject.prototype;
  return this;
};

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

/**
 * Adds a ckey method to the String prototype that replicates the ckey proc from BYOND.
 * @returns {string} The string with all non-alphanumeric characters removed and converted to lower case.
 */
if (!String.prototype.ckey) {
  String.prototype.ckey = function () {
    return this.replace(/\W/g, '').toLowerCase();
  };
}
