(function(angular){

  angular.module('masktest',['safe.numeric-text'])
  .controller('mask', mask);

  mask.$inject = ['$scope'];
  function mask($scope){
  
    $scope.txtNumerico = 48.0;

    $scope.txtNumerico4Digitos = -100.55;

  }


})(window.angular);
