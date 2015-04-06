Core.fadeIn = function(el, duration, fnEnded, display) {
	var duration = duration || 350;

	el.style.display = display || 'block';
	el.style.opacity = 0;
	
	Core.animate(el, {
		opacity: 1
	}, duration, function() {
		if(Core.isFunction(fnEnded)) {
			fnEnded();
		}
	});
};