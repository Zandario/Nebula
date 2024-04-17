let NanoTemplate = (function () {
  let _templateData = {};
  let _templateFileName = '';

  let _templates = {};
  let _compiledTemplates = {};

  let _helpers = {};

  let init = function () {
    // We store templateData in the body tag, it's as good a place as any
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
              'ERROR: Loading template ' +
                key +
                '(' +
                _templateData[key] +
                ') failed with error: ' +
                error.message
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

  let compileTemplates = function () {
    for (let key in _templates) {
      try {
        _compiledTemplates[key] = doT.template(
          _templates[key],
          null,
          _templates
        );
      } catch (error) {
        alert(
          'ERROR: Compiling template key "' +
            key +
            '" ("' +
            _templateData[key] +
            '") failed with error: ' +
            error
        );
      }
    }
  };

  return {
    init: function () {
      init();
    },
    addTemplate: function (key, templateString) {
      _templates[key] = templateString;
    },
    templateExists: function (key) {
      return _templates.hasOwnProperty(key);
    },
    parse: function (templateKey, data) {
      if (
        !_compiledTemplates.hasOwnProperty(templateKey) ||
        !_compiledTemplates[templateKey]
      ) {
        if (!_templates.hasOwnProperty(templateKey)) {
          alert(
            'ERROR: Template "' +
              templateKey +
              '" does not exist in _compiledTemplates!'
          );
          return '<h2>Template error (does not exist)</h2>';
        }
        compileTemplates();
      }
      if (typeof _compiledTemplates[templateKey] != 'function') {
        return '<h2>Template error (failed to compile)</h2>';
      }
      return _compiledTemplates[templateKey].call(
        this,
        data['data'],
        data['config'],
        _helpers
      );
    },
    addHelper: function (helperName, helperFunction) {
      if (!jQuery.isFunction(helperFunction)) {
        alert(
          'NanoTemplate.addHelper failed to add ' +
            helperName +
            ' as it is not a function.'
        );
        return;
      }

      _helpers[helperName] = helperFunction;
    },
    addHelpers: function (helpers) {
      for (let helperName in helpers) {
        if (!helpers.hasOwnProperty(helperName)) {
          continue;
        }
        NanoTemplate.addHelper(helperName, helpers[helperName]);
      }
    },
    removeHelper: function (helperName) {
      if (helpers.hasOwnProperty(helperName)) {
        delete _helpers[helperName];
      }
    },
  };
})();
