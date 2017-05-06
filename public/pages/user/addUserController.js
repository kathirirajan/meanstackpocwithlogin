myApp.controller('addUserController', ['$scope', '$http', '$rootScope', '$state', function($scope, $http, $rootScope, $state) {
	$scope.user = {
		'name': '',
		'email': '',
		'password': '',
		'confPassword': '',
	};

	$scope.creatUser = function() {
		console.log($scope.user);
		$http({
				method: 'POST',
				url: $rootScope.url + 'api/auth/register',
				data: $scope.user
			})
			.then(function(success) {
				if (success.status === 200 || success.status === 201) {
					toastr.success('User Detail Created');
					$state.go('userList');
				}
				else {
					toastr.error('User Detail Not Created');
					toastr.error(success.data.error);
				}
			}, function(error) {
				toastr.error('User Detail Not Created');
				error.data.forEach(function(item) {
					toastr.error(item.msg);
				})
			});
	};

	$scope.cancel = function() {
		$state.go('userList');
	};
}]);
