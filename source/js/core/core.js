/*!
 * @core Different utilities for projects
 * @author me@yocristian.com (De la Hoz, Cristian)
 */

(function(factory) {
	factory(window.Core = {});
})(function(Core) {
	'use strict';

	var name_file = 'app.core-min.js';

	var body = document.body;
	var html = document.documentElement;

	var _map = Array.prototype.map;

	/**
	 * Contains all functions created for resize windows
	 * @type {Array}
	 */
	var _fnEventsResize = [];

	var _inWindowResize = (function() {
		Core.WINDOW_WIDTH = window.innerWidth;
		Core.WINDOW_HEIGHT = window.innerHeight;

		window.addEventListener('resize', function() {
			Core.WINDOW_WIDTH = window.innerWidth;
			Core.WINDOW_HEIGHT = window.innerHeight;

			if(_fnEventsResize.length > 0) {
				_fnEventsResize.forEach(function(el, i, ar) {
					el.fn();
				});
			}
		});
	})();

	/**
	 * Contains all functions created for scroll move
	 * @type {Array}
	 */
	var _fnEventsScroll = [];

	var _inMoveScroll = (function() {
		document.addEventListener('scroll', function(e) {
			if(_fnEventsScroll.length > 0) {
				var res = {};
				res.docHeight = body.clientHeight;
				res.docScrollTop = body.scrollTop;
				res.scrolltrigger = 0.95;
				res.isEndPage = (res.docScrollTop / (res.docHeight - Core.WINDOW_HEIGHT)) > res.scrolltrigger;

				_fnEventsScroll.forEach(function(element, index, array) {
					element.fn(res);
				});
			}
		});
	})();

	var _fnEventsESC = {};

	var _inKeydownESC = (function() {
		window.addEventListener('keyup', function(e) {
			var key = (window.event) ? e.keyCode : e.which;

			if(key === 27) {
				for(var fn in _fnEventsESC) {
					if(_fnEventsESC[fn].active) {
						_fnEventsESC[fn].fn();
					}
				}
			}
		});
	})();

	var _mappingChar = (function() {
		var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç- ';
		var to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNncc--';

		var obj = {};

		for(var i = 0, len = from.length; i < len; i++) {
			obj[from.charAt(i)] = to.charAt(i);
		}

		return obj;
	})();

	//Data version code.
	Core.VERSION = '3.0.0';

	//Expression regular
	Core.REG_EMAIL = /^\w+([\.-]?\w+)([\w|\.|-])*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
	Core.REG_ISO_DATE = /^[0-9]{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$/;
	Core.REG_SELECTOR = /^(?:\w*(?:#|\.)|\.{1}|#{1}|\w*)[\w._*]+\w$/;
	Core.REG_PIXEL = /^\d+(px)$/;

	//Validation type client terminal
	Core.IS_WEBKIT = (/webkit/i.test(navigator.userAgent));
	Core.IS_SAFARI = (/safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent));
	Core.IS_CHROME = (/safari/i.test(navigator.userAgent) && /chrome/i.test(navigator.userAgent));
	Core.IS_FIREFOX = (/firefox/i.test(navigator.userAgent));
	Core.IS_OLD_IE = (/msie 8/i.test(navigator.userAgent));
	Core.IS_IE = (/msie/i.test(navigator.userAgent));
	Core.IS_IE_9 = (/msie 9/i.test(navigator.userAgent));
	Core.IS_MOBILE = (/iphone|ipad|android|silk|mobile/i.test(navigator.userAgent));

	Core.IS_TOUCH_DEVICE = 'ontouchstart' in document.documentElement;

	Core.prefixes = ['webkit', 'moz', 'ms', 'o'];

	/**
	 * UNIX DATE
	 */
	Core.UNIX_HOUR = 3600000;
	Core.UNIX_DAY = 86400000;
	Core.UNIX_WEEK = 604800000;
	Core.UNIX_MONTH = 2629743000;
	Core.UNIX_YEAR = 31556926000;

	//Verify if browser support history
	Core.HAS_HISTORY = (typeof window.history === 'object') ? typeof window.history.pushState === 'function' : false;

	Core.config = (function(config) {
		var protocol = window.location.protocol;
		var hostname = window.location.hostname;
		var port = window.location.port;

		config.PATH_URL = protocol + "//" + hostname + ((port) ? ':' + port : ''); //Path URL develop
		config.ROUTE_TEMPLATES = 'assets/templates/'; //Route files of templates
		config.TYPE_DATA_AJAX = 'json'; //Type data require in AJAX
		config.TYPE_REQUEST_AJAX = 'POST'; //Type request in AJAX
		//config.FACEBOOK_ID_APP = '840570035983161'; //ID app in facebook
		config.MIN_AGE = 5; //Min age accept in site

		//Config share
		config.SHARE_REQUIRE_CALLBACK = false;

		(function _getQuestionName() {
			var scripts = document.getElementsByTagName('script');
			
			for(var i = 0, len = scripts.length; i < len; i++) {
				var source = scripts[i].src;

				if(source.indexOf(name_file) > 0) {
					if(source.indexOf('?') > 0) {
						source = source.substring(source.indexOf('?') + 1, source.length).split('&');

						source.forEach(function(element, index, array) {
							element = element.split('=');

							switch(element[0]) {
								case 'path_url':
									config.PATH_URL = decodeURIComponent(element[1]);
									break;
							}
						});
					}

					break;
				}
			}
		})();

		return config;
	})(Core.config || {});

	Core.getType = function(value) {
		return Object.prototype.toString.call(value);
	};

	Core.hasMatchedElement = function(el, selector) {
		if(el.matches) {
			return el.matches(selector);
		}

		if(el.matchesSelector) {
			return el.matchesSelector(selector);
		}

		for(var i = 0, len = Core.prefixes.length; i < len; i++) {
			var method = Core.prefixes[i] + 'MatchesSelector';

			if(el[method]) {
				return el[method](selector);
			}
		}
	};

	Core.index = function(els, el) {
		for(var i = 0, len = els.length; i < len; i++) {
			if(els[i] === el) {
				return i;
			}
		}
	};

	Core.is = function(el, validate) {
		var isElement = true;

		var _valElement = function(value) {
			return el.nodeName === value.toUpperCase();
		};

		var _valClass = function(value) {
			return el.classList.contains(value);
		};

		var _valID = function(value) {
			return el.id === value;
		};

		(function _init() {
			if(Core.REG_SELECTOR.test(validate)) {
				validate = validate.split(/(\.|#)/);

				for(var i = 0, len = validate.length; i < len; i++) {
					if(validate[i] === '') {
						continue;
					}

					switch(validate[i]) {
						case '#':
							isElement = isElement && _valID(validate[++i]);
							break;
						case '.':
							isElement = isElement && _valClass(validate[++i]);
							break;
						default: 
							isElement = isElement && _valElement(validate[i]);
							break;
					}
				}
			} else {
				isElement = false;
			}
		})();

		return isElement;
	};

	Core.isNumber = function(value) {
		value = parseInt(value);

		if(isNaN(value)) {
			return false;
		}

		return true;
	};

	Core.isFunction = function(value) {
		return Core.getType(value) === '[object Function]';
	};

	Core.isBoolean = function(value) {
		return Core.getType(value) === '[object Boolean]';
	};

	Core.isUndefined = function(value) {
		return Core.getType(value) === '[object Undefined]';
	};

	Core.isNULL = function(value) {
		return Core.getType(value) === '[object Null]';
	};

	Core.isRegExp = function(value) {
		return Core.getType(value) === '[object RegExp]';
	};

	Core.isElementHTML = function(value) {
		return /^\[object\sHTML(?:[A-Za-z]*)Element\]$/.test(Core.getType(value));
	};

	Core.isDate = function(value) {
		return Core.getType(value) === '[object Date]';
	};

	Core.isDOMStringMap = function() {
		return Core.getType(value) === '[object DOMStringMap]';
	};

	Core.isNodeList = function() {
		return Core.getType(value) === '[object NodeList]';
	};

	Core.isString = function(value, notEmpty) {
		notEmpty = (Core.isBoolean(notEmpty)) ? notEmpty : true;

		if(Core.getType(value) === '[object String]') {
			if(notEmpty) {
				return (value.trim() != '');
			}

			return true;
		}
		
		return false;
	};

	Core.isArray = function(value, notEmpty) {
		notEmpty = (Core.isBoolean(notEmpty)) ? notEmpty : true;

		if(Core.getType(value) === '[object Array]') {
			if(notEmpty) {
				if(value.length > 0) {
					for(var i = 0, len = value.length; i < len; i++) {
						if(!Core.isUndefined(value[i]) || !Core.isNULL(value[i])) {
							return (value[i].trim() !== '');
						}
					}
				}

				return false;
			}

			return true;
		}

		return false;
	};

	Core.isObject = function(value, notEmpty) { 
		notEmpty = (Core.isBoolean(notEmpty)) ? notEmpty : true;

		var type = Core.getType(value);

		if(type === '[object Object]' || type === '[object DOMStringMap]') {
			if(notEmpty) {
				for(var prop in value) {
					return true;
				}
			}

			return true;
		}

		return false;
	};

	Core.isVisible = function(el) {
		if(Core.isElementHTML(el)) {
			var computed = window.getComputedStyle(el);
			var display = computed.display != 'none';
			var visibility = computed.visibility == 'visible';
			
			return display && visibility;
		}
	};

	Core.isHidden = function(el) {
		if(Core.isElementHTML(el)) {
			var computed = window.getComputedStyle(el);
			var display = computed.display == 'none';
			var visibility = computed.visibility != 'visible';

			return display || visibility;
		}
	};

	Core.uniqID = function() {
		var num = Math.floor(Date.now() / 1000) - Math.floor((Math.random() * 0x10000) + 1);

		return num.toString(16).substring(3);
	};

	Core.parents = function(el, validate) {
		if(!Core.REG_SELECTOR.test(validate)) {
			return;
		}

		el = el.parentNode;

		var _find = function() {
			if(!Core.is(el, validate)) {
				el = el.parentNode;

				_find();
			}
		};

		(function _init() {
			_find()
		})();

		return el;
	};

	Core.data = (function(data) {
		var isSupported = (function() {
			var el = document.createElement('div');

			return 'dataset' in el;
		})();

		data.add = function(el, property, value) {
			if(!Core.isElementHTML(el)) {
				return;
			}

			if(isSupported) {
				el.dataset[property] = value;
			} else {
				el.setAttribute('data-' + property, value);
			}

			return data.get(el);
		};

		data.get = function(el, property) {
			if(!Core.isElementHTML(el)) {
				return;
			}

			var obj = {};

			if(isSupported) {
				obj = el.dataset;
			} else {
				var attrs = el.attributes;

				for(var i = 0, len = attrs.length; i < len; i++) {
					if(/^data-(\w-*)/.test(attrs[i].name)) {
						obj[attrs[i].name.substring(5)] = attrs[i].value;
					}
				}
			}

			if(property) {
				if(obj.hasOwnProperty(property)) {
					return obj[property];
				} else {
					throw 'This property "' + property + '" does not exist';
				}
			}

			return obj;
		};

		data.remove = function(el, property) {
			if(!Core.isElementHTML(el)) {
				return;
			}

			if(isSupported) {
				delete el.dataset[property];
			} else {
				if(el.hasAttribute('data-' + property)) {
					el.removeAttribute('data-' + property);
				}
			}

			return data.get(el);
		};

		return data;
	})(Core.data || {});

	Core.cssClass = (function(cssClass) {
		var isSupported = (function() {
			var el = document.createElement('div');

			//return 'classList' in el;
			return false;
		})();

		cssClass.add = function(el, className) {
			if(!Core.isElementHTML(el)) {
				return;
			}

			var arr = /\s/.test(className) ? className.split(' ') : [className];

			for(var i = 0, len = arr.length; i < len; i++) {
				if(!cssClass.has(el, arr[i].trim())) {
					el.className = el.className + ' ' + arr[i].trim();
				}
			}

			return cssClass.get(el);
		};

		cssClass.get = function(el) {
			if(!Core.isElementHTML(el)) {
				return;
			}

			var res = [];
			var arr = (isSupported) ? el.classList : el.className.split(' ');

			for(var i = 0, len = arr.length; i < len; i++) {
				if(arr[i].trim() !== '') {
					res.push(arr[i].trim());
				}
			}

			return res;
		};

		cssClass.has = function(el, className) {
			if(!Core.isElementHTML(el)) {
				return;
			}

			var arr = /\s/.test(className) ? className.split(' ') : [className];
			var all = cssClass.get(el);
			var res = true;

			for(var i = 0, len = arr.length; i < len; i++) {
				if(arr[i].trim() !== '') {
					res = res && (all.indexOf(arr[i].trim()) >= 0);
				}
			}

			return res;
		};

		cssClass.remove = function(el, className) {
			if(!Core.isElementHTML(el)) {
				return;
			}

			var arr = /\s/.test(className) ? className.split(' ') : [className];
			var all = cssClass.get(el);

			for(var i = 0, len = arr.length; i < len; i++) {
				if(arr[i].trim() !== '') {
					all.splice(all.indexOf(arr[i].trim()), 1);
				}
			}

			el.className = all.join(' ');

			return all;
		};

		return cssClass;
	})(Core.cssClass || {});

	Core.removeAcute = function(string) {
		var acute = {
			a: /[áàâãªä]/,
			A: /[ÁÀÂÃÄ]/,
			I: /[ÍÌÎÏ]/,
			i: /[íìîï]/,
			e: /[éèêë]/,
			E: /[ÉÈÊË]/,
			o: /[óòôõºö]/,
			O: /[ÓÒÔÕÖ]/,
			u: /[úùûü]/,
			U: /[ÚÙÛÜ]/,
			c: /ç/,
			C: /Ç/
		}
		var res = _map.call(string, function(x) {
			for(var a in acute) {
				if(acute[a].test(x)) {
					return a;
				}
			}
			return x;
		}).join(''); 

		return res;
	};

	Core.offset = function(el) {
		var x = 0;
		var y = 0;

		while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop) && el != body) {
			var computed = window.getComputedStyle(el);
			var transform = computed.getPropertyValue('-webkit-transform') ||
			                computed.getPropertyValue('-ms-transform') ||
			                computed.getPropertyValue('transform') || 'none';
			var minus = [0, 0];
			var add = [0, 0];

			if(Core.REG_PIXEL.test(computed.borderTopWidth) && Core.REG_PIXEL.test(computed.borderLeftWidth)) {
				add = [parseFloat(computed.borderLeftWidth), parseFloat(computed.borderTopWidth)];
			}

			if(transform !== 'none') {
				var values = transform.split('(')[1].split(')')[0].split(',');

				minus = [Math.abs(values[4]), Math.abs(values[5])];
			}

			x += ((el.offsetLeft + add[0]) - minus[0]) - el.scrollLeft;
			y += ((el.offsetTop + add[1]) - minus[1]) - el.scrollTop;

			el = el.offsetParent;
		}

		return { top: y, left: x };
	};

	/**
	 * Add zeros to numbers
	 * @param  {Number | String} num  number to be added zeros
	 * @param  {Number | String} cant amount of numbers to add
	 * @return {String}               number with zeros
	 */
	Core.leadZero = function(num, cant) {
		num = (!Core.isString(num)) ? num.toString() : num;
		cant = (Core.isString(cant)) ? parseInt(cant) : cant;

		var len = num.length;

		for(var i = 0, sum = (cant - len); i < sum; i++) {
			num = '0' + num;
		}

		return num;
	};

	/**
	 * It is set and saved functions for window resize
	 * @param {Function} fnEvent function that executes when window resize
	 */
	Core.setEventsResize = function(fnEvent) {
		if(Core.isFunction(fnEvent)) {
			fnEvent();

			_fnEventsResize.push({
				fn: fnEvent
			});
		}
	};

	/**
	 * It is save functions for scroll event
	 * @param {Function} fnEvent function that executes when scroll move
	 */
	Core.setEventsScroll = function(fnEvent) {
		if(Core.isFunction(fnEvent)) {
			_fnEventsScroll.push({
				fn: fnEvent
			});
		}
	};

	Core.setEventsESC = function(fnEvent) {
		if(Core.isFunction(fnEvent)) {
			var id = Core.uniqID();

			_fnEventsESC[id] = {
				fn: fnEvent,
				active: true
			};

			return id;
		}
	};

	Core.setOnEvent = function(type, id) {
		switch(type) {
			case 'ESC':
				_fnEventsESC[id].active = true;
				break;
		}
	};

	Core.setOffEvent = function(type, id) {
		switch(type) {
			case 'ESC':
				_fnEventsESC[id].active = false;
				break;
		}
	};

	/**
	 * Verifies whether a number is even
	 * @param  {Number}  num number to be evaluated
	 * @return {Boolean}
	 */
	Core.isEven = function(num) {
		num = (Core.isString(num)) ? parseInt(num) : num;

		return isNaN(num) ? null : (number%2 == 0);
	};

	Core.infoDate = (function(parent) {
		var currentDate = new Date();

		//Name months
		parent.dataMonths = [
			{ ID: 1, SMALL_NAME: 'Ene', LONG_NAME: 'Enero' },
			{ ID: 2, SMALL_NAME: 'Feb', LONG_NAME: 'Febrero' },
			{ ID: 3, SMALL_NAME: 'Mar', LONG_NAME: 'Marzo' },
			{ ID: 4, SMALL_NAME: 'Abr', LONG_NAME: 'Abril' },
			{ ID: 5, SMALL_NAME: 'May', LONG_NAME: 'Mayo' },
			{ ID: 6, SMALL_NAME: 'Jun', LONG_NAME: 'Junio' },
			{ ID: 7, SMALL_NAME: 'Jul', LONG_NAME: 'Julio' },
			{ ID: 8, SMALL_NAME: 'Ago', LONG_NAME: 'Agosto' },
			{ ID: 9, SMALL_NAME: 'Sep', LONG_NAME: 'Septiembre' },
			{ ID: 10, SMALL_NAME: 'Oct', LONG_NAME: 'Octubre' },
			{ ID: 11, SMALL_NAME: 'Nov', LONG_NAME: 'Noviembre' },
			{ ID: 12, SMALL_NAME: 'Dic', LONG_NAME: 'Diciembre' }
		];
		
		//Days
		parent.dataDays = [];

		//Years
		parent.dataYears = [];

		//Birth Years
		parent.dataBirdYear = [];

		(function init() {
			for(var i = 0; i <= 99; i++) {
				//for days
				if(i < 31) {
					var numD = i + 1;

					parent.dataDays.push({ ID: numD, DAY: Core.leadZero(numD, 2) });
				}

				//for years
				var numY = currentDate.getFullYear() - i;
				var numYBirth = (currentDate.getFullYear() - Core.config.MIN_AGE) - i;

				parent.dataYears.push({ ID: numY, YEAR: numY });
				parent.dataBirdYear.push({ ID: numYBirth, YEAR: numYBirth });
			}
		})();

		return parent;
	})(Core.infoDate || {});

	Core.promise = function(varibles, cb) {
		var calls = {};
		var data = {};

		for(var i = 0, len = varibles.length; i < len; i++) {
			calls[varibles[i]] = null;
		}
		
		varibles.forEach(function(el, i, arr) {
			calls[el] = function(out) {
				if(!Core.isNULL(out) && !Core.isUndefined(out)) {
					data[el] = out;
				}

				return calls;
			};
		});

		if(Core.isFunction(cb)) {
			setTimeout(function() { cb(data) }, 1);
		}

		return calls;
	};

	Core.ajax = function(options) {
		if(!Core.isString(options.url)) {
			return console.error({ message: 'It requires the URL request' });
		}

		var _options;

		var _config = function() {
			options.type = (!Core.isString(options.type)) ? Core.config.TYPE_REQUEST_AJAX : options.type.toUpperCase();
			options.data = options.data || {};
			options.data = Object.keys(options.data || {}).map(function(k) {
				return encodeURIComponent(k) + "=" + encodeURIComponent(options.data[k]);
			}).join('&');
			options.dataType = (!Core.isString(options.dataType)) ? Core.config.TYPE_DATA_AJAX : options.dataType.toLowerCase();
			options.url = options.url.trim();
			options.url = (Core.isBoolean(options.isOut) && options.isOut) ? options.url : Core.config.PATH_URL + options.url;
			options.url = (options.type === 'GET') ? options.url + '?' + options.data : options.url;
		};

		var _xhr = function() {
			var xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', function(e) {
				if(Core.isFunction(_options.progress)) {
					_options.progress(e);	
				}
			}, false);
			xhr.addEventListener('load', function(e) {
				var response = e.target.response;

				if(options.dataType === 'json') {
					try {
						response = JSON.parse(response);
					} catch(e) {
						console.error('Malformed JSON');
					}
				}

				if(Core.isFunction(_options.success)) {
					return _options.success(response, xhr.status);
				}
			}, false);
			xhr.open(options.type, options.url);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(options.data);
		};

		(function _init() {
			_config();

			setTimeout(function() {
				_xhr();
			}, 1);
		})();

		return Core.promise(['success', 'progress'], function(data) {
			_options = data;
		});
	};

	/**
	 * Take the URL and organizes data taken
	 * @return {Object} data collected and organized in the URL
	 */
		/**
	 * Take the URL and organizes data taken
	 * @return {Object} data collected and organized in the URL
	 */
	Core.getDataURL = function() {
		var objDataURL = {
			href: location.href
		};

		var getPathname = function() {
			var pathname = location.href;
			pathname = pathname.substring(Core.config.PATH_URL.length + 1, pathname.length);
			pathname = (/\/$/.test(pathname)) ? pathname.substring(0, pathname.length - 1) : pathname;
			pathname = (/[#]/gi.test(pathname)) ? pathname.substring(0, pathname.indexOf('#')) : pathname;

			if(!/^#/.test(pathname)) {
				if(pathname.length - 1 > 0) {
					return {
						string: pathname,
						split: pathname.split('/')
					};
				}
			}
		};

		var getSearch = function() {
			var search = location.search;
			search = search.substring(1);
			search = search.split('&');

			if(Core.isArray(search)) {
				var obj = {};

				for (var i = 0, len = search.length; i < len; i++) {
					var sl = search[i].split('=');

					obj[sl[0]] = sl[1];
				}

				return obj;
			}
		};

		var getHash = function() {
			var hash = location.hash;

			if(Core.isString(hash)) {
				var inStr = (hash.indexOf('#!') >= 0) ? ((hash.indexOf('#!/') >= 0) ? 3 : 2) : ((hash.indexOf('#/') >= 0) ? 2 : 1);
				var enStr = (hash.indexOf('/', hash.length - 2) > 0) ? hash.length - 1 : hash.length;

				hash = hash.substring(inStr, enStr);
				hash = hash.split('/');

				return hash;
			}
		};

		(function init() {
			var pathname = getPathname();
			var search = getSearch();
			var hash = getHash();

			if(Core.isObject(pathname)) {
				objDataURL.pathname = pathname;
			}

			if(Core.isObject(search)) {
				objDataURL.search = search;
			}

			if(Core.isArray(hash)) {
				objDataURL.hash = hash;
			}
		})();

		return objDataURL;
	};

	Core.routes = function(routes) {
		var dataURL = Core.getDataURL();

		var pathname = dataURL.pathname;
		pathname = (Core.isUndefined(pathname)) ? false : pathname.split;

		var hash = dataURL.hash;
		hash = (Core.isUndefined(hash)) ? false : hash;

		var _getHash = function() {
			return null;
		};

		var _getSearch = function() {
			return null;
		};

		var _getFn = function(fnString) {
			var fnArr = fnString.split('.');
			var fnCache = window;

			for(var i = 0, len = fnArr.length; i < len; i++) {
				if(typeof fnCache !== 'object') {
					return undefined;
				}

				fnCache = fnCache[fnArr[i]];
			}

			return fnCache;
		};

		var _call = function(fnString, fnThis, fnParams) {
			var fn = _getFn(fnString);

			if(typeof fn === 'function') {
				fn.apply(fnThis, fnParams);
			} else {
				console.error(fnString + ' function does not exist.');
			}
		};

		(function _init() {
			for(var prop in routes) {
				var isPathname = /^\/[A-Za-z0-9\-\_]/.test(prop);
				var isHash = /^#[A-Za-z0-9\-\_]/.test(prop);

				if(!/^\//.test(prop) && !/^#/.test(prop)) {
					console.error(prop + ' is an invalid parameter.');
				};

				if((!!pathname || !!hash) && (isPathname || isHash)) {
					var routesArr;
					var thisIs = false;

					if(/^\/[A-Za-z0-9\-\_]/.test(prop)) {
						routesArr = prop.split('/');

						if(routesArr[0].trim() === '') {
							routesArr.shift();
						}

						for(var i = 0, len = routesArr.length; i < len; i++) {
							if(pathname[i] === routesArr[i]) {
								thisIs = true;
								continue;
							}
						}
					} else if(/^#/.test(prop)) {
						console.info('It is a hash and not developed yet');
						continue;
					}

					if(thisIs) {
						_call(routes[prop], {
							hash: _getHash(),
							search: _getSearch()
						}, []);

						break;
					}
					//console.log(pathname, routesArr);
					//console.log(routes[prop], prop);
				} else if(!pathname && !hash) {
					//Check if a URL and if the variables received
					var path_url = Core.config.PATH_URL;
					path_url = (path_url.charAt(path_url.length) != '/') ? path_url + '/' : path_url;

					if(prop === '/' && path_url === dataURL.href) {
						_call(routes[prop], {
							hash: _getHash(),
							search: _getSearch()
						}, []);

						break;
					}
				}
			}
		})();
	};

	/**
	 * Form data is taken
	 * @param  {String | HTMLElement | Object} form form that will take the information
	 * @return {Object}                              form data is returned
	 */
	Core.getDataForm = function(form) {
		form = (Core.isString(form)) ? document.querySelector(form) : form;

		if(!Core.isElementHTML(form)) {
			console.error('this form does not exist');
			return false;
		}

		var obj = {};

		for(var i = 0, len = form.length; i < len; i++) {
			if(Core.isString(form[i].name) && Core.isString(form[i].value)) {
				if((form[i].type === 'radio' || form[i].type === 'checkbox') && !form[i].checked) {
					continue;
				};

				obj[form[i].name] = form[i].value.trim();
			}
		}

		return obj;
	};

	Core.setDataForm = function(form, data) {
		form = (Core.isString(form)) ? document.querySelector(form) : form;

		if(!Core.isElementHTML(form)) {
			console.error('this form does not exist');
			return false;
		}

		for(var prop in data) {
			try {
				var input = form.querySelector('input[name=' + prop + ']');

				if(input.type === 'text' || input.type === 'password') {
					input.value = data[prop];
				}
			} catch(e) { }
		};
	};

	Core.validateForm = function(form, options) {
		form = (Core.isString(form)) ? document.querySelector(form) : form;

		if(!Core.isElementHTML(form)) {
			console.error('this form does not exist');
			return false;
		}

		var lenFields = form.length;

		var _callbacks;

		var _events =  function() {
			if(Core.isObject(options.keyDown)) {
				for(var prop in options.keyDown) {
					if(Core.isFunction(options.keyDown[prop])) {
						for(var i = 0; i < lenFields; i++) {
							if(form[i].name === prop) {
								form[i].addEventListener('keydown', options.keyDown[prop]);

								break;
							}
						}
					}
				}
			}
		};

		var _error = function(data) {
			var res = [];

			data.forEach(function(el, i, ar) {
				for(var a = 0; i < lenFields; i++) {
					if(form[i].name === el.field) {
						res.push({
							el: form[i],
							field: el.field,
							errors: el.errors
						})

						break;
					}
				}
			});
			
			if(Core.isFunction(_callbacks.error)) {
				try {
					_callbacks.error(res);
				} catch(e) {
					console.error('This is the error in the error function: "' + e.message + '"');
				}
			}
		};

		var _success = function(data) {
			if(Core.isFunction(_callbacks.success)) {
				try {
					var toSend = _callbacks.success(data);

					return (Core.isBoolean(toSend)) ? toSend : true;
				} catch(e) {
					console.error('This is the error in the success function: "' + e.message + '"');
					return false;
				}
			}

			return true;
		};

		var _submit = function() {
			form.addEventListener('submit', function(e) {
				e.preventDefault();
				
				var dataForm = Core.getDataForm(form);
				var validate = Core.validateObject(dataForm, options.fields);

				if(validate.length > 0) {
					_error(validate);
				} else {
					if(!_success(dataForm) || validate.length > 0) {
						e.preventDefault();
					}
				}
			});
		};

		(function _init() {
			_events();
			_submit();
		})();

		return Core.promise(['success', 'error'], function(data) {
			_callbacks = data;
		});
	};

	Core.animate = function(el, properties, duration, fnComplete) {
		el = (Core.isString(el)) ? document.querySelector(el) : el;

		if(!Core.isElementHTML(el)) {
			console.error('this element does not exist');
			return false;
		}

		var duration = duration || 350;

		var start = Date.now();
		var animated = 0;
		var completed = 0;

		var computed = window.getComputedStyle(el);

		var _complete = function() {
			completed++;

			if(completed === animated && Core.isFunction(fnComplete)) {
				fnComplete();
			};
		};

		var _animate = function(prop, from, to, inPx, isStyle) {
			if(from === to) {
				_complete();
				return;
			}

			(function _init() {
				var currentTime = Date.now();
				var time = Math.min(1, ((currentTime - start) / duration));
				var eased = time;
				var loop = ((eased * (to - from)) + from);

				if(isStyle) {
					el.style[prop] = (inPx) ? loop + 'px' : loop;

				} else {
					el[prop] = (inPx) ? loop + 'px' : loop;
				}

				if(time < 1) {
					requestAnimationFrame(_init);
				} else {
					_complete();
				}
			})();
		};

		(function _init() {
			for(var prop in properties) {
				if(properties.hasOwnProperty(prop)) {
					var from = (!!computed[prop]) ? computed[prop] : el[prop];
					animated++;

					_animate(prop, parseFloat(from), properties[prop], /^(-(?!px)|\d)\d*px$/.test(from), !!computed[prop]);
				}
			}
		})();
	};

	Core.validateObject = function(object, fields) {
		if(!Core.isObject(object)) {
			console.error('Object is undefined');

			return;
		}

		var response = [];

		var _valEmail = function(value) {
			return !Core.REG_EMAIL.test(value);
		};

		var _valMin = function(value, num) {
			return value.length < num;
		};

		var _valMax = function(value, num) {
			return value.length > num;
		};

		var _valCompare = function(value, str) {
			if(object.hasOwnProperty(str)) {
				return value !== object[str];
			}

			return true;
		};

		var _valNumber = function(num) {
			return !parseInt(num);
		};

		var _valIsoDate = function(value) {
			return !Core.REG_ISO_DATE.test(value);
		};

		var _validate = function(value, field, num, str) {
			if(object.hasOwnProperty(field)) {
				if(value === 'required') {
					return false;
				};

				switch(value) {
					case 'email':
						return _valEmail(object[field]);
						break;
					case 'min':
						return _valMin(object[field], num);
						break;
					case 'max':
						return _valMax(object[field], num);
						break;
					case 'compare':
						return _valCompare(object[field], str);
						break;
					case 'num':
						return _valNumber(object[field]);
						break;
					case 'iso_date':
						return _valIsoDate(object[field]);
						break;
				}
			} else if(value === 'required') {
				return true;
			}
		};

		(function _init() {
			for(var field in fields) {
				var errors = [];
				var request = fields[field].split('|');

				for(var i = 0, len = request.length; i < len; i++) {
					var value = request[i];
					var num = 0;
					var string = '';

					var isNum = /^[a-z]*:[0-9]*$/.test(value);
					var isString = /^[a-z]*:[\w-]*$/.test(value);

					if(isNum || isString) {
						value = value.split(':');

						if(isNum && isString) {
							num = value[1];
						} else if(!isNum && isString) {
							string = value[1];
						}
						
						value = value[0];
					}

					if(_validate(value, field, num, string)) {
						errors.push(value);
					}
				}

				if(errors.length > 0) {
					response.push({
						field: field,
						errors: errors
					});
				}
			}
		})();

		return response;
	};

	/**
	 * Load asynchronous javascript
	 * @param {String}   src       script source location
	 * @param {String}   id        identification of the script
	 * @param {Function} fnSuccess function to be called if the load succeeds
	 */
	Core.loadScript = function(src, id, fnSuccess) {
		if(Core.isString(src) && Core.isString(id)) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.id = id;
			script.src = src;

			var first = document.getElementsByTagName('script')[0];

			first.parentNode.insertBefore(script, first);

			if(Core.isFunction(fnSuccess)) {
				if(script.readyState) {
					script.onreadystatechange = function() {
						fnSuccess();
					};
				} else {
					script.onload = fnSuccess;
				}
			}
		}
	};
});