angular.module("dbModule",[])
  .factory("dbFactory", dbFactory);

function dbFactory($q, popupService) {
  var dbFactory = {};
  var db;
  dbFactory.intialiseDb = intialiseDb;
  dbFactory.createDB = createDB;

  dbFactory.executesqlBatch = executesqlBatch;
  dbFactory.executesqlSelect = executesqlSelect;
  dbFactory.executesqlDML = executesqlDML;

  function executesqlDML(query, params) {
    var deffered = $q.defer();
    var responseObj={};
    try {
      db.executeSql(query, params, function(resultSet) {
        responseObj.insertId = resultSet.insertId;
        responseObj.rowsAffected = resultSet.rowsAffected;
        responseObj.status = "success";
        deffered.resolve(responseObj);

      }, function(error) {
        console.log('executesqlDML ERROR: ' + error.message);
        responseObj.status = "failure";
        responseObj.reason = error.message;
        deffered.reject(responseObj);
      });

    } catch (e) {
      popupService.showAlert("Warning", e.message);
    }

    return deffered.promise;
  }

  function executesqlSelect(query, params) {
    var deffered = $q.defer();
    var responseObj = {};
    try {
      db.executeSql(query, params, function(rs) {
        var rowsLength = rs.rows.length;
        var resultArray = [];
        var resultObj = null;

        for (var i = 0; i < rowsLength; i++) {
          resultArray.push(rs.rows.item(i));
        }
        responseObj.result = resultArray;
        responseObj.status = "success";
        responseObj.length = rowsLength;
        deffered.resolve(responseObj);

      }, function(error) {
        console.log('SELECT SQL statement ERROR: ' + error.message);
        responseObj.status = "failure";
        responseObj.reason = error.message;
        deffered.reject(responseObj);
      });

    } catch (e) {
      popupService.showAlert("Warning", e.message);
    }
    return deffered.promise;
  }

  function executesqlBatch(queryArray) {
    var deffered = $q.defer();
    try {
      db.sqlBatch(queryArray,
        function() {
          deffered.resolve("success");
        },
        function(error) {
          deffered.reject("fail");
        }
      );

    } catch (e) {
      popupService.showAlert("Warning", e.message);
    }
    return deffered.promise;
  }


  function intialiseDb() {
    var deffered = $q.defer();
    db = window.sqlitePlugin.openDatabase({ name: "expensesDb.db", "location": "default" }, function(argument) {
      alert("Opened Db")
      deffered.resolve("success");
    }, function(argument) {
      deffered.resolve("failure");
      alert("UNABLE TO OPEN DB");
    });
    return deffered.promise;
  }
//id , category, expensename,amount,comments,create_by,created_date,lastEdited_by,lasteEdited_date  
  function createDB() {
    var deffered = $q.defer();
    try {
      var queryArray = [
        "CREATE  TABLE IF NOT EXISTS userAccounts(id integer PRIMARY KEY AUTOINCREMENT,name text NOT NULL, isactive integer)",
        "CREATE  TABLE IF NOT EXISTS expenseCategory (id integer  PRIMARY KEY AUTOINCREMENT, name text NOT NULL UNIQUE, description text)",
        "CREATE  TABLE IF NOT EXISTS expenses ( id integer  PRIMARY KEY AUTOINCREMENT, category text NOT NULL , expensename text NOT NULL, amount integer NOT NULL,  comments text  , create_by text , created_date text ,  lastEdited_by text , lasteEdited_date text )",
        "INSERT INTO expenseCategory (name,description) VALUES ( 'Savings', 'Savings')",
        "INSERT INTO expenseCategory (name,description) VALUES ( 'Education', 'Education')", "INSERT INTO expenseCategory (name,description) VALUES ( 'Clothing', 'Clothing')", "INSERT INTO expenseCategory (name,description) VALUES ( 'Medicine', 'Medicine')", "INSERT INTO expenseCategory (name,description) VALUES ( 'Transport', 'Transport')", "INSERT INTO expenseCategory (name,description) VALUES ( 'Food', 'Food')", "INSERT INTO expenseCategory (name,description) VALUES ( 'Entertainment', 'Entertainment')", "INSERT INTO expenseCategory (name,description) VALUES ( 'Rent', 'Rent')", "INSERT INTO expenseCategory (name,description) VALUES ( 'Others', 'Others')", "CREATE  TABLE IF NOT EXISTS expenses ( id integer  PRIMARY KEY AUTOINCREMENT, category text NOT NULL , expensename text NOT NULL, amount integer NOT NULL,  comments text  , create_by text NOT NULL, created_date text NOT NULL,  lastEdited_by text , lasteEdited_date text )"

      ]
      db.sqlBatch(queryArray,
        function() {
          deffered.resolve("success");
        },
        function(error) {
          deffered.reject("fail");
        }
      );
    } catch (e) {
      popupService.showAlert("Warning", e.message);
    }
    return deffered.promise;
  }
  return dbFactory;
}
