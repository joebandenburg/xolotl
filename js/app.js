var app = angular.module('XolotlApp', ['XolotlAppEvents']);

app.controller('ChatController', function($scope) {

    console.log(chrome.app.window.current().id);

    $scope.conversations = {
            "+447000000001-1000000" : { body: "Hello, how are you?", self: false, status: "sending...", sentTime: 1000000 },
            "+447000000001-1000002" : { body: "I'm, fine thanks. You?", self: true, status: "failed", sentTime: 1000002 },
            "+447000000001-1000003" : { body: "no complaints", self: false, status: "sent", sentTime: 1000003 }
        }

    $scope.conversationData = Object.keys($scope.conversations).map(function (key) {return $scope.conversations[key]});

    $scope.sendMessage = function() {

        $scope.conversationData.push({body: $scope.inputMessage, self: true});
        $scope.inputMessage = "";
    };

});

app.controller('ContactsController', function($scope) {
    $scope.contacts = [
    {
        name: "Troy McClure",
        number: "123976976876"
    },
    {
        name: "Sea Captain",
        number: "456786767867"
    },
    {
        name: "",
        number: "4576455464564"
    }];

    $scope.inputNumber = ""

    var isValidNumber = function(number) {
        // todo
        return true;
    };

    $scope.addContact = function() {
        var num = $scope.inputNumber;
        if (isValidNumber(num)) {
            $scope.contacts.push({name: "", number: num})
            $scope.inputNumber = "";
        }
    };

    $scope.openConversation = function(contact) {
        chrome.app.window.create('chat.html', {
            'id': contact.number,
            innerBounds: {
                width: 300,
                height: 500,
                minWidth: 300,
                minHeight: 500
            }//,
        //    frame: "none"
          });
    };


});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

// app.factory('db', function apiTokenFactory() {
//   var encrypt = function(data1, data2) {
//     // NSA-proof encryption algorithm:
//     return (data1 + ':' + data2).toUpperCase();
//   };

//   var secret = window.localStorage.getItem('myApp.secret');
//   var apiToken = encrypt(clientId, secret);



//   return apiToken;
// }]);


// app.factory('Articles', ['$resource',
//   function($resource) {
//     return $resource('articles/:articleId', {
//       articleId: '@_id'
//     }, {
//       update: {
//         method: 'PUT'
//       }
//     });
//   }
// ]);
