angular.module("LoginModule", [])
  .controller("loginCtrl", loginCtrl);

function loginCtrl($state, $cordovaSQLite, utilsFactory, $cordovaDevice, DeviceCapture) {
  var loginObj = this;
  loginObj.authenticateGoogleClient = authenticateGoogleClient;
  loginObj.authenticateFbClient = authenticateFbClient;
  loginObj.listAccounts = [];
  loginObj.captureImage = captureImage;


  // navigator.Backbutton.goBack(function() {
  //   console.info('success');
  // }, function() {
  //   console.info('fail');
  // });

  function captureImage() {

    DeviceCapture.captureImage();

  }

  function authenticateGoogleClient() {
    $state.go("tabs.expenses");
  }

  function authenticateFbClient() {
    $state.go("tabs.expenses");
  }

  function getAccounts() {
    document.addEventListener("deviceready", function() {

      var device = $cordovaDevice.getDevice();

      var cordova = $cordovaDevice.getCordova();

      var model = $cordovaDevice.getModel();

      var platform = $cordovaDevice.getPlatform();

      var uuid = $cordovaDevice.getUUID();

      var version = $cordovaDevice.getVersion();

      console.log("device::" + device + "\n version:: " + version + "\n uuid:: " + uuid)

    }, false);
  }
  getAccounts();

}
