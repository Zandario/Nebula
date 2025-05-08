/**
 * @fileOverview
 * This file contains the NanoTemplate class, which is responsible for loading, compiling, and rendering templates using doT.js.
 * It also manages template data and helpers, allowing for dynamic content generation in a browser context.
 */
class NanoTemplateClass {
	constructor() {
		this._templateData = {};
		this._templateFileName = '';
		this._templates = {};
		this._compiledTemplates = {};
		this._helpers = {};
	}

	init() {
		const templateDataElement = document.querySelector('#TemplateData');
		const initialDataElement = document.querySelector('#InitialData');

		if (templateDataElement && initialDataElement) {
			this._templateData = JSON.parse(templateDataElement.textContent);
			const initialData = JSON.parse(initialDataElement.textContent);
			this._templateFileName = initialData['config']['templateFileName'];

			if (!this._templateData) {
				alert('Error: Template data did not load correctly.');
			}

			this.loadAllTemplates();
		} else {
			alert('Error: Required elements (#TemplateData or #InitialData) not found in the DOM.');
		}
	}

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
					alert(`ERROR: Loading template ${key} (${this._templateData[key]}) failed with error: ${error.message}`);
					return;
				}
				delete this._templateData[key];
			}

			const event = new Event('templatesLoaded');
			document.dispatchEvent(event);
		} catch (error) {
			alert('ERROR: Failed to locate or parse templates file.');
		}
	}

	compileTemplates() {
		for (const key in this._templates) {
			try {
				this._compiledTemplates[key] = doT.template(this._templates[key], null, this._templates);
			} catch (error) {
				alert(`ERROR: Compiling template key "${key}" failed with error: ${error}`);
			}
		}
	}

	addTemplate(key, templateString) {
		this._templates[key] = templateString;
	}

	templateExists(key) {
		return Object.prototype.hasOwnProperty.call(this._templates, key);
	}

	parse(templateKey, data) {
		if (!Object.prototype.hasOwnProperty.call(this._compiledTemplates, templateKey) || !this._compiledTemplates[templateKey]) {
			if (!Object.prototype.hasOwnProperty.call(this._templates, templateKey)) {
				alert(`ERROR: Template "${templateKey}" does not exist in _compiledTemplates!`);
				return '<h2>Template error (does not exist)</h2>';
			}
			this.compileTemplates();
		}
		if (typeof this._compiledTemplates[templateKey] !== 'function') {
			return '<h2>Template error (failed to compile)</h2>';
		}
		return this._compiledTemplates[templateKey].call(this, data['data'], data['config'], this._helpers);
	}

	addHelper(helperName, helperFunction) {
		if (typeof helperFunction !== 'function') {
			alert(`NanoTemplate.addHelper failed to add ${helperName} as it is not a function.`);
			return;
		}

		this._helpers[helperName] = helperFunction;
	}

	addHelpers(helpers) {
		for (const helperName in helpers) {
			if (Object.prototype.hasOwnProperty.call(helpers, helperName)) {
				this.addHelper(helperName, helpers[helperName]);
			}
		}
	}

	removeHelper(helperName) {
		if (Object.prototype.hasOwnProperty.call(this._helpers, helperName)) {
			delete this._helpers[helperName];
		}
	}
}

const NanoTemplate = new NanoTemplateClass();
