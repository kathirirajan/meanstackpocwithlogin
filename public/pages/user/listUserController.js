myApp.controller('listUserController', ['$scope', '$http', '$rootScope', '$state', 'amplifyStorage', function($scope, $http, $rootScope, $state, amplifyStorage) {
	$scope.userList = [];

	$scope.addUser = function() {
		$state.go('addUser');
	};

	$scope.listUser = function() {
		$http({
				method: 'GET',
				url: $rootScope.url + 'api/user/getAllUsers'
			})
			.then(function(success) {

				if (success.status === 401) {
					amplifyStorage.clearAllStore();
					$rootScope.isLogin = false;
					$state.go('login');
					toastr.success('Unauthorized to access');
				}
				else if (success.status === 200) {
					$scope.userLists = success.data;
					toastr.success('Listed all user Details');
				}


			}, function(error) {});
	};

	$scope.listUser();

	$scope.editUser = function(_id) {
		$state.go('editUser', {
			_id: _id
		})
	};

	$scope.deleteUser = function(_id) {
		$http({
				method: 'DELETE',
				url: $rootScope.url + 'api/user/deleteUserById',
				data: {
					'_id': _id
				}
			})
			.then(function(success) {
				if (success.status === 401) {
					amplifyStorage.clearAllStore();
					$rootScope.isLogin = false;
					$state.go('login');
					toastr.success('Unauthorized to access');
				}
				else if (success.status === 200) {
					toastr.success('User Detail Deleted');
					$scope.listUser();
				}
			}, function(error) {
				toastr.error('User Detail Not Deleted');
			});
	};

}]);
