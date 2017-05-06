myApp.controller('loginController', ['$scope', '$http', '$rootScope', '$state', '$window', 'amplifyStorage', function($scope, $http, $rootScope, $state, $window, amplifyStorage) {
	$scope.user = {
		login: {
			email: ''
		},
		register: {
			email: '',
			name: '',
			password: '',
			confPassword: ''
		}
	};

	$scope.login = function() {
		$http({
				method: 'POST',
				url: $rootScope.url + 'api/auth/login',
				data: $scope.user.login
			})
			.then(function(success) {
				if (success.status !== 500) {
					if (success.status !== 401) {
						if (success.data.success === true) {
							$window.sessionStorage.setItem('Authorization', success.data.token);
							$window.sessionStorage.setItem('userDetails', JSON.stringify(success.data.userDetails));
							amplifyStorage.save('Authorization', success.data.token);
							amplifyStorage.save('userDetails', success.data.userDetails);
							$rootScope.isLogin = true;
							toastr.success('Logged in successfully');
							$state.go('userList');
						}
						else {
							toastr.error("Invalid User Details");
							$scope.user.login.password = '';
						}
					}
					else if (success.status === 401) {
						toastr.error("Invalid User Details");
						$scope.user.login.password = '';
					}
				}
				else {
					toastr.error("Invalid User Details");
				}
			}, function(error) {
				console.error("error in posting");
			});
	};

	$scope.register = function() {
		$http({
				method: 'POST',
				url: $rootScope.url + 'api/auth/register',
				data: $scope.user.register
			})
			.then(function(success) {
				if (success.status !== 500) {
					if (success.status !== 401) {
						$window.sessionStorage.setItem('Authorization', success.data.token);
						$window.sessionStorage.setItem('userDetails', JSON.stringify(success.data.userDetails));
						amplifyStorage.save('Authorization', success.data.token);
						amplifyStorage.save('userDetails', success.data.userDetails);
						toastr.success('User Detail Created');
						$state.go('userList');
					}
					else {
						toastr.error("Invalid User Details");
						// $scope.user.register.password = '';
						// $scope.user.register.confPassword = '';
					}
				}
				else {
					toastr.error("Invalid User Details")
				}
			}, function(error) {
				toastr.error('User Detail Not Created');
				error.data.forEach(function(item) {
					toastr.error(item.msg);
				})
			});
	}

}]);
