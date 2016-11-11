# Numeric-Input


## Installation

#### via Bower

```
bower install --save angular-safe.numeric-input
```

## Description

Numeric-Input is an [AngularJS](https://https://github.com/angular/angular.js) directive for applying numeric format to your inputs, you just need put the numeric-text attribute in your input and ready to go
its support __`int`__, __`decimal`__,  __`currency`__ or __`percentage`__ formats


## Usage

> Full working example inside the _"demo"_ folder in this repo

app.js

```javascript
(function(angular){

  angular.module('numerictest',['safe.numeric-text'])
  .controller('numeric', numeric);

  numeric.$inject = ['$scope'];
  function numeric($scope){
    $scope.txtNumeric = 48.0;
    $scope.txtNumeric4Digits = -100.55;

  }


})(window.angular);

```

index.html

```html

<!DOCTYPE html>
<html ng-app="numerictest">

<head>
    <meta charset="utf-8">
    <title>Numeric-Text</title>
</head>

<body ng-controller="numeric">
      <div class="container">
        <p>
            <label>Basic Configuration</label>
        </p>
        <p>
            <input text="text" numeric-text ng-model="txtBasicNumeric" /> {{txtBasicNumeric}}
        </p>
        <p>
            <label>Using Minimum & Maximum Values (min: 45.50; max: 45.60)</label>
        </p>
        <p>
            <input text="text" numeric-text ng-model="txtNumericMinMax" min-value="45.50" max-value="45.60" step="0.01" format="decimal" /> {{txtNumericMinMax}}
        </p>

        <p>
            <label>Currency Format</label>
        </p>
        <p>
            <input text="text" numeric-text ng-model="txtNumericCurrency" step="0.01" format="currency" /> {{txtNumericCurrency}}
        </p>

        <p>
            <label>Percentage Format</label>
        </p>
        <p>
            <input text="text"  numeric-text ng-model="txtNumericPercentage" min-value="-100" max-value="100" decimal-places='0' step="0.01" format="percentage" /> {{txtNumericPercentage}}
        </p>
        <p>
            <label>4 decimal digits/label>
        </p>
        <p>
            <input text="text" numeric-text ng-model="txtNumeric4Digits" step="0.0001" format="decimal" decimal-places="4" /> {{txtNumeric4Digits}}
        </p>
    </div>


    <script src="bower_components/jquery/dist/jquery.min.js" charset="utf-8"></script>
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/safe-numeric-text/safe.numeric-text.min.js" charset="utf-8"></script>
    <script src="app/app.js" charset="utf-8"></script>
</body>

</html>

```

## Numeric-Input configuration

Numeric-Input accepts attributes for configure the behavior of the input controller

* `format` - _String_ : This is used for specify the format of the numeric input, valid formats __int__ (Default), __decimal__, __currency__, __percentage__
* `decimal-places` - _Numeric_ : Used for specify the decimal places of numbers (this only works using __decimal__ || __currency__ || __percentage__ formats)
* `step` - _Numeric_ : Used for specify the steps in numeric input, it will add or substract the value of this property when hit the `UP` (add) key or `Down` (substract) Key
* `max-value` - _Numeric_ : Specify the max value of the input
* `min-value` - _Numeric_ : Specify the min value of the input
* `currency-symbol` - _String_ : Override the default symbol when using __currency__ format
* `error-class` - _String_ : Specify the class used when input is invalid (default value is __'has_error'__)
