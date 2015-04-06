Core.alert = function(options) {
	var w_alerts = document.querySelector('#site_alert');

	var _callbacks;

	var _events = function() {
		w_alerts.addEventListener('click', function(e) {
			if(Core.hasMatchedElement(e.target, 'a.js__close_alert')) {
				return Core.fadeOut(w_alerts, 350, function() {
					if(Core.isFunction(_callbacks.closed)) {
						_callbacks.closed();
					}
				});
			};
		});
	};

	var _wrapper = function() {
		if(!Core.isElementHTML(w_alerts)) {
			w_alerts = document.createElement('section');
			w_alerts.setAttribute('id', 'site_alert');
			w_alerts.setAttribute('class', 'ui_alerts');

			document.body.appendChild(w_alerts);
		
			_events();
		}
	};

	var _insert = function() {
		var view = {};

		if(Core.isString(options.title)) {
			view.title = options.title;
		}

		if(Core.isString(options.text)) {
			view.html = options.text;
		}

		w_alerts.innerHTML = Handlebars.templates.core_alerts(view);
	};

	var _open = function() {
		Core.fadeIn(w_alerts, 350);
	};

	(function _init() {
		_wrapper();
		_insert();
		_open();
	})();

	return Core.promise(['closed'], function(data) {
		_callbacks = data;
	});
};