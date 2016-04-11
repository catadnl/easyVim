'use strict';
angular.module("easyVim.login")
  .controller('loginController', function ($scope, authService, $state) {

    $scope.busy = true;
    $scope.error = false;

var verifyAuthentication = function () {
      $scope.error = false;

      if ($state.params.retryLogin) {

        if (authService.isLoggedIn()) {
          successLogin();
        }
        else {
          authService.getAuthenticatedUser()
            .then(successLogin)
            .catch(function (err) {
            })
            .finally(finallyHandler)
        }
      }
      else {
        $scope.busy = false;
      }
    };

    verifyAuthentication();

    function successLogin() {
      var customRedirectState = 'cheatSheet'; //learn when implemented

      $state.go($state.params.to || customRedirectState, $state.params.toParams,
                {location: 'replace'});
    }

    function finallyHandler() {
      $scope.busy = false;
    }

    $scope.login = function () {
      $scope.busy = true;
      $scope.error = false;

      authService.login()
        .then(function (loggedIn) {
          if (!loggedIn) {
            $scope.error = 'Not logged in, try again';
          }
          else {
            successLogin();
          }
        })
        .catch(function (err) {
          $scope.error = "Please try again";
        })
        .finally(finallyHandler);
    };

    return this;
  });
