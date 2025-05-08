/**
 * NanoBaseCallbacksClass is a class that manages before and after update callbacks
 * for the NanoStateManager, handling UI updates and interactions.
 */
class NanoBaseCallbacksClass {
	constructor() {
		/**
		 * Used to disable clicks for a short period after each click (to avoid mis-clicks)
		 * @type {boolean}
		 */
		this._canClick = true;

		/**
		 * An object that stores callbacks to be executed before an update.
		 * @type {Object}
		 */
		this._baseBeforeUpdateCallbacks = {};

		/**
		 * An object that stores callbacks to be executed after an update.
		 * @type {Object}
		 */
		this._baseAfterUpdateCallbacks = {
			/**
			 * This callback is triggered after new data is processed.
			 * It updates the status/visibility icon and adds click event handling to buttons/links.
			 * @param {Object} updateData - The data received from the update.
			 *
			 * @returns {Object} The same updateData object that was passed in.
			 */
			status: (updateData) => {
				let uiStatusClass;
				if (updateData['config']['status'] === 2) {
					uiStatusClass = 'icon24 uiStatusGood';
					document.querySelectorAll('.linkActive').forEach(el => el.classList.remove('inactive'));
				} else if (updateData['config']['status'] === 1) {
					uiStatusClass = 'icon24 uiStatusAverage';
					document.querySelectorAll('.linkActive').forEach(el => el.classList.add('inactive'));
				} else {
					uiStatusClass = 'icon24 uiStatusBad';
					document.querySelectorAll('.linkActive').forEach(el => el.classList.add('inactive'));
				}
				document.getElementById('uiStatusIcon').className = uiStatusClass;

				document.querySelectorAll('.linkActive').forEach(el => el.classList.remove('linkPending'));

				document.querySelectorAll('.linkActive').forEach(el => {
					el.addEventListener('click', (event) => {
						event.preventDefault();
						const href = el.dataset.href;
						if (href && this._canClick) {
							this._canClick = false;
							setTimeout(() => {
								this._canClick = true;
							}, 300);
							if (updateData['config']['status'] === 2) {
								setTimeout(() => el.classList.add('linkPending'), 300);
							}
							window.location.href = href;
						}
					});
				});

				return updateData;
			},
			/**
			 * This callback is triggered after new data is processed.
			 * It updates map icons and adds event handling to the zoom link.
			 * @param {Object} updateData - The data received from the update.
			 *
			 * @returns {Object} The same updateData object that was passed in.
			 */
			nanomap: (updateData) => {
				const uiMapTooltip = document.getElementById('uiMapTooltip');
				document.querySelectorAll('.mapIcon').forEach(el => {
					el.addEventListener('mouseenter', () => {
						uiMapTooltip.innerHTML = el.querySelector('.tooltip').innerHTML;
						uiMapTooltip.style.display = 'block';
						setTimeout(() => {
							uiMapTooltip.style.display = 'none';
						}, 5000);
					});
				});

				document.querySelectorAll('.zoomLink').forEach(el => {
					el.addEventListener('click', (event) => {
						event.preventDefault();
						const zoomLevel = el.dataset.zoomLevel;
						const uiMapObject = document.getElementById('uiMap');
						const uiMapWidth = uiMapObject.offsetWidth * zoomLevel;
						const uiMapHeight = uiMapObject.offsetHeight * zoomLevel;

						uiMapObject.style.zoom = zoomLevel;
						uiMapObject.style.left = '50%';
						uiMapObject.style.top = '50%';
						uiMapObject.style.marginLeft = `-${Math.floor(uiMapWidth / 2)}px`;
						uiMapObject.style.marginTop = `-${Math.floor(uiMapHeight / 2)}px`;
					});
				});

				document.getElementById('uiMapImage').src = `${updateData.config.mapName}-${updateData.config.mapZLevel}.png`;

				return updateData;
			}
		};
	}

	/**
	 * Adds the callbacks stored in _baseBeforeUpdateCallbacks and _baseAfterUpdateCallbacks to the StateManager.
	 */
	addCallbacks() {
		NanoStateManager.addBeforeUpdateCallbacks(this._baseBeforeUpdateCallbacks);
		NanoStateManager.addAfterUpdateCallbacks(this._baseAfterUpdateCallbacks);
	}

	/**
	 * Removes the callbacks stored in _baseBeforeUpdateCallbacks and _baseAfterUpdateCallbacks from the StateManager.
	 */
	removeCallbacks() {
		for (const callbackKey in this._baseBeforeUpdateCallbacks) {
			if (this._baseBeforeUpdateCallbacks.hasOwnProperty(callbackKey)) {
				NanoStateManager.removeBeforeUpdateCallback(callbackKey);
			}
		}
		for (const callbackKey in this._baseAfterUpdateCallbacks) {
			if (this._baseAfterUpdateCallbacks.hasOwnProperty(callbackKey)) {
				NanoStateManager.removeAfterUpdateCallback(callbackKey);
			}
		}
	}
}

/**
 * The global instance of the NanoBaseCallbacksClass.
 * @type {NanoBaseCallbacksClass}
 */
const NanoBaseCallbacks = new NanoBaseCallbacksClass();
