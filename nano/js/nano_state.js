// This is the base state class, it is not to be used directly

class NanoStateClass {
	constructor() {
		this.key = null;
		this.layoutRendered = false;
		this.contentRendered = false;
		this.mapInitialised = false;

		/*if (typeof this.key != 'string' || !this.key.length)
		{
			alert('ERROR: Tried to create a state with an invalid state key: ' + this.key);
			return;
		}

		this.key = this.key.toLowerCase();

		NanoStateManager.addState(this);*/
	}
	isCurrent() {
		return NanoStateManager.getCurrentState() == this;
	}
	onAdd(previousState) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		NanoBaseCallbacks.addCallbacks();
		NanoBaseHelpers.addHelpers();
	}
	onRemove(nextState) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		NanoBaseCallbacks.removeCallbacks();
		NanoBaseHelpers.removeHelpers();
	}
	onBeforeUpdate(data) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		data = NanoStateManager.executeBeforeUpdateCallbacks(data);

		return data; // Return data to continue, return false to prevent onUpdate and onAfterUpdate
	}
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
			alert(
				"ERROR: An error occurred while rendering the UI: " +
					error.message
			);
			return;
		}
	}
	onAfterUpdate(data) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		NanoStateManager.executeAfterUpdateCallbacks(data);
	}
	alertText(text) {
		// Do not add code here, add it to the 'default' state (nano_state_defaut.js) or create a new state and override this function
		alert(text);
	}
}
