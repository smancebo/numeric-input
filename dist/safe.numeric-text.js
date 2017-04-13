(function(angular) {

    angular.module('safe.numeric-text', [])
        .directive('numericText', numericText);


    numericText.$inject = ['$filter', '$timeout'];

    function numericText($filter, $timeout) {



        function linkFunc($scope, $element, $attrs, $ngModel) {

            var options = {
                format: $attrs.format || 'int', //format == 'decimal' || 'int' || 'currency' || percentage
                decimalPlaces: $attrs.decimalPlaces || 2,
                step: parseFloat($attrs.step) || 0,
                maxValue: $attrs.maxValue || Number.POSITIVE_INFINITY,
                minValue: $attrs.minValue || Number.NEGATIVE_INFINITY,
                currencySymbol: $attrs.currencySymbol || '$',
                errorClass: $attrs.errorClass || 'has-error RequiredField'
            };

            if (options.format == 'percentage') {
                options.currencySymbol = '%';
            }

            if (options.format !== 'int' && options.format !== 'decimal' && options.format !== 'currency' && options.format !== 'percentage') {
                raiseExeption('Invalid Format',
                'Format "' + options.format + '" is an invalid format for numeric-text, numeric-text only accepts the following formats, \n "int" || "decimal" || "currency" || "percentage"');
            }

            if (options.step < 0) {
                raiseExeption('Step should not be negative', 'The step number should be 0 or a positive number');
            }

            if (typeof(options.step) !== 'number') {
                raiseExeption('Step value is not a number', 'The value "' + options.step + '" in step is not a number, shoud be a number greater than 0');
            }

            if(options.decimalPlaces < 0){
              raiseExeption('DecimalPlaces should not be negative','The value "" in decimal-places is less then 0, should be a positive number');
            }

            var input = $($element);
            //$scope.ngModel = $scope.ngModel || 0;

            function parse(value) {
                value = value || 0;
                var regex = new RegExp("[\\,\\" + options.currencySymbol + "]", 'g');
                return value.toString().replace(regex, '');
            }

            function raiseExeption(error, message) {
                throw {
                    Error: error,
                    Message: message
                };
            }

            function updateModel(value) {
                $timeout(function() {
                    value = value || input.val();
                    $ngModel.$setViewValue(value);
                    $ngModel.$render();
                });
            }

            function setInputValue(value) {
                var format = options.format;
                value = parse(value);
                input.val(formatter(format, value));
                updateModel();
            }

            function formatter(format, value) {
                value = value || 0;
                if (format == 'decimal') {
                    return $filter('number')(value, options.decimalPlaces);
                } else if (format == 'int') {
                    return $filter('number')(value);
                } else if (format == 'currency' || format == 'percentage') {
                    return $filter('currency')(
                        value,
                        options.currencySymbol,
                        options.decimalPlaces);
                }
            }

            function getInputValue() {
                var value = input.val() || 0;

                if (input.val() === '') {
                    if (options.minValue > 0) {
                        value = options.minValue;
                    } else {

                        value = 0;
                    }
                }
                var format = options.format;

                if (format == 'decimal') {
                    return parseFloat(parse(value));
                } else if (format == 'int') {
                    return parseInt(parse(value));
                } else if (format == 'currency' || format == 'percentage') {
                    return parseFloat(parse(value));
                }
            }

            function moveCursorToEnd(el) {
                if (typeof el.selectionStart == "number") {
                    el.selectionStart = el.selectionEnd = el.value.length;
                } else if (typeof el.createTextRange != "undefined") {
                    el.focus();
                    var range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }

            function applyInputValue(value, event) {
                event.preventDefault();
                if (value >= options.minValue && value <= options.maxValue) {
                    setInputValue(value);
                } else {

                    if (value < options.minValue) {
                        value = formatter(options.format, options.minValue == Number.NEGATIVE_INFINITY ? 0 : options.minValue);
                    }

                    if (value > options.maxValue) {
                        value = formatter(options.format, options.maxValue);
                    }
                    setInputValue(value);
                    invalidate();
                }
            }

            function invalidate() {
                input.addClass(options.errorClass);
                input.attr('valida-control', false);
            }

            function validate() {
                input.removeClass(options.errorClass);
                input.attr('valida-control', true);
            }

            var value = 0;
            var numberMatch = /[0-9]/;
            input.unbind('keydown');
            input.on('keydown', function(event) {


                if (options.step !== 0 && typeof(options.step) == 'number') {


                    //Step up
                    if (event.keyCode == 38) {
                        value = getInputValue();
                        value += options.step;
                        applyInputValue(value, event);


                    } else if (event.keyCode == 40) { //Step down
                        value = getInputValue();
                        value -= options.step;
                        applyInputValue(value, event);
                    }
                }


                //Minus
                if (event.keyCode == 189) {
                    applyInputValue(getInputValue() * -1, event);
                    return;
                }
                if (event.keyCode == 190 && options.format != 'int') {
                    if (input.val().indexOf('.') !== -1) {
                        event.preventDefault();
                    }
                    return;
                }
                if (event.shiftKey === false) {
                    var isFromNumpad = false;
                    
                    if(event.keyCode >= 96 && event.keyCode <= 105){
                        isFromNumpad = true;
                    }
                    if(!isFromNumpad){
                    
                        if (!numberMatch.test(String.fromCharCode(event.keyCode))) {
                            if (event.keyCode != 8 &&
                                event.keyCode != 37 &&
                                event.keyCode != 39) {

                                event.preventDefault();
                            }
                        }
                    }
                } else {
                    event.preventDefault();
                }
            });

            input.unbind('keyup');
            input.unbind('change');
            input.on('change', function(event) {
                applyInputValue(getInputValue(), event);
                validate();
            });
            input.unbind('click');
            input.on('click', function(event) {
                var _this = $(this)[0];
                _this.setSelectionRange(0, _this.value.length);

            });
            input.on('keyup', function(event) {
                validate();
            });

            input.css('text-align', 'right');

            $ngModel.$parsers.push(function(value) {
                return parse(value);
            });
            $ngModel.$formatters.push(function(value) {
                if (value >= options.minValue && value <= options.maxValue) {
                    updateModel(formatter(options.format, value));
                    return formatter(options.format, value);
                } else {

                    if (value < options.minValue) {
                        value = formatter(options.format, options.minValue == Number.NEGATIVE_INFINITY ? 0 : options.minValue);
                    }

                    if (value > options.maxValue) {
                        value = formatter(options.format, options.maxValue);
                    }

                    updateModel(value);
                    return formatter(options.format, value);
                }
            });
        }

        return {
            restrict: 'A',
            link: linkFunc,
            require: 'ngModel'
        };
    }

})(window.angular);
