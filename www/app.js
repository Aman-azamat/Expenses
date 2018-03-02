// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


alert = function() {};
// alert=console.log();
angular.module('starter', ['ionic',  'ngCordova',
    'LoginModule',
    'dashModule',
    'expensesModule',
    'dbModule',
    'popupModule','utilsModule','ionic-datepicker'
  ])

  .run(function($state, $ionicPlatform, dbFactory, $ionicLoading, popupService, $cordovaStatusbar) {
    $ionicPlatform.ready(function() {
      //$cordovaStatusbar.hide();
      $ionicLoading.show();
      try {

        // if (window.StatusBar) {
        //   StatusBar.overlaysWebView(false);
        //   StatusBar.backgroundColorByHexString('#387ef5');
        // }
        dbFactory.intialiseDb().then(function(res) {
          if (res == "success") {
            dbFactory.createDB().then(function(res) {
              console.log("res::" + res);
            });
          }

        });
      } catch (e) {} finally {
        $ionicLoading.hide();
      }

      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl as ctrlObj',
        cache: false
      })



      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "views/tabs.html"
      })

      .state('tabs.dash', {
        url: "/dashboard",
        views: {
          'tab-dash': {
            templateUrl: "views/tabs-dashboard.html",
            controller: 'dashTabCtrl as dash'
          }
        }
      })

      .state('tabs.expenses', {
        url: "/expenses",
        cache: false,
        views: {
          'tab-addexpense': {
            templateUrl: 'views/tabs-addExpense.html',
            controller: 'addExpense as expenseObj'
          }
        }
      })

      .state('tabs.editexpense', {
        url: "/editexpense/:editobj",
        cache: false,
        views: {
          'tab-addexpense': {
            templateUrl: 'views/tabs-addExpense.html',
            controller: 'addExpense as expenseObj'
          }
        }
      })


      .state('tabs.view', {
        url: "/viewexpenses",
        cache: true,
        views: {
          'tab-viewexpense': {
            templateUrl: 'views/tabs-viewExpenses.html',
            controller: 'viewExpenses as viewexpenseObj'
          }
        }
      })

    ;


    $urlRouterProvider.otherwise('/login');

  });
