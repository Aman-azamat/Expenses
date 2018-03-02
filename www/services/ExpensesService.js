angular.module("expensesModule", [])
  .factory("expenseService", expenseService);

function expenseService(dbFactory, $q,utilsFactory) {
  var expenseObj = {};
  expenseObj.getExpenseInfo = getExpenseInfo;
  expenseObj.getAllExpenses = getAllExpenses;
  expenseObj.addExpense = addExpense;
  expenseObj.deleteExpense = deleteExpense;
  expenseObj.getCategories = getCategories;
  expenseObj.updateExpense = updateExpense;
  expenseObj.getExpenseTotal = getExpenseTotal;

  expenseObj.monthExpense = monthExpense;
  expenseObj.monthwiseCategoryMAX = monthwiseCategoryMAX;
  expenseObj.monthwiseMAX = monthwiseMAX;

  //expenseObj.getAccountDetails = getAccountDetails;
  function monthExpense() {
    var query = "select sum(amount) as total from expenses group by category where  strftime('%m',editdate)=? && strftime('%Y',editdate)=?";
    var params = [(new Date().getMonth() + 1), (new Date().getFullYear())];
    var deffered = $q.defer();
    var response = {};
    var currentmonth
    try {
      dbFactory.executesqlSelect(query, params)
        .then(function(responseObj) {

          deffered.resolve(responseObj.result[0].total);
        });
    } catch (e) {
      deffered.reject("");
    }
    return deffered.promise;

  }


  function monthwiseMAX() {
    var query = "select max(amount) as total from expenses  where  strftime('%m',editdate)=? && strftime('%Y',editdate";
    var params = [(new Date().getMonth() + 1), (new Date().getFullYear())];
    var deffered = $q.defer();
    var response = {};
    var currentmonth
    try {
      dbFactory.executesqlSelect(query, params)
        .then(function(responseObj) {

          deffered.resolve(responseObj.result[0].total);
        });
    } catch (e) {
      deffered.reject("");
    }
    return deffered.promise;

  }

  function monthwiseCategoryMAX() {
    var query = "select max(total) as max_total from(select sum(amount) as total from expenses group by category where  strftime('%m',editdate)=? && strftime('%Y',editdate)=?";
    var params = [(new Date().getMonth() + 1), (new Date().getFullYear())];
    var deffered = $q.defer();
    var response = {};
    var currentmonth
    try {
      dbFactory.executesqlSelect(query, params)
        .then(function(responseObj) {

          deffered.resolve(responseObj.result[0].max_total);
        });
    } catch (e) {
      deffered.reject("");
    }
    return deffered.promise;

  }


  function getExpenseTotal() {
    var query = "select sum(amount) as total from expenses ";
    var params = [];
    var deffered = $q.defer();
    var response = {};
    try {
      dbFactory.executesqlSelect(query, params)
        .then(function(responseObj) {

          deffered.resolve(responseObj.result[0].total);
        });
    } catch (e) {
      deffered.reject("");
    }
    return deffered.promise;

  }



  function getExpenseInfo(expenseId) {
    var query = "select * from expenses where id=?";
    var params = [expenseId];
    var deffered = $q.defer();
    var response = {};
    try {
      dbFactory.executesqlSelect(query, params)
        .then(function(result) {

          deffered.resolve(result);
        });
    } catch (e) {
      deffered.reject(e);
    }
    return deffered.promise;
  }


  function getAllExpenses() {
    var query = "select id , category, expensename,amount,comments,create_by,created_date,strftime('%m',created_date) as month_createdate,lastEdited_by,lasteEdited_date from expenses";
    var params = [];
    var deffered = $q.defer();
    try {
      dbFactory.executesqlSelect(query, params)
        .then(function(result) {
          deffered.resolve(result);
        });
    } catch (e) {
      deffered.reject(e);
    }
    return deffered.promise;
  }


  function getCategories() {
    var query = "select name from expenseCategory";
    var params = [];
    var deffered = $q.defer();
    try {
      dbFactory.executesqlSelect(query, params)
        .then(function(result) {
          deffered.resolve(result);
        });
    } catch (e) {
      deffered.reject(e);
    }
    return deffered.promise;
  }


  function addExpense(expenseObj) {
    var query = "INSERT INTO expenses(  category , expensename, amount, comments, create_by ,created_date,lastEdited_by,lasteEdited_date) values(?,?,?,?,?,?,?,?)";
    var params = [expenseObj.category, expenseObj.expensename, expenseObj.amount, expenseObj.comments, "test",
     expenseObj.created_date, "test", expenseObj.created_date];


    //lastEdited_by text , lasteEdited_date

    //date('now')
    var deffered = $q.defer();
    var result = {};
    try {
      dbFactory.executesqlDML(query, params)
        .then(function(responseObj) {
          if (responseObj.rowsAffected > 0 && responseObj.status == "success") {
            result.message = "Added Item Successfully";
            result.title = "Message";
            result.refresh = true;
          } else {
            result.message = "Unable to Add Item";
            result.title = "Info";
            result.refresh = false;
          }
          deffered.resolve(result);
        });
    } catch (e) {
      result = {};
      result.message = "Failed to add";
      result.title = "Warning";
      result.refresh = false;
      result.reason = e.message;
      deffered.reject(result);

    }
    return deffered.promise;
  }


  function updateExpense(expenseObj) {
    var query = "UPDATE expenses set  category=? , expensename=?, amount=?, comments=?, lastEdited_by=? ,lasteEdited_date=? where id=?";
    var params = [expenseObj.category, expenseObj.expensename, expenseObj.amount, expenseObj.comments, "test", 
     expenseObj.created_date, expenseObj.id];
    var deffered = $q.defer();
    var result = {};
    try {
      dbFactory.executesqlDML(query, params)
        .then(function(responseObj) {
          if (responseObj.rowsAffected > 0 && responseObj.status == "success") {
            result.message = "Updated Item successfully";
            result.title = "Message";
            result.refresh = true;
          } else {
            result.message = "Unable to update Item";
            result.title = "Info";
          }
          deffered.resolve(result);
        });
    } catch (e) {
      result = {};
      result.message = "Failed to update Item";
      result.title = "Warning";
      result.reason = e.message;
      deffered.reject(result);
    }
    return deffered.promise;
  }



  function deleteExpense(expensId) {
    var query = "delete from expenses where id=?";
    var params = [expensId];
    var deffered = $q.defer();
    var result = {};
    try {
      dbFactory.executesqlDML(query, params)
        .then(function(responseObj) {
          if (responseObj.rowsAffected > 0 && responseObj.status == "success") {
            result.status = true;
            result.text = "Deleted Item successfully";
            result.title = "Message";
            result.refresh = true;
          } else {
            result.status = false;
            result.text = "Unable to delete Item";
            result.title = "Info";
          }
          deffered.resolve(result);
        });
    } catch (e) {
      result = {};
      result.status = false;
      result.text = "Failed to delete item";
      result.title = "Warning";
      result.reason = e.message;
      deffered.reject(result);
    }
    return deffered.promise;
  }
  return expenseObj;
}
