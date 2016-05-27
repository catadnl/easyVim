'use strict';
angular.module("easyVim.login")
  .service('authService', function ($http) {
    var service = {};
    var currentUser = null;

    var makeCall = function (verb, url, data, params, headers) {
      var base = "";
      return $http({
                     method: verb,
                     data: data,
                     url: base + url,
                     params: params,
                     headers: headers
                   })
        .then(function (reply) {
          return reply.data
        })
    };

    service.getUser = function () {
      return currentUser;
    };

    service.isLoggedIn = function () {
      return !!currentUser;
    };

    service.getAuthenticatedUser = function () {
      return makeCall("GET", "/auth/profile")
        .then(function (user) {
          currentUser = user;
          currentUser.displayName = currentUser.name.split(" ")[0];
          return service.isLoggedIn();
        })
    };
    
    service.logout = function () {
      currentUser = null;
      return makeCall("GET", '/auth/logout')
    };
    
    service.getFriends = function () {
      return makeCall('GET', 'auth/profile/friends')
    };

    return service;
  });
