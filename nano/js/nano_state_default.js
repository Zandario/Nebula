/**
 * NanoStateDefaultClass is a state class with a default key.
 * That's it...
 * Load bearing bs.
 */
class NanoStateDefaultClass extends NanoStateClass {
	constructor() {
		super();
		/**
		 * The key of the state.
		 * @type {string}
		 */
		this.key = 'default';

		//this.parent.constructor.call(this);
		this.key = this.key.toLowerCase();

		NanoStateManager.addState(this);
	}
}
/** @type {NanoStateDefaultClass} */
const NanoStateDefault = new NanoStateDefaultClass();