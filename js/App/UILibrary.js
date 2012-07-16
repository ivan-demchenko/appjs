App = App || {UI:{}};

App.UI.Library = {
	dialog : function (element, params) {
		var _element = element,
		_params = {};

		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.Dialog, params);
		} else {
			_params = App.UI.Settings.Initial.Dialog;
		}
		
		return {
			init: function() {
				$(_element).dialog(_params);
				return this;
			},
			Modal : function () {
				$(_element).dialog("option", "modal", true);
				return this;
			},
			SetTitle : function (title) {
				$(_element).dialog("option", "title", title);
				return this;
			},
			SetButtons : function (buttons) {
				$(_element).dialog("option", "buttons", buttons);
				return this;
			},
			SetContent : function (data) {
				$(_element).html(data);
				return this;
			},
			Show : function (element) {
				$(_element).dialog('open');
				return this;
			},
			Hide : function (clean) {
				$(_element).dialog('close');
				if (clean)
					$(_element).html('');
				return this;
			}
		}
	},
	tabs : function (element, params) {
		var _element = element,
		_params = {};
		
		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.Tabs, params);
		} else {
			_params = App.UI.Settings.Initial.Tabs;
		}
		
		return {
			init : function () {
				$(_element).tabs(_params);
				return this;
			},
			setActiveTab : function (index) {
				$(_element).tabs("select", index);
			}
		}
	},
	slider : function (element, params) {
		var _element = element,
		_params = {};
		
		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.Slider, params);
		} else {
			_params = App.UI.Settings.Initial.Slider;
		}
		
		return {
			init : function () {
				$(_element).slider(_params);
				return this;
			},
			Min : function (val) {
				if (val === undefined) {
					return $(_element).slider("option", "min");
				} else {
					$(_element).slider("option", "min", val);
					return this;
				}
			},
			Max : function (val) {
				if (val === undefined) {
					return $(_element).slider("option", "max");
				} else {
					$(_element).slider("option", "max", val);
					return this;
				}
			},
			Step : function (val) {
				if (val === undefined) {
					return $(_element).slider("option", "step");
				} else {
					$(_element).slider("option", "step", val);
					return this;
				}
			},
			setOrientation : function (val) {
				if (val != 'vertical' || val != 'horizontal') {
					val = 'vertical';
				}
				$(_element).slider("option", "orientation", val);
				return this;
			},
			setIsRange : function (val) {
				$(_element).slider("option", "range", val);
				return this;
			},
			Value : function (val) {
				if (val === undefined) {
					if ($(_element).slider('option', 'range')) {
						return $(_element).slider("option", "values");
					} else {
						return $(_element).slider("option", "value");
					}
				} else {
					if ($.isArray(val)) {
						if (val.length === 2) {
							$(_element).slider("option", "values", val);
						} else {
							console.log('Number of elements must be two!');
						}
					} else {
						$(_element).slider("option", "value", val);
					}
					return this;
				}
			}
		}
	},
	buttonset : function (element, params) {
		var _element = element;
		
		return {
			init : function () {
				$(_element).buttonset();
				return this;
			}
		}
	},
	button : function (element, params) {
		var _element = element;
		
		return {
			init : function () {
				$(_element).button();
				return this;
			}
		}
	},
	datePicker : function (element, params) {
		var _element = element,
		_params = {};
		
		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.DatePicker, params);
		} else {
			_params = App.UI.Settings.Initial.DatePicker;
		}
		
		return {
			init : function () {
				$(_element).datepicker(_params);
				return this;
			},
			DateFormat : function (val) {
				if (val == undefined) {
					return $(_element).datepicker("option", "dateFormat");
				} else {
					$(_element).datepicker("option", "dateFormat", val);
					return this;
				}
			},
			MinDate : function (val) {
				if (val == undefined) {
					return $(_element).datepicker("option", "minDate");
				} else {
					$(_element).datepicker("option", "minDate", val);
					return this;
				}
			},
			MaxDate : function (val) {
				if (val == undefined) {
					return $(_element).datepicker("option", "maxDate");
				} else {
					$(_element).datepicker("option", "maxDate", val);
					return this;
				}
			}
		}
	},
	autocomplete : function (element, params) {
		var _element = element,
		_params = {};
		
		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.Input.Autocomplete, params);
		} else {
			_params = App.UI.Settings.Initial.Input.Autocomplete;
		}
		
		return {
			init : function () {
				$(_element).autocomplete(_params);
				return this;
			},
			setDataSourse : function (val) {
				$(_element).autocomplete("option", "source", val);
				return this;
			},
			setDataRender : function (template) {
				$(_element).data("autocomplete")._renderItem = function (ul, item) {
					return $("<li></li>")
					.data("item.autocomplete", item)
					.append(template)
					.appendTo(ul);
				}
			}
		}
	},
	inputNumeric : function (element, params) {
		var _element = element,
		_params = {};
		
		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.Input.Numeric, params);
		} else {
			_params = App.UI.Settings.Initial.Input.Numeric;
		}
		
		return {
			init : function () {
				$(_element).format(_params);
				return this;
			}
		}
	},
	inputModey : function (element, params) {
		var _element = element,
		_params = {};
		
		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.Input.Numeric, params);
		} else {
			_params = App.UI.Settings.Initial.Input.Numeric;
		}
		
		return {
			init : function () {
				$(_element).format(_params);
				return this;
			}
		}
	},
	inputTime : function (element, params) {
		var _element = element,
		_params = App.UI.Settings.Initial.Input.Time;
		
		return {
			init : function () {
				$(_element).mask(_params.format, {
					placeholder : _params.placeholder,
					completed : function () {
						var val = $(_element).val().split(':');
						if (val[0] * 1 > 23)
							val[0] = '23';
						if (val[1] * 1 > 59)
							val[1] = '59';
						$(_element).val(val.join(':'));
						$(_element).next(':input').focus();
					}
				});
				return this;
			}
		}
	},
	inputMasked : function (element, params) {
		var _element = element,
		_params = App.UI.Settings.Initial.Input.Masked;
		
		return {
			init : function () {
				if ($(_element).attr('data-mask') !== undefined) {
					$(_element).mask($(_element).data('mask'), {
						placeholder : _params.placeholder
					});
				} else {
					$(_element).mask(_params.format, {
						placeholder : _params.placeholder
					});
				}
				return this;
			}
		}
	},
	progressbar : function (element, params) {
		var _element = element,
		_params = {};
		
		if (params !== null || params !== undefined || params !== 'undefined') {
			$.extend(true, _params, App.UI.Settings.Initial.Progressbar, params);
		} else {
			_params = App.UI.Settings.Initial.Progressbar;
		}
		
		return {
			init : function () {
				$(_element).progressbar(_params);
				return this;
			},
			setValue : function (val) {
				$(_element).progressbar("option", "value", val);
				return this;
			}
		}
	},
	form : function (element, params) {
		var _form = $(element),
		_customValidation,
		_validator,
		_formSender = null, // Object with rules
		_elementsArray = _form.find('input, select, select, textarea');
		/**
		 * Init function
		 * Binds input fields elements
		 * Handles submiting
		 */
		return {
			init : function () {
				_validator = _form.validate({
					debug: true,
					submitHandler : function (form) {
						alert('Form has been sent');
						//_form.ajaxSubmit();
					}
				});
				return this;
			},
			/*
			 * Use this function to attach some event handlers to element
			 */
			BindElements : function (afterBindElements) {
				if (afterBindElements != null && (typeof afterBindElements === 'function')) {
					afterBindElements();
				}
			},
			Reset : function() {
				_validator.resetForm();
				return this;
			},
			/*
			 * Run form submition
			 */
			Send : function (success) {
				_form.submit();
				return this;
			},
			/*
			 * User defined validation function
			 */
			ValidationRules : function (inpRules) {
				if (inpRules !== undefined) {
					//_form.validate(inpRules);
					_validator.settings.rules = inpRules.rules;
					_validator.settings.messages = inpRules.messages;
				} else {
					return _form.rules();
				}
			},
			
			/**
			 * Validate form on emptiness and requirement
			 */
			Validator : function () {
				return _validator;
			}
		}
	}
};