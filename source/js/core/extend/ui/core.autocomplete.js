Core.autocomplete = function(input, array) {
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
};