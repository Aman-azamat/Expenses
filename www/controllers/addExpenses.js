angular.module("expensesModule")

  .controller("addExpense", addExpense)
  .controller("tabsController", tabsController);

function tabsController($scope, $state) {
  $scope.navigateToAdd = navigateToAdd;

  function navigateToAdd() {
    $state.go("tabs.expenses");
  }
}


function addExpense(expenseService, $rootScope, popupService, $stateParams, $state, ionicDatePicker, utilsFactory) {
  try {
    var expenseObj = this;
    expenseObj.id = "";
    expenseObj.expensename = "";
    expenseObj.category = "";
    expenseObj.amount;
    expenseObj.comments = "";
    expenseObj.clear = clearData;
    expenseObj.addExpense = addExpense;
    expenseObj.init = init;
    expenseObj.defaultcategory = {};
    //created_date text ,  lastEdited_by text , lasteEdited_date
    expenseObj.created_date = new Date();

    expenseObj.datepickerObj = {
      callback: function(val) { //Mandatory 
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        expenseObj.created_date = new Date(val);
      },
      //   disabledDates: [            //Optional 
      //   new Date(2016, 2, 16),
      //   new Date(2015, 3, 16),
      //   new Date(2015, 4, 16),
      //   new Date(2015, 5, 16),
      //   new Date('Wednesday, August 12, 2015'),
      //   new Date("08-16-2016"),
      //   new Date(1439676000000)
      // ],
      //from: new Date(2012, 1, 1), //Optional 
      //to: new Date(2016, 10, 30), //Optional 
      inputDate: new Date(), //Optional 
      mondayFirst: true, //Optional 
      disableWeekdays: [0], //Optional 
      closeOnSelect: false, //Optional 
      templateType: 'popup' //Optional 
    };

    expenseObj.openDatePicker = openDatePicker;

    function openDatePicker() {
      ionicDatePicker.openDatePicker(expenseObj.datepickerObj);
    }

    function clearData() {
      try {
        expenseObj.expensename = "";
        expenseObj.category = "";
        expenseObj.amount = "";
        expenseObj.comments = "";
        expenseObj.id = "";
      } catch (e) {
        popupService.showAlert("Warning", "Unable to clear data");
      }

    }

    function addExpense() {
      try {
        if (expenseObj.id == "") {
          expenseService.addExpense(expenseObj)
            .then(function(responseObj) {
              popupService.showAlert(responseObj.title, responseObj.message);
              if (responseObj.refresh) {
                $rootScope.$broadcast("refreshList");
              }
            });
        } else {
          expenseService.updateExpense(expenseObj)
            .then(function(responseObj) {
              popupService.showAlert(responseObj.title, responseObj.message);
              if (responseObj.refresh) {
                $rootScope.$broadcast("refreshList");
              }
            });
        }

      } catch (e) {
        //popupService.showAlert("Warning", "Unable to Add Expense" + "\n" + e.message);
      } finally {
        clearData();
      }
    }

    function init() {
      expenseService.getCategories().then(function(responseObj) {
        console.log("listCategories::" + JSON.stringify(responseObj));
        expenseObj.listCategories = responseObj.result;
        console.log("$state.current.name::" + $state.current.name);
        if ($stateParams.editobj != null) {
          var editObject = JSON.parse($stateParams.editobj);
          console.log("editObject:::" + JSON.stringify(editObject));
          if (editObject.lasteEdited_date == "") {
            expenseObj.created_date = new Date();
          } else {
            expenseObj.created_date = new Date(parseInt(editObject.lasteEdited_date));
          }
          expenseObj.expensename = editObject.expensename;
          expenseObj.category = editObject.category;
          expenseObj.defaultcategory = { "name": editObject.category };
          expenseObj.amount = editObject.amount;
          expenseObj.comments = editObject.comments;
          expenseObj.id = editObject.id;

        } else {
          clearData();

        }

      })

    }
    init();
  } catch (e) {
    popupService.showAlert("Warning", "Unable to  get Categories,::" + e.message);
  }

}
