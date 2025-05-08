class NanoStateDefaultClass extends NanoStateClass {
	constructor() {
		super();
		this.key = 'default';

		//this.parent.constructor.call(this);
		this.key = this.key.toLowerCase();

		NanoStateManager.addState(this);
	}
}
const NanoStateDefault = new NanoStateDefaultClass();