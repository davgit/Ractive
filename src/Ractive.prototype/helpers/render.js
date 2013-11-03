// Render instance to element specified here or at initialization
render = function ( ractive, options ) {
	var el, transitionManager;

	el = ( options.el ? getEl( options.el ) : ractive.el );

	// Clear the element, unless `append` is `true`
	if ( el && !options.append ) {
		el.innerHTML = '';
	}

	ractive._transitionManager = transitionManager = makeTransitionManager( ractive, options.complete );

	// Render our *root fragment*
	ractive.fragment = new DomFragment({
		descriptor: ractive.template,
		root: ractive,
		owner: ractive, // saves doing `if ( ractive.parent ) { /*...*/ }` later on
		parentNode: el
	});

	processDeferredUpdates( ractive, true );

	if ( el ) {
		el.appendChild( ractive.fragment.docFrag );
	}

	// trigger intros, now that elements are in the DOM
	while ( ractive._defTransitions.length ) {
		ractive._defTransitions.pop().init(); // TODO rename...
	}

	// transition manager has finished its work
	ractive._transitionManager = null;
	transitionManager.ready();

	ractive.rendered = true;
};