const inHerito = (function(){
	
	'use strict';
	
	let 
	
		/** 
		 * @private 
		 * Log object if object has debug set to true
		*/
		logObject = function (instance) {
			Object.defineProperty(instance, 'debug', {writable: false, enumerable: false});
			console.dir(instance);
		},
		
		/** 
		 * @private 
		 * Merge parent's props into instance if indicated otherwise inherit all by default in JS manner
		*/
		inherit = (instance, superProps) => {
			// Internal calls are inaccessible
			Object.defineProperty(instance, 'inherit', {writable: false, enumerable: false});
			
			let mixins = instance.inherit,
			inheritedObject = {};
			
			// Assign props as objects
			mixins.map((currentValue) => {
				inheritedObject[currentValue] = superProps[currentValue];
				return Object.setPrototypeOf(instance, inheritedObject);	
			});
		},
		
		/** 
		 * @private
		 * Render object to DOM if specified in object creation
		 * Prototype, do not use for production yet
		*/
		render = (instance) => {
			if (instance.view) {
				let view = instance.view;
				view.template.src = view.imageUrl;
				view.parent.querySelector(view.context).appendChild(view.template);
			} else {
				console.error('instance does not have a view');
			}
		},
		
		/**
		 * @public
		 * Create object instance and log or render if true
		*/
		create = function create(...options) {
			let instance = Object.create(this),
				superProps = this;
						
			// set only the new properties
			options.map((currentValue) => {
				Object.assign(instance, currentValue);
			});
			
			// options if provided
			instance['view'] ? render(instance) : false;
			Array.isArray(instance['inherit']) ? inherit(instance, superProps): false;
			instance['debug'] ? logObject(instance) : false;

			return instance;
		};
	
	// public api
	return {
		create : create
	};	
	
})();

module.exports = {
	create: inHerito.create
}