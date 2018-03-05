angular.module("utilsModule")
.filter('dateFilter', dateFilter);



function dateFilter() {
    return function(dateString) {
        var formattedString="";
         var date=new Date(dateString);
         formattedString=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
        return formattedString;
    };

}
