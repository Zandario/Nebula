/**
 * NanoTemplate is a self-invoking function that manages templates.
 * @returns {Object} An object with methods to manage templates.
 */
let NanoTemplate = (function () {
  /**
   * An object that stores template data.
   * @type {Object}
   */
  let _templateData = {};

  /**
   * A string that stores the template file name.
   * @type {string}
   */
  let _templateFileName = '';

  /**
   * An object that stores templates.
   * @type {Object}
   */
  let _templates = {};

  /**
   * An object that stores compiled templates.
   * @type {Object}
   */
  let _compiledTemplates = {};

  /**
   * An object that stores helper functions.
   * @type {Object}
   */
  let _helpers = {};

  /**
   * Initializes the NanoTemplate by loading all templates.
   */
  let init = function () {
    // We store data in a script tag, so lets get it.
    _templateData = JSON.parse(
      document.getElementById('nanoui:templateData').text
    );

    // _templateFileName = $('body').data('initialData')['config']['templateFileName'];
    // Parse the JSON object and access the 'templateFileName' property
    let initialData = JSON.parse(
      document.getElementById('nanoui:initialData').text
    );
    _templateFileName = initialData.config.templateFileName;

    if (_templateData == null) {
      alert('Error: Template data did not load correctly.');
    }

    loadAllTemplates();
  };

  /**
   * Loads all templates from the template file.
   */
  let loadAllTemplates = function () {
    $.when(
      $.ajax({
        url: _templateFileName,
        cache: false,
        dataType: 'json',
      })
    )
      .done(function (allTemplates) {
        for (let key in _templateData) {
          let templateMarkup = allTemplates[_templateData[key]];
          templateMarkup += '<div class="clearBoth"></div>';

          try {
            NanoTemplate.addTemplate(key, templateMarkup);
          } catch (error) {
            alert(
              'ERROR: Loading template ' + key + '(' + _templateData[key] + ') failed with error: ' + error.message
            );
            return;
          }
          delete _templateData[key];
        }
        $(document).trigger('templatesLoaded');
      })
      .fail(function () {
        alert('ERROR: Failed to locate or parse templates file.');
      });
  };

  /**
   * Compiles all templates stored in _templates.
   */
  let compileTemplates = function () {
    for (let key in _templates) {
      try {
        _compiledTemplates[key] = doT.template(_templates[key], null, _templates);
      } catch (error) {
        alert('ERROR: Compiling template key "' + key + '" ("' + _templateData[key] + '") failed with error: ' + error);
      }
    }
  };

  return {
    /**
     * Initializes the NanoTemplate.
     */
    init: function () {
      init();
    },

    /**
     * Adds a template to _templates.
     * @param {string} key - The key of the template.
     * @param {string} templateString - The string representation of the template.
     */
    addTemplate: function (key, templateString) {
      _templates[key] = templateString;
    },

    /**
     * Checks if a template exists in _templates.
     * @param {string} key - The key of the template.
     * @returns {boolean} True if the template exists, false otherwise.
     */
    templateExists: function (key) {
      return _templates.hasOwnProperty(key);
    },

    /**
     * Parses a template with the provided data.
     * @param {string} templateKey - The key of the template.
     * @param {Object} data - The data to be used in the template.
     * @returns {string} The parsed template.
     */
    parse: function (templateKey, data) {
      if (!_compiledTemplates.hasOwnProperty(templateKey) || !_compiledTemplates[templateKey]) {
        if (!_templates.hasOwnProperty(templateKey)) {
          alert('ERROR: Template "' + templateKey + '" does not exist in _compiledTemplates!');
          return '<h2>Template error (does not exist)</h2>';
        }
        compileTemplates();
      }
      if (typeof _compiledTemplates[templateKey] != 'function') {
        return '<h2>Template error (failed to compile)</h2>';
      }
      return _compiledTemplates[templateKey].call(this, data['data'], data['config'], _helpers);
    },

    /**
     * Adds a helper function to _helpers.
     * @param {string} helperName - The name of the helper function.
     * @param {Function} helperFunction - The helper function.
     */
    addHelper: function (helperName, helperFunction) {
      if (!jQuery.isFunction(helperFunction)) {
        alert('NanoTemplate.addHelper failed to add ' + helperName + ' as it is not a function.');
        return;
      }

      _helpers[helperName] = helperFunction;
    },

    /**
     * Adds multiple helper functions to _helpers.
     * @param {Object} helpers - An object with helper functions.
     */
    addHelpers: function (helpers) {
      for (let helperName in helpers) {
        if (!helpers.hasOwnProperty(helperName)) {
          continue;
        }
        NanoTemplate.addHelper(helperName, helpers[helperName]);
      }
    },

    /**
     * Removes a helper function from _helpers.
     * @param {string} helperName - The name of the helper function.
     */
    removeHelper: function (helperName) {
      if (helpers.hasOwnProperty(helperName)) {
        delete _helpers[helperName];
      }
    },
  };
})();
