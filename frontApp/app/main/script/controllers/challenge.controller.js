"use strict";

angular.module('easyVimWeb')
  .controller('challengeController', function ($scope, userService, mainService, $rootScope, $timeout,
                                               challengeDifficulties, SweetAlert) {

    var $ctrl = this;
    $ctrl.showModal = true;

    $scope.localTheme = $rootScope.user.currentTheme;
    $ctrl.challengeDifficulties = challengeDifficulties;
    $ctrl.user = $rootScope.user;
    $ctrl.friends = [];

    $ctrl.invitations = [];
    $ctrl.keysPressed = '';
    $ctrl.currentQuest = {};
    $ctrl.targetText = '';
    $ctrl.scores = [];
    $ctrl.history = [];

    $ctrl.personalBest = '';

    $ctrl.getInvitations = function () {
      mainService.getInvitations().then(function (res) {
        console.log('invitations', res);
        $ctrl.invitations = res;
      }, function (err) {
        console.log("Error: " + err);
      })
    };

    $ctrl.getInvitations();

    $ctrl.sendInvitation = function (user) {
      var invitation = {
        challenge: {_id: $ctrl.currentQuest._id},
        sender: {_id: $ctrl.user._id},
        receiver: {_id: user._id}
      };
      mainService.addInvitation(invitation)
        .then(function () {
          console.log("Invitation sent");
          $('#myModal').modal('hide');
        });
    };

    $ctrl.getFriends = function () {
      userService.getFriends().then(function (res) {
        $ctrl.friends = res;
        console.log($ctrl.friends[0]);
      }, function (err) {
        console.log("Error: " + err);
      });
    };

    $ctrl.getFriends();

    $ctrl.setCurrentQuest = function (difficulty, quest) {
      quest.difficulty = difficulty;
      $ctrl.currentQuest = quest;
      $ctrl.descriptionLines = quest.description.split('\n');
      $ctrl.targetText = quest.targetText;
      $ctrl.targetTextLines = quest.targetText.split('\n');
      $scope.initialContent = quest.startingText;
      $ctrl.keysPressed = '';

      mainService.getChallengeEntries(quest)
      .then(function (scores) {
        $ctrl.scores = scores;

        var personalBest = _.filter(scores, function (score) {
          return score.user.name === $ctrl.user.name;
        });
        if(personalBest.length > 0){
          $ctrl.personalBest = personalBest[0].keySequence;
        }
        else {
          $ctrl.personalBest = '';
        }
      })


    };
    $ctrl.setCurrentQuest($ctrl.challengeDifficulties[0], $ctrl.challengeDifficulties[0].challenges[0]);

    // hardcode some invitations
    $ctrl.challengeDifficulties[0].challenges[0].invitation = {
      sender: 'Catalin',
      pic: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c19.0.50.50/p50x50/11018346_1025117317538288_8637195073437319525_n.jpg?oh=ae3b8cbb203141ef5c094124133a66b7&oe=57DBE2E6'
    };
    $ctrl.challengeDifficulties[0].challenges[3].invitation = {
      sender: 'Razvan',
      pic: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12717933_1209347179093662_204283182703864292_n.jpg?oh=cdda16be07f4cbde013e15a49badb71c&oe=57D35890'
    };

    $ctrl.addKeyPressed = function (e) {
      $ctrl.keysPressed += String.fromCharCode(e.keyCode);
      addHistory(3, String.fromCharCode(e.keyCode));
    };

    $scope.$watch('initialContent', function (event) {
        if ($scope.initialContent == $ctrl.targetText) {
          mainService.honorInvitation({
              _id: $ctrl.currentQuest._id,
              difficulty: {
                completionExperience: $ctrl.currentQuest.difficulty.completionExperience,
                completionGold: $ctrl.currentQuest.difficulty.completionGold
              }
            })
            .then(function (res) {
              return mainService.sendChallengeEntry({
                challenge: {_id: $ctrl.currentQuest._id},
                keySequence: $ctrl.keysPressed
              })
            })
            .then(function () {
              console.log("finished save challenge");

              if($ctrl.keysPressed.length < $ctrl.personalBest.length || $ctrl.personalBest.length === 0) {
                $ctrl.personalBest = $ctrl.keysPressed;
              }

              SweetAlert.swal({
                title: "Congratulations",
                text: "Challenge completed!",
                type: "success",
                confirmButtonText: "Ok",
                closeOnConfirm: true
              });
            })
            .catch(function (err) {
              console.log('Error at challenge complete', err);
            })

        }
      }
    );

    $ctrl.stopPasteEvent = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    };

    $ctrl.putAchievements = function (achievements) {
      userService.putAchievements(achievements)
        .then(function (res) {
          $ctrl.user.achievementsUnlocked += res;
        })
        .catch(function (err) {
          console.error("error on put achievement", err);
        })
    };

    var addHistory = function (xp, command) {
      $ctrl.history.push({
        xp: xp,
        command: command
      });
      if ($ctrl.history.length == 10) {
        $ctrl.history.shift();
      }
    };

    return $ctrl;

  });
