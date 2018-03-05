angular.module("expensesModule")
  .controller("viewExpenses", viewExpenses)


function viewExpenses($scope, $rootScope, $state, popupService,
  $ionicLoading, $ionicModal, expenseService, $cordovaStatusbar) {
  var expenseObj = this;
  expenseObj.query = "";
  expenseObj.showdelete = false;
  expenseObj.allowswipe = true;
  expenseObj.showreorder = false;
  expenseObj.listExpenses = [];
  expenseObj.deleteExpense = deleteExpense;
  expenseObj.currency = "&#8377;";
  expenseObj.total = 0;
  expenseObj.getExpenseData = getExpenseData;
  expenseObj.toggleDelete = toggleDelete;
  expenseObj.toggleDetailView = toggleDetailView;
  expenseObj.modal = "";
  expenseObj.filteredList = [];

  var cleanUpFunc = $rootScope.$on("refreshList", function() {
    console.log("refreshing list......");
    getExpenses();

  });

  $scope.$on('$destroy', function() {
    console.log("destroying refresh event on list list......");
    cleanUpFunc();
  });

  function toggleDetailView() {}

  function toggleDelete() {
    expenseObj.showdelete = !expenseObj.showdelete;
  }

  function deleteExpense(expenseItem) {
    try {
      $ionicLoading.show();
      alert("delete:::" + JSON.stringify(expenseItem));
      expenseService.deleteExpense(expenseItem.id)
        .then(function(result) {
          if (result.status) {
            getExpenses();
          }
          popupService.showAlert(result.title, result.text);

        });
    } catch (e) {
      popupService.showAlert("Warning", "Catch in getExpenses");
    } finally {
      $ionicLoading.hide();
    }
  }

  function getExpenseData(expenseObject) {
    
    $state.go("tabs.editexpense", { "editobj": JSON.stringify(expenseObject) });
  }

  function getExpenses() {
    $ionicLoading.show();
    var query = "SELECT SUM(amount) as total FROM expenses ";
    var params = [];
    try {
      $ionicLoading.show();
      expenseService.getAllExpenses().then(function(responseObj) {
        expenseObj.listExpenses = responseObj.result;
        expenseService.getExpenseTotal().then(function(totalAmount) {
          expenseObj.total = totalAmount;
          $ionicLoading.hide();
        });
      });
    } catch (e) {
      $ionicLoading.hide();
      console.log("Warning::" + "Catch in getExpenses");

    } finally {
      $ionicLoading.hide();
    }

  }
  getExpenses();
}
