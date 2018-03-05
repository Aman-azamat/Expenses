angular.module("dashModule", [])
  .controller("dashTabCtrl", getDashboard);

function getDashboard(ionicDatePicker, utilsFactory, expenseService) {
  var dashboardObj = this;
  dashboardObj.fromDatePicker = fromDatePicker;
  dashboardObj.toDatePicker = toDatePicker;
  dashboardObj.toDate;
  dashboardObj.fromDate;
  dashboardObj.searchonRange = searchonRange;
  dashboardObj.clearData = clearData;
  dashboardObj.listSearchData = [];
  dashboardObj.expenseTotal = 0;


  function clearData() {
    dashboardObj.toDate = new Date();
    dashboardObj.fromDate = new Date();
    dashboardObj.listSearchData = [];
    dashboardObj.expenseTotal = 0;

  }

  function fromDatePicker() {
    try {
      ionicDatePicker.openDatePicker({
        callback: function(val) { //Mandatory 
          console.log('fromdate : ' + val, new Date(val));
          dashboardObj.fromDate = new Date(val);
        },
        inputDate: new Date(), //Optional 
        mondayFirst: true, //Optional 
        disableWeekdays: [0], //Optional 
        closeOnSelect: false, //Optional 
        templateType: 'popup' //Optional 
      });
    } catch (e) {
      console.log("e.message" + e.message);
    }

  }

  function toDatePicker() {
    ionicDatePicker.openDatePicker({
      callback: function(val) { //Mandatory 
        console.log('toDate : ' + val, new Date(val));
        dashboardObj.toDate = new Date(val);
      },
      inputDate: new Date(), //Optional 
      mondayFirst: true, //Optional 
      disableWeekdays: [0], //Optional 
      closeOnSelect: false, //Optional 
      templateType: 'popup' //Optional 
    });
  }


  function searchonRange() {
    console.log('search between""' + new Date(dashboardObj.fromDate) + "--" + new Date(dashboardObj.toDate));
    console.log("====================================");


    var fDate = new Date(dashboardObj.fromDate);
    fDate.setHours(0, 0, 0, 0);
    fDate = fDate.getTime();

    var tDate = new Date(dashboardObj.toDate);
    tDate.setHours(23, 59, 59, 999);
    tDate = tDate.getTime();

    expenseService.expensesInRange(fDate, tDate)
      .then(function(response) {
        // console.log("result::" + JSON.stringify(result));
        dashboardObj.listSearchData = response.result;
        expenseService.expenseTotalInRange(fDate, tDate).then(function(totalAmount) {
          dashboardObj.expenseTotal = totalAmount;
        });

      });

  }

  clearData();

}
