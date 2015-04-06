Core.calendar = function(input, options) {
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
};