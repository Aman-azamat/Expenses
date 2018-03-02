angular.module("utilsModule", [])
  .factory("utilsFactory", utilsFactory);

function utilsFactory($q, $cordovaDevice) {
  var utils = {};
  utils.getDeviceAccounts = getDeviceAccounts;
  utils.getCordovaDeviceDetails = getCordovaDeviceDetails;
  utils.getDateString = getDateString;
  utils.stringToDate = stringToDate;


  function stringToDate(dateString) {
    var dateObj = new Date(dateString);
    var month = (dateObj.getMonth() + 1);
    // if (month.length == 1) {
    //   month = "0" + "" + month;
    // }
    dateString =  dateObj.getDate()+"-"+month + "-"+ dateObj.getFullYear()  ;
    return dateString;
  }

  function getDateString(dateObj) {
    var month = (dateObj.getMonth() + 1);
    if (month.length == 1) {
      month = "0" + "" + month;
    }
    var dateString = dateObj.getFullYear() + "-" + month + "-" + dateObj.getDate();

    return dateObj.getTime();
  }


  function getCordovaDeviceDetails() {
    var deviceString = "";
    try {
      deviceString = 'Device Model: ' + $cordovaDevice.getModel() + '<br />' +
        'Cordova Version: ' + $cordovaDevice.getCordova() + '<br />' +
        'Device Platform: ' + $cordovaDevice.getPlatform() + '<br />' +
        'Device UUID: ' + $cordovaDevice.getUUID() + '<br />' +
        'OS Version: ' + $cordovaDevice.getVersion() + '<br />';
    } catch (e) {
      console.log("" + e.message);
    }

    return deviceString;

  }


  function getDeviceAccounts() {
    var deferred = $q.defer();
    var response = {}
    try {
      window.plugins.DeviceAccounts.get(function(accounts) {
        console.log('account registered on this device:', JSON.stringify(accounts));
        response.status = "success";
        response.result = accounts;
        deferred.resolve(response);
      }, function(error) {
        response.status = "failure";
        response.result = [];
        deferred.reject(response);
        console.log('Fail to retrieve accounts, details on exception:', error);
      })
    } catch (e) {
      console.log("e.message::" + e.message);
      response.status = "failure";
      response.result = [];
      deferred.reject(response);
    }
    return deferred.promise;
  }

  return utils;
}
