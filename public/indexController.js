myApp.controller('indexController', ['$scope', '$http', '$rootScope', '$state', '$window', 'amplifyStorage', function($scope, $http, $rootScope, $state, $window, amplifyStorage) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    $scope.loginOut = function() {
        amplifyStorage.clearAllStore();
        $rootScope.isLogin = false;
        $state.go('login');
    };
}]);
