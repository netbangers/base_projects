Core.swipe = function(el, fnEnded, sensitive) {
	el = (Core.isString(el)) ? document.querySelector(el) : el;

	if(!Core.isElementHTML(el) || !Core.isFunction(fnEnded)) {
		return console.error('Some parameters missing');
	}
	var sensitive = sensitive || 50;

	var xDown = null;
	var yDown = null;

	var _start = function(e) {
		xDown = (e.touches) ? e.touches[0].clientX : e.clientX;
		yDown = (e.touches) ? e.touches[0].clientY : e.clientY;
	};

	var _move = function(e) {
		if (!xDown || !yDown) {
			return;
		}

		var xUp = (e.touches) ? e.touches[0].clientX : e.clientX;
		var yUp = (e.touches) ? e.touches[0].clientY : e.clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;

		if(Math.abs(xDiff) > sensitive || Math.abs(yDiff) > sensitive) {
			if(Math.abs(xDiff) > Math.abs(yDiff)) {
				if(xDiff > 0) {
					fnEnded('left');
				} else {
					fnEnded('right');
				}
			} else {
				if(yDiff > 0) {
					fnEnded('up');
				} else { 
					fnEnded('down');
				}
			}

			xDown = null;
			yDown = null;
		}

	};

	(function _init() {
		if(Core.IS_MOBILE) {
			el.addEventListener('touchstart', _start, false);
			el.addEventListener('touchmove', _move, false);
		} else {
			el.addEventListener('mousedown', function(e) {
				_start(e);

				el.addEventListener('mousemove', _move);
			}, false);

			el.addEventListener('mouseup', function() {
				el.removeEventListener('mousemove', _move);
			});
		}
	})();
};
