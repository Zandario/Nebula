/**
 * This is the base state class, it is not to be used directly.
 */
class NanoStateClass {
	constructor() {
		/**
		 * The key of the state.
		 * @type {string}
		 */
		this.key = null;
		/**
		 * Indicates if the layout has been rendered.
		 * @type {boolean}
		 */
		this.layoutRendered = false;
		/**
		 * Indicates if the content has been rendered.
		 * @type {boolean}
		 */
		this.contentRendered = false;
		/**
		 * Indicates if the map has been initialised.
		 * @type {boolean}
		 */
		this.mapInitialised = false;

		/*if (typeof this.key != 'string' || !this.key.length)
		{
			nanoAlert('ERROR: Tried to create a state with an invalid state key: ' + this.key);
			return;
		}

		this.key = this.key.toLowerCase();

		NanoStateManager.addState(this);*/
	}

	/**
	 * Checks if the current state is this state.
	 * @returns {boolean} True if the current state is this state, false otherwise.
	 */
	isCurrent() {
		return NanoStateManager.getCurrentState() == this;
	}

	/**
	 * Adds the state and sets up the base callbacks and helpers.
	 * @param {NanoStateClass} previousState - The previous state.
	 */
	onAdd(previousState) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		NanoBaseCallbacks.addCallbacks();
		NanoBaseHelpers.addHelpers();
	}

	/**
	 * Removes the state and removes the base callbacks and helpers.
	 * @param {NanoStateClass} nextState - The next state.
	 */
	onRemove(nextState) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		NanoBaseCallbacks.removeCallbacks();
		NanoBaseHelpers.removeHelpers();
	}

	/**
	 * Executes before the state is updated.
	 * @param {Object} data - The data to be used in the update.
	 * @returns {Object|boolean} The data to continue, false to prevent onUpdate and onAfterUpdate.
	 */
	onBeforeUpdate(data) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		data = NanoStateManager.executeBeforeUpdateCallbacks(data);

		return data; // Return data to continue, return false to prevent onUpdate and onAfterUpdate
	}

	/**
	 * Updates the state.
	 * @param {Object} data - The data to be used in the update.
	 */
	onUpdate(data) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		try {
			if (
				!this.layoutRendered ||
				(data["config"].hasOwnProperty("autoUpdateLayout") &&
					data["config"]["autoUpdateLayout"])
			) {
				document.getElementById('uiLayout').innerHTML = NanoTemplate.parse('layout', data);
				this.layoutRendered = true;
			}
			if (
				!this.contentRendered ||
				(data["config"].hasOwnProperty("autoUpdateContent") &&
					data["config"]["autoUpdateContent"])
			) {
				document.getElementById('uiContent').innerHTML = NanoTemplate.parse('main', data);

				if (NanoTemplate.templateExists("layoutHeader")) {
					document.getElementById('uiHeaderContent').innerHTML = NanoTemplate.parse('layoutHeader', data);
				}
				this.contentRendered = true;
			}
			if (NanoTemplate.templateExists("mapContent")) {
				if (!this.mapInitialised) {
					// Add drag functionality to the map ui
					document.getElementById('uiMap').style.position = 'absolute';

					document.getElementById('uiMapTooltip').style.display = 'none';

					this.mapInitialised = true;
				}

				document.getElementById('uiMapContent').innerHTML = NanoTemplate.parse('mapContent', data);

				if (
					data["config"].hasOwnProperty("showMap") &&
					data["config"]["showMap"]
				) {
					document.getElementById('uiContent').classList.add('hidden');
					document.getElementById('uiMapWrapper').classList.remove('hidden');
				} else {
					document.getElementById('uiMapWrapper').classList.add('hidden');
					document.getElementById('uiContent').classList.remove('hidden');
				}
			}
			if (NanoTemplate.templateExists("mapHeader")) {
				document.getElementById('uiMapHeader').innerHTML = NanoTemplate.parse('mapHeader', data);
			}
			if (NanoTemplate.templateExists("mapFooter")) {
				document.getElementById('uiMapFooter').innerHTML = NanoTemplate.parse('mapFooter', data);
			}
		} catch (error) {
			nanoAlert(
				"ERROR: An error occurred while rendering the UI: " +
					error.message
			);
			return;
		}
	}

	/**
	 * Executes after the state is updated.
	 * @param {Object} data - The data to be used in the update.
	 */
	onAfterUpdate(data) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		NanoStateManager.executeAfterUpdateCallbacks(data);
	}
}
