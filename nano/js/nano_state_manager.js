/**
 * Manages the state and data for the UI.
 */
class NanoStateManagerClass {
	/**
	 * Is set to true when all of this ui's templates have been processed/rendered.
	 * @type {boolean}
	 */
	#isInitialised = false;

	/**
	 * The initial data object.
	 * @type {Object}
	 */
	#data = null;

	/**
	 * An array of callbacks which are called when new data arrives, before it is processed.
	 * @type {Object.<string, Function>}
	 */
	#beforeUpdateCallbacks = {};

	/**
	 * An array of callbacks which are called when new data arrives, after it is processed.
	 * @type {Object.<string, Function>}
	 */
	#afterUpdateCallbacks = {};

	/**
	 * An array of state objects, these can be used to provide custom javascript logic.
	 * @type {Object.<string, NanoStateClass>}
	 */
	#states = {};

	/**
	 * The current state.
	 * @type {NanoStateClass}
	 */
	#currentState = null;

	/**
	 * The constructor for the NanoStateManagerClass.
	 * It initializes the state manager and sets up the initial data.
	 */
	init() {
		this.#data = JSON.parse(document.querySelector('#InitialData').textContent);

		if (this.#data == null || !this.#data.hasOwnProperty('config') || !this.#data.hasOwnProperty('data')) {
			nanoAlert('Error: Initial data did not load correctly.');
		}

		let stateKey = 'default';
		if (this.#data['config'].hasOwnProperty('stateKey') && this.#data['config']['stateKey']) {
			stateKey = this.#data['config']['stateKey'].toLowerCase();
		}

		this.setCurrentState(stateKey);

		document.addEventListener('templatesLoaded', () => {
			this.doUpdate(this.#data);
			this.#isInitialised = true;
		});
	}

	/**
	 * Receive update data from the server.
	 * @param {string} jsonString - The JSON string received from the server.
	 */
	receiveUpdateData(jsonString) {
		let updateData;

		try {
			updateData = JSON.parse(jsonString);
		} catch (error) {
			nanoAlert(`recieveUpdateData failed. \nError name: ${error.name}\nError Message: ${error.message}`);
			return;
		}

		if (!updateData.hasOwnProperty('data')) {
			updateData['data'] = this.#data && this.#data.hasOwnProperty('data') ? this.#data['data'] : {};
		}

		if (this.#isInitialised) {
			this.doUpdate(updateData);
		} else {
			this.#data = updateData;
		}
	}

	/**
	 * This function does the update by calling the methods on the current state.
	 * @param {Object} data - The data to be used in the update.
	 */
	doUpdate(data) {
		if (this.#currentState == null) {
			return;
		}

		data = this.#currentState.onBeforeUpdate(data);

		if (data === false) {
			nanoAlert('data is false, return');
			return;
		}

		this.#data = data;

		this.#currentState.onUpdate(this.#data);
		this.#currentState.onAfterUpdate(this.#data);
	}

	/**
	 * Execute all callbacks in the callbacks array/object provided, updateData is passed to them for processing and potential modification.
	 * @param {Object.<string, Function>} callbacks - The callbacks to be executed.
	 * @param {Object} data - The data to be passed to the callbacks.
	 * @returns {Object} The potentially modified data.
	 */
	executeCallbacks(callbacks, data) {
		for (const key in callbacks) {
			if (callbacks.hasOwnProperty(key) && typeof callbacks[key] === 'function') {
				data = callbacks[key].call(this, data);
			}
		}

		return data;
	}

	/**
	 * Adds a callback to be executed before the update.
	 * @param {string} key - The key of the callback.
	 * @param {Function} callbackFunction - The callback function.
	 */
	addBeforeUpdateCallback(key, callbackFunction) {
		this.#beforeUpdateCallbacks[key] = callbackFunction;
	}

	/**
	 * Adds multiple callbacks to be executed before the update.
	 * @param {Object.<string, Function>} callbacks - The callbacks to be added.
	 */
	addBeforeUpdateCallbacks(callbacks) {
		for (const callbackKey in callbacks) {
			if (callbacks.hasOwnProperty(callbackKey)) {
				this.addBeforeUpdateCallback(callbackKey, callbacks[callbackKey]);
			}
		}
	}

	/**
	 * Removes a callback to be executed before the update.
	 * @param {string} key - The key of the callback.
	 */
	removeBeforeUpdateCallback(key) {
		if (this.#beforeUpdateCallbacks.hasOwnProperty(key)) {
			delete this.#beforeUpdateCallbacks[key];
		}
	}

	/**
	 * Executes all callbacks to be executed before the update.
	 * @param {Object} data - The data to be passed to the callbacks.
	 * @returns {Object} The potentially modified data.
	 */
	executeBeforeUpdateCallbacks(data) {
		return this.executeCallbacks(this.#beforeUpdateCallbacks, data);
	}

	/**
	 * Adds a callback to be executed after the update.
	 * @param {string} key - The key of the callback.
	 * @param {Function} callbackFunction - The callback function.
	 */
	addAfterUpdateCallback(key, callbackFunction) {
		this.#afterUpdateCallbacks[key] = callbackFunction;
	}

	/**
	 * Adds multiple callbacks to be executed after the update.
	 * @param {Object.<string, Function>} callbacks - The callbacks to be added.
	 */
	addAfterUpdateCallbacks(callbacks) {
		for (const callbackKey in callbacks) {
			if (callbacks.hasOwnProperty(callbackKey)) {
				this.addAfterUpdateCallback(callbackKey, callbacks[callbackKey]);
			}
		}
	}

	/**
	 * Removes a callback to be executed after the update.
	 * @param {string} key - The key of the callback.
	 */
	removeAfterUpdateCallback(key) {
		if (this.#afterUpdateCallbacks.hasOwnProperty(key)) {
			delete this.#afterUpdateCallbacks[key];
		}
	}

	/**
	 * Executes all callbacks to be executed after the update.
	 * @param {Object} data - The data to be passed to the callbacks.
	 * @returns {Object} The potentially modified data.
	 */
	executeAfterUpdateCallbacks(data) {
		return this.executeCallbacks(this.#afterUpdateCallbacks, data);
	}

	/**
	 * Adds a state to the NanoStateManager.
	 * @param {NanoStateClass} state - The state to be added.
	 */
	addState(state) {
		if (!(state instanceof NanoStateClass)) {
			nanoAlert('ERROR: Attempted to add a state which is not instanceof NanoStateClass');
			return;
		}
		if (!state.key) {
			nanoAlert('ERROR: Attempted to add a state with an invalid stateKey');
			return;
		}
		this.#states[state.key] = state;
	}

	/**
	 * Sets the current state of the NanoStateManager.
	 * @param {string} stateKey - The key of the state.
	 * @returns {boolean} True if the state was successfully set, false otherwise.
	 */
	setCurrentState(stateKey) {
		if (typeof stateKey === 'undefined' || !stateKey) {
			nanoAlert('ERROR: No state key was passed!');
			return false;
		}
		if (!this.#states.hasOwnProperty(stateKey)) {
			nanoAlert(`ERROR: Attempted to set a current state which does not exist: ${stateKey}`);
			return false;
		}

		const previousState = this.#currentState;

		this.#currentState = this.#states[stateKey];

		if (previousState != null) {
			previousState.onRemove(this.#currentState);
		}

		this.#currentState.onAdd(previousState);

		return true;
	}

	/**
	 * Gets the current state of the NanoStateManager.
	 * @returns {NanoStateClass} The current state.
	 */
	getCurrentState() {
		return this.#currentState;
	}
}

/**
 * Manages the state of the UI.
 * @type {NanoStateManager}
 */
const NanoStateManager = new NanoStateManagerClass();