class NanoBaseCallbacksClass {
	constructor() {
		this._canClick = true;
		this._baseBeforeUpdateCallbacks = {};
		this._baseAfterUpdateCallbacks = {
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

	addCallbacks() {
		NanoStateManager.addBeforeUpdateCallbacks(this._baseBeforeUpdateCallbacks);
		NanoStateManager.addAfterUpdateCallbacks(this._baseAfterUpdateCallbacks);
	}

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

const NanoBaseCallbacks = new NanoBaseCallbacksClass();
