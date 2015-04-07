(function(Core) {'use strict';Core.fadeIn = function(el, duration, fnEnded, display) {
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
};Core.fadeOut = function(el, duration, fnEnded) {
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
};Core.swipe = function(el, fnEnded, sensitive) {
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
};Core.autocomplete = function(input, array) {
	input = (Core.isString(input)) ? document.querySelector(input) : input;

	if(!Core.isElementHTML(input)) {
		return console.error('this input does not exist');
	}

	var w_list, list;
	var id_autocomplete = 'autocomplete_' + Core.uniqID();

	var items = [];
	var index;
	var cant;

	var itemHeight, w_listHeight, itemSize;

	var aValue;

	var _callbacks;

	var _filter = function(value) {
		var res = array.filter(function(el) {
			var reg = new RegExp(value);

			return reg.test(Core.removeAcute(el.label.toLowerCase()));
		});

		return res;
	};

	var _list = function() {
		input.addEventListener('focus', function(e) {
			if(!Core.isElementHTML(w_list) && !Core.isElementHTML(list)) {
				var computed = window.getComputedStyle(input);
				var offset = Core.offset(input);
				var top = (parseInt(computed.height) - parseInt(computed.borderBottomWidth)) + (offset.top - parseInt(computed.borderTopWidth));
				var width = (parseInt(computed.width) - parseInt(computed.borderLeftWidth)) - parseInt(computed.borderRightWidth);

				w_list = document.createElement('div');
				w_list.id = id_autocomplete;
				w_list.className = 'ui_autocomplete';
				w_list.style.display = 'none';
				w_list.style.top = top + 'px';
				w_list.style.left =  offset.left + 'px';
				w_list.style.width = width + 'px';

				list = document.createElement('ol');

				document.body.appendChild(w_list);
				w_list.appendChild(list);
			}
		});
	};

	var _itemEvent = function(el, i) {
		el.addEventListener('mouseover', function() {
			input.value = el.innerText;

			if(Math.abs(index) || index == 0) {
				items[Math.abs(index)].className = '';
			}
			
			items[i].className = 'is_active';

			index = i;
		});
	};

	var _append = function(value) {
		var filter = _filter(Core.removeAcute(value.toLowerCase()));

		list.innerHTML = '';
		items = [];
		index = null;

		w_list.style.display = 'block';

		for(var i = 0, len = filter.length; i < len; i++) {
			var item = document.createElement('li');
			item.innerText = filter[i].label;
			item.setAttribute('data-value', filter[i].value);

			_itemEvent(item, i);

			items.push(item);

			list.appendChild(item);
		};
	};

	var _next = function(action) {
		switch(action) {
			case 'DOWN':
				index = (index + 1) % cant;
				break;
			case 'UP':
				index = (index) ? index : cant;
				index = (index - 1) % cant;
				break;
		}

		return Math.abs(index);
	};

	var _calcHeight = function() {
		var cItems = window.getComputedStyle(items[0]);

		itemHeight = parseInt(cItems.height);
		itemHeight = itemHeight + parseInt(cItems.paddingTop);
		itemHeight = itemHeight + parseInt(cItems.paddingBottom);
		itemHeight = itemHeight + parseInt(cItems.borderTopWidth);
		itemHeight = itemHeight + parseInt(cItems.borderBottomWidth);

		var cList = window.getComputedStyle(w_list);

		if(!parseInt(cList.height)) {
			w_listHeight = parseInt(cList.height);
		} else {
			w_listHeight = parseInt(cList.maxHeight);
		}

		itemSize = Math.round(w_listHeight / itemHeight);
	};

	var _select = function(action) {
		cant = items.length;

		if(!itemHeight && !w_listHeight) {
			_calcHeight();
		}

		if(!index && index != 0) {
			index = (action == 'DOWN') ? 0 : cant - 1;

			if(action == 'UP') {
				w_list.scrollTop = w_list.scrollHeight;
			}

			items[index].className = 'is_active';

			return;
		}

		var iActive = Math.abs(index);
		var iNext = _next(action);

		items[iActive].className = '';
		items[iNext].className = 'is_active';

		if(iNext % itemSize == 0 && action == 'DOWN') {
			w_list.scrollTop = iNext * itemHeight;
		} else if(iNext % itemSize == itemSize - 1 && action == 'UP') {
			w_list.scrollTop = (iNext - (itemSize - 1)) * itemHeight;
		}

		input.value = items[iNext].innerText;
	};

	var _event = function() {
		input.addEventListener('keydown', function(e) {
			e = (e) ? e : window.event;

			var charCode = (e.which) ? e.which : e.keyCode;
			var val = input.value;

			if(charCode == 38 || charCode == 40) {
				e.preventDefault();
				e.stopPropagation();

				if(list.innerHTML === '') {
					_append(val);	
				}

				if(w_list.style.display == 'none') {
					w_list.style.display = 'block';
				}

				if(charCode == 38) {
					_select('UP');
				} else if(charCode == 40) {
					_select('DOWN');
				}
			} else {
				_append(val);
			}
		});

		input.addEventListener('blur', function(e) {
			var labelEnd, valueEnd;

			if(items.length > 0) {
				var isEl = Core.isElementHTML(items[index]);
				
				labelEnd = (isEl) ? items[index].innerText : items[0].innerText;
				valueEnd = (isEl) ? items[index].getAttribute('data-value') : items[0].getAttribute('data-value');
			}

			if(!!labelEnd) {
				input.value = labelEnd;
			} else {
				input.value = '';
			}

			w_list.style.display = 'none';

			if(Core.isFunction(_callbacks.blur)) {
				_callbacks.blur({
					label: labelEnd,
					value: valueEnd
				})
			}
		});
	};

	(function _init() {
		input.autocomplete = 'off';

		_list();
		_event();
	})();

	return Core.promise(['blur'], function(data) {
		_callbacks = data;
	});
};Core.calendar = function(input, options) {
	input = (Core.isString(input)) ? document.querySelector(input) : input;

	if(!Core.isElementHTML(input)) {
		return console.error('this input does not exist');;
	}

	var _currentDate = new Date();
	var _currentDay = _currentDate.getDate();
	var _currentMonth = _currentDate.getMonth();
	var _currentYear = _currentDate.getFullYear();

	var _activeDate = _currentDate;

	var _selectDate = _currentDate;
	var _selectDay = _selectDate.getDate();
	var _selectMonth = _selectDate.getMonth();
	var _selectYear = _selectDate.getFullYear();

	var _options = {
		change_month: false,
		change_year: false,
		label_days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		label_months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		rank_year: _currentDate.getFullYear() + ':' + (_currentDate.getFullYear() - 100),
		min_date: null,
		max_date: null
	};

	var w_cal;

	var isOpen = false;
	var idEventESC;

	var id_calendar = 'autocomplete_' + Core.uniqID();

	var _config = function() {
		for(var option in options) {
			if(_options.hasOwnProperty(option)) {
				switch(option) {
					case 'min_date':
					case 'max_date':
						if(Core.isDate(options[option])) {
							_options[option] = {
								year: options[option].getFullYear(),
								month: options[option].getMonth(),
								day: options[option].getDate(),
								instance: options[option]
							};
						} else {
							throw 'Only the instance of JavaScript is accepted Date';
						}
						break;
				}
			} else {
				throw 'This parameter "' + option + '" does not exist.';
			}
		}
	};

	var _getDayInMonths = function(month, year) {
		var days_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var date = days_month[month];

		if(month == 1) {
			if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
				date = 29;
			}
		}

		return date;
	};

	var _getFirstDayMonth = function(month, year) {
		return new Date(year, month, 1).getDay();
	};

	var _create = function() {
		var a_day = _activeDate.getDate();
		var a_month = _activeDate.getMonth();
		var a_year = _activeDate.getFullYear();

		var monthLength = _getDayInMonths(a_month, a_year);
		var firstDay = _getFirstDayMonth(a_month, a_year);
		var calendar = {
			next_month: true,
			prev_month: true
		};

		var _headCalendar = function() {
			//Years
			if(_options.changeYear) {
				calendar.year = [];

				var between = _options.rank_year.split(':');
				var max = Math.max(between[0], between[1]);

				between = Math.abs(between[0] - between[1]);

				for(var y = 0; y < between; y++) {
					calendar.year.push({
						year: max - y,
						value: max - y,
						is_active: (max - y) === a_year
					});
				}
			} else {
				calendar.year = a_year;
			}
			
			//Months
			if(_options.changeYear) {
				calendar.month = [];

				for(var m = 0; m < 12; m++) {
					calendar.month.push({
						month: _options.label_months[m],
						value: m,
						is_active: m === a_month
					});
				}
			} else {
				calendar.month = _options.label_months[a_month];
			}
		};

		var _bodyCalendar = function() {
			var forDay = 0;
			var forWeek = [];

			calendar.day = [];

			//Calc fisrt day;
			for(var d = 0; d < 7; d++) {
				if(firstDay === forDay) {
					break;
				}

				forDay++;

				forWeek.push({ day: '' });
			}

			for(var l = 0; l < monthLength; l++) {
				if(forDay >= 7) {
					calendar.day.push(forWeek);
					forWeek = [];
					forDay = 0;
				}

				forDay++;

				var is_restricted = false;

				if(!!_options.min_date) {
					is_restricted = (l + 1) < _options.min_date.day && a_month == _options.min_date.month && a_year == _options.min_date.year;

					calendar.prev_month = !is_restricted && calendar.prev_month;
				}

				if(!!_options.max_date) {
					is_restricted = (l + 1) > _options.min_date.day && a_month == _options.min_date.month && a_year == _options.min_date.year;

					calendar.next_month = !is_restricted && calendar.next_month;
				}

				forWeek.push({
					day: l + 1,
					value: l + 1,
					not_restricted: !is_restricted,
					is_current: (l + 1) == _currentDay && _currentMonth == a_month && _currentYear == a_year,
					is_active: (l + 1) == _selectDay && _selectMonth == a_month && _selectYear == a_year,
					is_full: true
				});

				if(l == monthLength - 1) {
					calendar.day.push(forWeek);
				};
			}
		};

		(function _init() {
			_headCalendar();
			_bodyCalendar();
		})();

		return calendar;
	};

	var _insert = function() {
		input.addEventListener('focus', function(e) {
			if(!Core.isElementHTML(w_cal)) {
				var computed = window.getComputedStyle(input);
				var offset = Core.offset(input);
				var top = (parseInt(computed.height) - parseInt(computed.borderBottomWidth)) + (offset.top - parseInt(computed.borderTopWidth));

				w_cal = document.createElement('div');
				w_cal.setAttribute('id', id_calendar);
				w_cal.setAttribute('class', 'ui_calendar');
				w_cal.style.display = 'none';
				w_cal.style.top = top + 'px';
				w_cal.style.left =  offset.left + 'px';

				document.body.appendChild(w_cal);

				_putHTML();
				_event();
			}
		});
	};

	var _putHTML = function() {
		var view = _create();
		view.options = _options;

		w_cal.innerHTML = Handlebars.templates.core_calendar(view);
	};

	var _nextMonth = function() {
		_activeDate = new Date(_activeDate.getFullYear(), _activeDate.getMonth() + 1);

		_putHTML();
	};

	var _prevMonth = function() {
		_activeDate = new Date(_activeDate.getFullYear(), _activeDate.getMonth() - 1);

		_putHTML();
	};

	var _select = function(year, month, day) {
		_selectDate = new Date(year || _activeDate.getFullYear(), month || _activeDate.getMonth(), day || _activeDate.getDate());
		_selectDay = _selectDate.getDate();
		_selectMonth = _selectDate.getMonth();
		_selectYear = _selectDate.getFullYear();

		input.value = _selectYear + '-' + Core.leadZero(_selectMonth + 1, 2) + '-' + Core.leadZero(_selectDay, 2);

		_close();
	};

	var _open = function() {
		if(!isOpen) {
			isOpen = true;

			Core.setOnEvent('ESC', idEventESC);
			document.body.addEventListener('click', _close);

			w_cal.style.display = 'block';

		}
	};

	var _close = function() {
		if(isOpen) {
			isOpen = false;

			Core.setOffEvent('ESC', idEventESC);
			document.body.removeEventListener('click', _close);

			w_cal.style.display = 'none';
		}
	};

	var _event = function() {
		w_cal.addEventListener('click', function(e) {
			e.stopPropagation();
			e.preventDefault();

			if(Core.hasMatchedElement(e.target, 'a.js__next_month')) {
				return _nextMonth();
			};

			if(Core.hasMatchedElement(e.target, 'a.js__prev_month')) {
				return _prevMonth();
			};

			if(Core.hasMatchedElement(e.target, 'a.js__select_date')) {
				Core.cssClass.remove(w_cal.querySelector('.is_active'), 'is_active');
				Core.cssClass.add(Core.parents(e.target, 'td'), 'is_active');

				return _select(null, null, Core.data.get(e.target, 'value'));
			};
		}, true);

		input.addEventListener('keydown', function(e) {
			e.preventDefault();
		});

		input.addEventListener('click', function(e) {
			e.stopPropagation();

			_open();
		});

		idEventESC = Core.setEventsESC(function() {
			_close();
		});
		Core.setOffEvent('ESC', idEventESC);
	};

	(function _init() {
		input.autocomplete = 'off';

		_config();
		_insert();
	})();

	return {
		nextMonth: _nextMonth,
		prevMonth: _prevMonth,
		open: _open,
		close: _close
	};
};/**
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
};Core.scrollTo = function(y, duration, fnEnded) {
	var duration = duration || 350;
	var el = (document.documentElement.scrollTop) ? document.documentElement : document.body;

	Core.animate(el, {
		scrollTop: y
	}, duration, function() {
		if(Core.isFunction(fnEnded)) {
			fnEnded();
		}
	});
};})(Core);