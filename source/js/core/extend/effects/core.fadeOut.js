Core.fadeOut = function(el, duration, fnEnded) {
	var duration = duration || 350;

	el.style.opacity = 1;

	Core.animate(el, {
		opacity: 0
	}, duration, function() {
		el.style.display = 'none';

		if(Core.isFunction(fnEnded)) {
			fnEnded();
		}
	});
};