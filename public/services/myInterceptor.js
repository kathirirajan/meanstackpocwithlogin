myApp.service('myInterceptor', function($rootScope, $window, amplifyStorage) {
    var service = this;
    service.request = function(config) {
        var Authorization = amplifyStorage.retrieve('Authorization');
        var userDetails = amplifyStorage.retrieve('userDetails');
        if (Authorization !== undefined && userDetails !== undefined) {

            config.headers['Authorization'] = Authorization;
            config.headers['name'] = userDetails.name;
            config.headers['email'] = userDetails.email;
        }
        else {
            config.headers = config.headers || {};
        }
        return config;
    };
    service.responseError = function(response) {
        // if (response.status === 401) {
        //     $rootScope.$broadcast('unauthorized');
        // }
        return response;
    };
});
