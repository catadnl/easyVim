'use strict';
angular.module("easyVim.login",['ui.router'])
  .config(function($stateProvider){

    $stateProvider.state('login', {
      url: "/",
      params: {
        to:false,
        toParams:false,
        retryLogin: true
      },
      templateUrl: "views/landing.html",
      controller: 'landingController',
      controllerAs: 'loginCtrl',
      hideNavbar: true
    });


    $stateProvider.state('profile', {
      url: "/profile",
      templateUrl: "views/profile.html",
      controller: 'profileController',
      controllerAs: '$ctrl',
      hideNavbar: false
    });
  });
