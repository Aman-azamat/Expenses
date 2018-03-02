angular.module("popupModule",[])
.factory("popupService", popupService)


function popupService($ionicPopup,$rootScope){
var popupObj={};
popupObj.showAlert=showAlert;
popupObj.showFormPopup=showFormPopup;
var scope=""; 
function showAlert (titlecontent,messagecontent) {
     var alertPopup = $ionicPopup.alert({
         title: titlecontent,
         template: messagecontent
      });
      alertPopup.then(function(res) {
         
      });
   }


function showFormPopup(titlecontent,templatecontet,buttonsArray,scopeObject)
{
  //scopeObj=$rootScope.$new(); scope.data = {}
try{
console.log('templatecontet::'+templatecontet);
$ionicPopup.show({
    template: templatecontet,
    title: titlecontent,
    scope: scopeObject,
    buttons: buttonsArray
  });




}catch(e){
	console.log("Error::"+e.message);
}

}


return popupObj;
};