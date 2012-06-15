App = App || {};

App.Ui = (function($){
    'use strict';
    
    return {
        Dialog: function(element, params){
            var _element = element,
                _params = {};
            
            if(params !== null || params !== undefined || params !== 'undefined') {
                $.extend(true, _params, App.Settings.UI.Initial.Dialog, params);
            } else {
                _params = App.Settings.UI.Initial.Dialog;
            }

            $(_element).dialog(_params);

            return {
                Modal: function() {
                    $(_element).dialog("option", "modal", true);
                    return this;
                },
                SetTitle: function(title) {
                    $(_element).dialog("option", "title", title);
                    return this;
                },
                SetButtons: function(buttons) {
                    $(_element).dialog("option", "buttons", buttons);
                    return this;
                },
                SetContent: function(data) {
                    $(_element).html(data);
                    return this;
                },
                Show: function(element) {
                    $(_element).dialog('open');
                    return this;
                },
                Hide: function(clean) {
                    $(_element).dialog('close');
                    if(clean)
                        $(_element).html('');
                    return this;
                }
            }
        },
        Tabs: function(element, params) {
            var _element = element,
                _params = {};

            if(params !== null || params !== undefined || params !== 'undefined') {
                $.extend(true, _params, App.Settings.UI.Initial.Tabs, params);
            } else {
                _params = App.Settings.UI.Initial.Tabs;
            }

            return {
                init: function() {
                    $(_element).tabs(_params);
                    return this;
                },
                setActiveTab: function(index) {
                    $(_element).tabs("select", index);
                }
            }
        },
        Slider: function(element, params) {
            var _element = element,
                _params = {};
            
            if(params !== null || params !== undefined || params !== 'undefined') {
                $.extend(true, _params, App.Settings.UI.Initial.Slider, params);
            } else {
                _params = App.Settings.UI.Initial.Slider;
            }

            return {
                init: function() {
                    $(_element).slider(_params);
                    return this;
                },
                Min: function(val){
                    if(val==undefined) {
                    	return $(_element).slider("option", "min");
                    } else {
                    	$(_element).slider("option", "min", val);
                    	return this;
                    }
                },
                Max: function(val){
                	if(val==undefined) {
                    	return $(_element).slider("option", "max");
                    } else {
                    	$(_element).slider("option", "max", val);
                    	return this;
                    }
                },
                Step: function(val){
                	if(val==undefined) {
                    	return $(_element).slider("option", "step");
                    } else {
                    	$(_element).slider("option", "step", val);
                    	return this;
                    }
                },
                setOrientation: function(val){
                    if(val != 'vertical' || val != 'horizontal') {
                        val = 'vertical';
                    }
                    $(_element).slider("option", "orientation", val);
                    return this;
                },
                setIsRange: function(val){
                    $(_element).slider("option", "range", val);
                    return this;
                },
				Value: function(val) {
					if(val==undefined) {
						if($(_element).slider('option', 'range')) {
	                    	return $(_element).slider("option", "values");
						} else {
	                  		return $(_element).slider("option", "value");
						}
                    } else {
                    	if($.isArray(val)) {
							if(val.length==2) {
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
        ButtonSet: function(element, params) {
            var _element = element;
            
            return {
                init: function() {
                    $(_element).buttonset();
                    return this;
                }
            }
        },
        Button: function(element, params) {
            var _element = element;
            
            return {
                init: function() {
                    $(_element).button();
                    return this;
                }
            }
        },
        DatePicker: function(element, params) {
            var _element = element,
                _params = {};
            
            if(params !== null || params !== undefined || params !== 'undefined') {
                $.extend(true, _params, App.Settings.UI.Initial.DatePicker, params);
            } else {
                _params = App.Settings.UI.Initial.DatePicker;
            }

            return {
                init: function() {
                    $(_element).datepicker(_params);
                    return this;
                },
                DateFormat: function(val) {
                	if(val==undefined) {
                		return $(_element).datepicker("option", "dateFormat");
                	} else {
                		$(_element).datepicker("option", "dateFormat", val);
                		return this;
                	}
                },
                MinDate: function(val) {
                	if(val==undefined) {
                		return $(_element).datepicker("option", "minDate");
                	} else {
                		$(_element).datepicker("option", "minDate", val);
                		return this;
                	}
                },
                MaxDate: function(val) {
                	if(val==undefined) {
                		return $(_element).datepicker("option", "maxDate");
                	} else {
                		$(_element).datepicker("option", "maxDate", val);
                		return this;
                	}
                }
            }
        },
        Input: {
            Autocomplete: function(element, params){
                var _element = element,
                    _params = {};

                if(params !== null || params !== undefined || params !== 'undefined') {
                    $.extend(true, _params, App.Settings.UI.Initial.Input.Autocomplete, params);
                } else {
                    _params = App.Settings.UI.Initial.Input.Autocomplete;
                }

                return {
                    init: function() {
                        $(_element).autocomplete(_params);
                        return this;
                    },
                    setDataSourse: function(val) {
                        $(_element).autocomplete("option", "source", val);
                        return this;
                    },
                    setDataRender: function(template) {
                        $(_element).data("autocomplete")._renderItem = function(ul, item) {
                            return $("<li></li>")
                                    .data("item.autocomplete", item)
                                    .append(template)
                                    .appendTo(ul);
                        }
                    }
                }
            },
            Numeric: function(element, params) {
                var _element = element,
                    _params = {};

                if(params !== null || params !== undefined || params !== 'undefined') {
                    $.extend(true, _params, App.Settings.UI.Initial.Input.Numeric, params);
                } else {
                    _params = App.Settings.UI.Initial.Input.Numeric;
                }

                return {
                    init: function() {
                        $(_element).format(_params);
                        return this;
                    }
                }
            },
            Time: function(element, params) {
                var _element = element,
                    _params = App.Settings.UI.Initial.Input.Time;
            
                return {
                    init: function() {
                        $(_element).mask(_params.format, {placeholder: _params.placeholder, completed: function() {
                                var val = $(_element).val().split(':');
                                if ( val[0]*1 > 23) val[0] = '23';
                                if ( val[1]*1 > 59) val[1] = '59';
                                $(_element).val( val.join(':') );
                                $(_element).next(':input').focus();
                            }
                        });
                        return this;
                    }
                }
            },
            Masked: function(element, params) {
            	var _element = element,
                    _params = App.Settings.UI.Initial.Input.Masked;
            
                return {
                    init: function() {
                    	if( $(_element).attr('data-mask') !== undefined ) {
                    		$(_element).mask($(_element).data('mask'), {placeholder: _params.placeholder});
                    	} else {
                    		$(_element).mask(_params.format, {placeholder: _params.placeholder});
                    	}
                        return this;
                    }
                }
            }
        },
        Progressbar: function(element, params){
            var _element = element,
                _params = {};
            
            if(params !== null || params !== undefined || params !== 'undefined') {
                $.extend(true, _params, App.Settings.UI.Initial.Progressbar, params);
            } else {
                _params = App.Settings.UI.Initial.Progressbar;
            }

            return {
                init: function() {
                    $(_element).progressbar(_params);
                    return this;
                },
                setValue: function(val) {
                    $(_element).progressbar("option", "value", val);
                    return this;
                }
            }
        },
        /**
         * This object Handles your form.
         * Instruction is gonna appear latter
         */
        FormHandler: function(element, params) {
            var _form = $(element),
                _customValidation = null,
                _elementsArray = _form.find('input, select, select, textarea');
            /**
             * Init function
             * Binds input fields elements
             * Handles submiting
             */
            return {
                initForm: function() {
                    // Attach submit hander to form only if we don't use it to send files
                    if($(_form).attr('enctype') == undefined && $(_form).attr('enctype')!='multipart/form-data') {
                        _form.submit(function(e){
                            e.preventDefault();
                            if(App.Collection.Forms[_form.attr('id')].validate()) {
                                if(_form.attr('action') == undefined) {
                                    alert('Action is not defined');
                                    return false;
                                }
                                var _actionURL = _form.attr('action');
                                var _data = _form.serialize();
                                var _method = _form.attr('method') != 'undefined' ? _form.attr('method') : 'post';
                                App.Storage.byAjax.Data(_data).Type(_method).Url(_actionURL).Go();
                            }
                        });
                    }

                    // Bind handler on elements to remove Error class 
                    _elementsArray.each(function(i) {
                        _elementsArray.live('focusin', function(){
                            if( $(this).hasClass('error') ) {
                                $(this).removeClass('error');
                            }
                        });
                    });

                    return this;
                },
                /*
                 * Use this function to attach some event handlers to element
                 */
                processElements: function(afterBindElements) {
                    if(afterBindElements != null && (typeof afterBindElements == 'function')) {
                        afterBindElements();
                    }
                },
                /*
                 * Force form submition
                 */
                send: function(success){
                    _form.submit();
                    return this;
                },
                /*
                 * User defined validation function
                 */
                setValidationFunction: function(func) {
                    _customValidation = func;
                },
                /**
                 * Validate form on emptiness and requirement
                 */
                validate: function() {
                    if(_form == null) {
                        alert('Form element is not initialized.');
                        return false;
                    }
                    var error = false;
                    if(_customValidation !== null) {
                        error = _customValidation();
                    }
                    _elementsArray.each(function(i){
                        // if enabled and empty
                        if( $(this).attr('type') != 'hidden' &&
                            $(this).attr('disabled') == undefined &&
                            $(this).attr('required') != undefined &&
                            ($(this).val() == '' || parseFloat($(this).val()) == 0)
                        ){
                            // Then error. No need to validate any more
                            error = true;
                            $(this).addClass('error');
                            return false;
                        } else {
                            // Else OK.
                            error = false;
                            $(this).removeClass('error');
                        }
                    });
                    return !error;
                }
            }
        }
    }
})(jQuery)