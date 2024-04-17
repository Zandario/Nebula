// NanoUtility is the place to store utility functions
let NanoUtility = (function () {
  let _urlParameters = {}; // This is populated with the base url parameters (used by all links), which is probaby just the "src" parameter

  return {
    init: function () {
      // let body = $('body'); // We store data in the body tag, it's as good a place as any

      // _urlParameters = body.data('urlParameters');
      // _urlParameters = parseMetaTag('nanoui:urlParameters');
      _urlParameters = JSON.parse(
        document.getElementById('nanoui:urlParameters').text
      );
    },
    // generate a Byond href, combines _urlParameters with parameters
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

// All scripts are initialised here, this allows control of init order
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

String.prototype.toTitleCase = function () {
  let smallWords =
    /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

  return this.replace(
    /([^\W_]+[^\s-]*) */g,
    function (match, p1, index, title) {
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
    }
  );
};

$.ajaxSetup({
  cache: false,
});

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

// Replicate the ckey proc from BYOND
if (!String.prototype.ckey) {
  String.prototype.ckey = function () {
    return this.replace(/\W/g, '').toLowerCase();
  };
}
