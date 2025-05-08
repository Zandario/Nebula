/**
 * A template manager that loads and compiles templates.
 */
class NanoTemplateClass {
	constructor() {
		/**
		 * An object that stores template data.
		 * @type {Object}
		 */
		let _templateDa
		this._templateData = {};
		/**
		 * A string that stores the template file name.
		 * @type {string}
		 */
		this._templateFileName = '';
		/**
		 * An object that stores templates.
		 * @type {Object}
		 */
		this._templates = {};
		/**
		 * An object that stores compiled templates.
		 * @type {Object}
		 */
		this._compiledTemplates = {};
		/**
		 * An object that stores helper functions.
		 * @type {Object}
		 */
		this._helpers = {};
	}

	/**
	 * Initializes the template manager by loading the template data and the initial data.
	 */
	init() {
		const templateDataElement = document.querySelector('#TemplateData');
		const initialDataElement = document.querySelector('#InitialData');

		if (templateDataElement && initialDataElement) {
			this._templateData = JSON.parse(templateDataElement.textContent);
			const initialData = JSON.parse(initialDataElement.textContent);
			this._templateFileName = initialData['config']['templateFileName'];

			if (!this._templateData) {
				nanoAlert('Error: Template data did not load correctly.');
			}

			this.loadAllTemplates();
		} else {
			nanoAlert('Error: Required elements (#TemplateData or #InitialData) not found in the DOM.');
		}
	}

	/**
	 * Loads all templates from the template file.
	 */
	async loadAllTemplates() {
		try {
			const response = await fetch(this._templateFileName, { cache: 'no-store' });
			if (!response.ok) {
				throw new Error('Failed to fetch templates file.');
			}

			const allTemplates = await response.json();

			for (const key in this._templateData) {
				let templateMarkup = allTemplates[this._templateData[key]];
				templateMarkup += '<div class="clearBoth"></div>';

				try {
					this.addTemplate(key, templateMarkup);
				} catch (error) {
					nanoAlert(`ERROR: Loading template ${key} (${this._templateData[key]}) failed with error: ${error.message}`);
					return;
				}
				delete this._templateData[key];
			}

			const event = new Event('templatesLoaded');
			document.dispatchEvent(event);
		} catch (error) {
			nanoAlert('ERROR: Failed to locate or parse templates file.');
		}
	}

	/**
	 * Compiles all templates stored in _templates.
	 */
	compileTemplates() {
		for (const key in this._templates) {
			try {
				this._compiledTemplates[key] = doT.template(this._templates[key], null, this._templates);
			} catch (error) {
				nanoAlert(`ERROR: Compiling template key "${key}" failed with error: ${error}`);
			}
		}
	}

	/**
	 * Adds a template to _templates.
	 * @param {string} key - The key of the template.
	 * @param {string} templateString - The string representation of the template.
	 */
	addTemplate(key, templateString) {
		this._templates[key] = templateString;
	}

	/**
	 * Checks if a template exists in _templates.
	 * @param {string} key - The key of the template.
	 * @returns {boolean} True if the template exists, false otherwise.
	 */
	templateExists(key) {
		return Object.prototype.hasOwnProperty.call(this._templates, key);
	}

	/**
	 * Parses a template with the provided data.
	 * @param {string} templateKey - The key of the template.
	 * @param {Object} data - The data to be used in the template.
	 * @returns {string} The parsed template.
	 */
	parse(templateKey, data) {
		if (!Object.prototype.hasOwnProperty.call(this._compiledTemplates, templateKey) || !this._compiledTemplates[templateKey]) {
			if (!Object.prototype.hasOwnProperty.call(this._templates, templateKey)) {
				nanoAlert(`ERROR: Template "${templateKey}" does not exist in _compiledTemplates!`);
				return '<h2>Template error (does not exist)</h2>';
			}
			this.compileTemplates();
		}
		if (typeof this._compiledTemplates[templateKey] !== 'function') {
			return '<h2>Template error (failed to compile)</h2>';
		}
		return this._compiledTemplates[templateKey].call(this, data['data'], data['config'], this._helpers);
	}

	/**
	 * Adds a helper function to _helpers.
	 * @param {string} helperName - The name of the helper function.
	 * @param {Function} helperFunction - The helper function.
	 */
	addHelper(helperName, helperFunction) {
		if (typeof helperFunction !== 'function') {
			nanoAlert(`NanoTemplate.addHelper failed to add ${helperName} as it is not a function.`);
			return;
		}

		this._helpers[helperName] = helperFunction;
	}

	/**
	 * Adds multiple helper functions to _helpers.
	 * @param {Object} helpers - An object with helper functions.
	 */
	addHelpers(helpers) {
		for (const helperName in helpers) {
			if (Object.prototype.hasOwnProperty.call(helpers, helperName)) {
				this.addHelper(helperName, helpers[helperName]);
			}
		}
	}

	/**
	 * Removes a helper function from _helpers.
	 * @param {string} helperName - The name of the helper function.
	 */
	removeHelper(helperName) {
		if (Object.prototype.hasOwnProperty.call(this._helpers, helperName)) {
			delete this._helpers[helperName];
		}
	}
}

/**
 * Manages all the templates for the UI.
 * @type {NanoTemplate}
 */
const NanoTemplate = new NanoTemplateClass();
