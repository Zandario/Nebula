class NanoStateManagerClass {
	constructor() {
		this._isInitialised = false;
		this._data = null;
		this._beforeUpdateCallbacks = {};
		this._afterUpdateCallbacks = {};
		this._states = {};
		this._currentState = null;
	}

	init() {
		this._data = JSON.parse(document.querySelector('#InitialData').textContent);

		if (this._data == null || !this._data.hasOwnProperty('config') || !this._data.hasOwnProperty('data')) {
			alert('Error: Initial data did not load correctly.');
		}

		let stateKey = 'default';
		if (this._data['config'].hasOwnProperty('stateKey') && this._data['config']['stateKey']) {
			stateKey = this._data['config']['stateKey'].toLowerCase();
		}

		this.setCurrentState(stateKey);

		document.addEventListener('templatesLoaded', () => {
			this.doUpdate(this._data);
			this._isInitialised = true;
		});
	}

	receiveUpdateData(jsonString) {
		let updateData;

		try {
			updateData = JSON.parse(jsonString);
		} catch (error) {
			alert(`recieveUpdateData failed. \nError name: ${error.name}\nError Message: ${error.message}`);
			return;
		}

		if (!updateData.hasOwnProperty('data')) {
			updateData['data'] = this._data && this._data.hasOwnProperty('data') ? this._data['data'] : {};
		}

		if (this._isInitialised) {
			this.doUpdate(updateData);
		} else {
			this._data = updateData;
		}
	}

	doUpdate(data) {
		if (this._currentState == null) {
			return;
		}

		data = this._currentState.onBeforeUpdate(data);

		if (data === false) {
			alert('data is false, return');
			return;
		}

		this._data = data;

		this._currentState.onUpdate(this._data);
		this._currentState.onAfterUpdate(this._data);
	}

	executeCallbacks(callbacks, data) {
		for (const key in callbacks) {
			if (callbacks.hasOwnProperty(key) && typeof callbacks[key] === 'function') {
				data = callbacks[key].call(this, data);
			}
		}

		return data;
	}

	addBeforeUpdateCallback(key, callbackFunction) {
		this._beforeUpdateCallbacks[key] = callbackFunction;
	}

	addBeforeUpdateCallbacks(callbacks) {
		for (const callbackKey in callbacks) {
			if (callbacks.hasOwnProperty(callbackKey)) {
				this.addBeforeUpdateCallback(callbackKey, callbacks[callbackKey]);
			}
		}
	}

	removeBeforeUpdateCallback(key) {
		if (this._beforeUpdateCallbacks.hasOwnProperty(key)) {
			delete this._beforeUpdateCallbacks[key];
		}
	}

	executeBeforeUpdateCallbacks(data) {
		return this.executeCallbacks(this._beforeUpdateCallbacks, data);
	}

	addAfterUpdateCallback(key, callbackFunction) {
		this._afterUpdateCallbacks[key] = callbackFunction;
	}

	addAfterUpdateCallbacks(callbacks) {
		for (const callbackKey in callbacks) {
			if (callbacks.hasOwnProperty(callbackKey)) {
				this.addAfterUpdateCallback(callbackKey, callbacks[callbackKey]);
			}
		}
	}

	removeAfterUpdateCallback(key) {
		if (this._afterUpdateCallbacks.hasOwnProperty(key)) {
			delete this._afterUpdateCallbacks[key];
		}
	}

	executeAfterUpdateCallbacks(data) {
		return this.executeCallbacks(this._afterUpdateCallbacks, data);
	}

	addState(state) {
		if (!(state instanceof NanoStateClass)) {
			alert('ERROR: Attempted to add a state which is not instanceof NanoStateClass');
			return;
		}
		if (!state.key) {
			alert('ERROR: Attempted to add a state with an invalid stateKey');
			return;
		}
		this._states[state.key] = state;
	}

	setCurrentState(stateKey) {
		if (typeof stateKey === 'undefined' || !stateKey) {
			alert('ERROR: No state key was passed!');
			return false;
		}
		if (!this._states.hasOwnProperty(stateKey)) {
			alert(`ERROR: Attempted to set a current state which does not exist: ${stateKey}`);
			return false;
		}

		const previousState = this._currentState;

		this._currentState = this._states[stateKey];

		if (previousState != null) {
			previousState.onRemove(this._currentState);
		}

		this._currentState.onAdd(previousState);

		return true;
	}

	getCurrentState() {
		return this._currentState;
	}
}

const NanoStateManager = new NanoStateManagerClass();