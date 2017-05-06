myApp.controller('editUserController', ['$scope', '$http', '$rootScope', '$stateParams', '$state', function($scope, $http, $rootScope, $stateParams, $state) {
	$scope.user = {};
	$scope.user.name = '';
	$scope.user.email = '';
	$scope.user.password = '';
	$scope.user._id = $stateParams._id;

	$scope.getUserDetailById = function() {
		$http({
				method: 'POST',
				url: $rootScope.url + 'api/user/getUserById',
				data: $scope.user
			})
			.then(function(success) {
				$scope.user = success.data;
			}, function(error) {});
	};

	$scope.getUserDetailById();

	$scope.updateUser = function() {
		console.log($scope.user);
		$http({
				method: 'PUT',
				url: $rootScope.url + 'api/user/modifyUserById',
				data: $scope.user
			})
			.then(function(success) {
				toastr.success('User Detail Modified');
				$state.go('userList');
			}, function(error) {
				toastr.error('User Detail Not Modified');
			});
	};

	$scope.cancel = function() {
		$state.go('userList');
	}
}]);
