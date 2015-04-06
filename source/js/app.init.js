/*!
 * @app
 * @author me@yocristian.com (De la Hoz, Cristian)
 */

(function(factory) {
	var _ended = function() {
		if(Core.isObject(window.Config) && Core.isObject(window.Copies)) {
			factory(window.App, window.Copies, window.Config);
		}
	};

	window.App = window.App || {};
	
	(function() {
		if(!Core.isObject(window.Config)) {
			Core.ajax({
				type: 'GET',
				url: '/assets/js/config.json'
			}).success(function(Config) {
				window.Config = Config;

				_ended();
			});
		}

		if(!Core.isObject(window.Copies)) {
			Core.ajax({
				type: 'GET',
				url: '/assets/js/copies.json'
			}).success(function(Copies) {
				window.Copies = Copies;

				_ended();
			});
		}
	})();
})(function(App, Copies, Config) {
	var _forEach = Array.prototype.forEach;
	var _isYoutubeLoad = false;

	var services = {
		EXAMPLE: 'path/to/service'
	};

	var _parseSelects = function(_name, _textdefault, _valueDefault, _data, _value, _text, _valueSelected) {
		var IS_SELECTED = false;

		var response = {
			name: _name,
			options: []
		};

		if(core.isData(_data, core.DATATYPE_ARRAY) &&
		   core.isData(_value, core.DATATYPE_STRING) &&
		   core.isData(_text, core.DATATYPE_STRING)) {
			for(var i = 0, len = _data.length; i < len; i++) {
				if(core.hasData(_data[i][_value]) && core.hasData(_data[i][_text])) {
					var option = {
						text: _data[i][_text],
						value: _data[i][_value]
					};

					if(_valueSelected === _data[i][_value]) {
						response.textSelected = _data[i][_text];
						response.valueSelected = true;
						option.selected = true;

						IS_SELECTED = true;
					}

					response.options.push(option);
				}
			}
		}

		if(core.hasData(_valueDefault) && core.hasData(_textdefault)) {
			var option = {
				text: _textdefault,
				value: ''
			};

			if(_valueSelected === _valueDefault || !IS_SELECTED) {
				response.textSelected = _textdefault;
				option.selected = true;
			}
			
			response.options.unshift(option);
		}


		return response;
	};

	var _onlyNumbersCheck = function(e) {
		e = (e) ? e : window.event;
		
		var charCode = (e.which) ? e.which : e.keyCode;

		if(charCode > 31 && (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	};

	var _videoYoutube = function() {
		Core.loadScript('https://www.youtube.com/iframe_api', 'YT_JS');

		window.onYouTubeIframeAPIReady = function() {
			_isYoutubeLoad = true;
		}.bind(this);
	};

	App.models = (function(models) {
		this.service_data = {};

		this.validate = function(data) {
			if(data.length == 0) {
				return true;
			};

			if(Config.debug) {
				for(var i = 0, len = data.length; i < len; i++) {
					for(var ii = 0, llen = data[i].errors.length; ii < llen; ii++) {
						console.error('error_' + data[i].field + '_' + data[i].errors[ii]);
					}
				}
			}
			
			return false;
		};

		this.send = function(service, method, data, fnCallback) {
			Core.ajax({
				type: method,
				url: service,
				data: data
			}).success(fnCallback);
		};

		models.example = (function(example) {
			example.fields = {
				name: 'required',
				last_name: 'required'
			};

			example.save = function(req, fnCallback) {
				if(this.validate(Core.validateObject(req, example.fields))) {
					this.send(services.EXAMPLE, 'GET', req, function(data) {
						if(data.estado === 'error') {
							return fnCallback({ success: false, message: 'error_server_save' });
						}

						return fnCallback({ success: true });
					}.bind(this));
				}
			}.bind(this);

			return example;
		}.bind(this))(models.example || {});

		return models;
	}.bind({}))(App.models || {});

	App.views = (function(views) {
		views.home = function() {

		};

		return views;
	}.bind({}))(App.views || {});

	(function _init() {
		Core.routes({
			'/': 'App.views.home'
		});
	})();
});