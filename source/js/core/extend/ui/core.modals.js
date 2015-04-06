/**
 * Basic interactions that must be modal box
 * @param  {Object}   settings adjustments must have the modal box
 * @param  {Function} fnOpen   runs when the modal is opened
 * @param  {Function} fnClose  runs when the modal closes
 * @return {Object}            information and interactions that exist in the modal
 */
var _isModalPrevOpen = false;

Core.modals = function(settings, fnOpen, fnClose) {
	var wModal = document.querySelector(settings.wrap);
	var wSection = wModal.querySelector(settings.section);
	var bClose, bOpen;

	var isOpen = false;
	var isNotScroll = false;

	var idEvtESC;

	var _open = function() {
		_isModalPrevOpen = (wModal.style.display === 'block');
		isOpen = true;
		isNotScroll = body.classList.contains('not_scroll');

		wSection.style.display = 'block';

		if(!_isModalPrevOpen) {
			Core.fadeIn(wModal, 350, function() {
				Core.setOnEvent('ESC', idEvtESC);
			});
		}

		if(Core.isFunction(fnOpen)) {
			fnOpen();
		}

		if(!isNotScroll) {
			body.classList.add('not_scroll');
		}
	};

	var _close = function() {
		if(!_isModalPrevOpen) {
			Core.fadeOut(wModal, 350, function() {
				isOpen = false;

				if(!isNotScroll) {
					isNotScroll = false;

					body.classList.remove('not_scroll');
				}
				
				wSection.style.display = 'none';

				if(Core.isFunction(fnClose)) {
					fnClose();
				}

				Core.setOffEvent('ESC', idEvtESC);
			});
		} else {
			_isModalPrevOpen = false;
			isOpen = false;
			wSection.style.display = 'none';

			if(Core.isFunction(fnClose)) {
				fnClose();
			}
		}
	};

	var _events = function() {
		wModal.addEventListener('click', _close);
		wSection.addEventListener('click', function(e) {
			e.stopPropagation();
		});

		if(Core.isString(settings.close)) {
			bClose = wSection.querySelector(settings.close);

			if(Core.isElementHTML(bClose)) {
				bClose.addEventListener('click', _close);
			}
		}

		if(Core.isString(settings.open)) {
			bOpen = document.querySelector(settings.open);

			if(Core.isElementHTML(bOpen)) {
				bOpen.addEventListener('click', _open);
			}
		}
	};

	(function _init() {
		idEvtESC = Core.setEventsESC(function() {
			_close();
		});
		Core.setOffEvent('ESC', idEvtESC);

		_events();
	})();

	return {
		isOpen: function() { return isOpen; },
		open: _open,
		close: _close
	};
};