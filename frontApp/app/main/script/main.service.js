'use strict';
angular.module("easyVimWeb")
  .service('mainService', function ($http) {
    var service = {};

    var makeCall = function (verb, url, data, params, headers) {
      var base = "/api";
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

    service.getBadges = function () {
      return makeCall('GET', '/badges');
    };

    service.addBadge = function () {
      return makeCall('POST', '/badges', {experience: 5});
    };

    service.getCheatSheet = function () {
      return makeCall('GET', '/cheat-sheet');
    };

    return service;
  });
