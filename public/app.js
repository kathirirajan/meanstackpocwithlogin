'use strict';
var myApp = angular.module('userDetailsApp', ['ui.router', 'angular-loading-bar', ]);

myApp.run(function($rootScope, $location, $state, $window, amplifyStorage) {
  $rootScope.url = $location.protocol() + "://" + $location.host() + "/";
  $rootScope.isLogin = false;
  $rootScope.$on('$stateChangeStart',
    function(event, toState) {
      var Authorization = amplifyStorage.retrieve('Authorization');
      if (toState.authenticate === true && Authorization === undefined) {
        $rootScope.isLogin = false;
        $state.go("login");
        event.preventDefault();
      }
      else if (toState.name === 'login') {
        if (toState.name === 'login' && Authorization !== undefined) {
          event.preventDefault();
        }
        else {
          $rootScope.isLogin = false;
        }

      }
      else {
        $rootScope.isLogin = true;
      }
    });
});

myApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = true;
  cfpLoadingBarProvider.includeBar = true;
  cfpLoadingBarProvider.spinnerTemplate = '<div class="loading">Loading&#8230;</div>';
}]);


myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
  $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';
  $httpProvider.defaults.headers.common['Expires'] = '0';
  $httpProvider.interceptors.push('myInterceptor');

  var login = {
    name: 'login',
    url: '/',
    controller: 'loginController',
    templateUrl: 'pages/login/login.html',
    authenticate: false
  };

  var userList = {
    name: 'userList',
    url: '/userList',
    controller: 'listUserController',
    templateUrl: 'pages/user/listUser.html',
    authenticate: true
  };

  var userAdd = {
    name: 'addUser',
    url: '/addUser',
    controller: 'addUserController',
    templateUrl: 'pages/user/addUser.html',
    authenticate: true
  };

  var editUser = {
    name: 'editUser',
    url: '/editUser/:_id',
    controller: 'editUserController',
    templateUrl: 'pages/user/editUser.html',
    authenticate: true,
    params: {
      _id: null
    },
  };

  $stateProvider.state(login);
  $stateProvider.state(userList);
  $stateProvider.state(userAdd);
  $stateProvider.state(editUser);
  $urlRouterProvider.otherwise('/');
});
