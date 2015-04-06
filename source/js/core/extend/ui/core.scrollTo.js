Core.scrollTo = function(y, duration, fnEnded) {
	var duration = duration || 350;
	var el = (document.documentElement.scrollTop) ? document.documentElement : document.body;

	Core.animate(el, {
		scrollTop: y
	}, duration, function() {
		if(Core.isFunction(fnEnded)) {
			fnEnded();
		}
	});
};