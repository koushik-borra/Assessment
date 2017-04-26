'use strict';

var app = angular.module('ACControlSystem', []);
app.controller('AirCraftController', function($scope, $location) {
    $scope.typeOfAircraft = ['Passenger', 'Cargo'];
    $scope.sizeOfAircraft = ['Small', 'Large'];
    $scope.selectedTypeOfAircraft = 'Passenger';
    $scope.selectedSizeOfAircraft = 'Small';
    $scope.aircraftIndex = 0;
    var consolidatedAndSortedPassengerAC = [];
    var consolidatedAndSortedCargoAC = [];
    $scope.enqueueHide = true;
    $scope.hideLogic = true;

    // This event occurs when user clicks on the start button, only the main view containing add/ move acs will be enabled 
    $scope.save = function() {
        //$location.path("/mainpage.html");
        $scope.hideStart = true;
        $scope.hideLogic = false;
    }

    //This is to initialize the type of ac
    function initSelectedTypeOfAircraft() {
        $scope.typeOfAircraft = ['Passenger', 'Cargo'];
    }
    //This is to initialize the size of ac
    function initSelectedSizeOfAircraft() {
        $scope.sizeOfAircraft = ['Small', 'Large'];
    }

    //This is happens when there is a change in the AC Type dropdown
    $scope.changeTypeOfAircraft = function(changedTypeOfAircraft) {
        $scope.selectedTypeOfAircraft = changedTypeOfAircraft;
    }
    //This is happens when there is a change in the AC Size dropdown
    $scope.changeSizeOfAircraft = function(changedSizeOfAircraft) {
        $scope.selectedSizeOfAircraft = changedSizeOfAircraft;
    }
    //This is happens when user clicks on Add AC Button, AC is registered
    //Here we store passenger and cargo arrays
    //each array internally has another array example: [[1,passenger,small],[1,passenger,large]] etc
    $scope.addValues = function() {
        $scope.addedAircraft = null;
        var consolidatedKeyValue = [];
        $scope.aircraftIndex++;
        consolidatedKeyValue[0] = $scope.aircraftIndex;
        consolidatedKeyValue[1] = $scope.selectedTypeOfAircraft;
        consolidatedKeyValue[2] = $scope.selectedSizeOfAircraft;
        // a message which acts like a model to send the information to user after AC is added
        $scope.addedAircraft = "Aircraft " + consolidatedKeyValue[0] + " of type " + consolidatedKeyValue[1] + " having " + consolidatedKeyValue[2] + " capacity has been registered into the airport";
        //if the value is of passenger then it is pushed to the passenger array
        if (consolidatedKeyValue[1] === 'Passenger') {
            consolidatedAndSortedPassengerAC.push(consolidatedKeyValue);
        } else if (consolidatedKeyValue[1] === 'Cargo') {
            //if the value is of passenger then it is pushed to the cargo array
            consolidatedAndSortedCargoAC.push(consolidatedKeyValue);
        }
        console.log("Added Value " + consolidatedKeyValue);
        //Once the values are in, they are sorted with the present array
        sortAC();
    }
    //watcher to watch the changes in the type of aircraft dropdown
    $scope.$watch('selectedTypeOfAircraft', function(newValue, oldValue) {
        if (!newValue)
            return;

        initSelectedTypeOfAircraft();
    });
    //watcher to watch the changes in the size of aircraft dropdown
    $scope.$watch('selectedSizeOfAircraft', function(newValue, oldValue) {
        if (!newValue)
            return;

        initSelectedSizeOfAircraft();
    });
    //sorts array inside an array
    function Comparator(a, b) {
        if (a[2] < b[2]) return -1;
        if (a[2] > b[2]) return 1;
        return 0;
    }
    //sort function for both passenger and cargo arrays which takes help of comprator to sort values in array of arrays
    function sortAC() {
        consolidatedAndSortedPassengerAC.sort(Comparator);
        consolidatedAndSortedCargoAC.sort(Comparator);
    }
    // show list is triggered when users clicks on view consolidated/ sorted list of items
    $scope.showList = function() {
        //hides all the flags except the view list flag
        $scope.hideLogic = true;
        $scope.enqueueHide = false;
        sortAC();
        $scope.combinePassengerCargo = [];
        $scope.combinePassengerCargo = consolidatedAndSortedPassengerAC.concat(consolidatedAndSortedCargoAC);
    }
    //These flags are set/ unset when users needs to go back from the consolidated list of AC's view
    $scope.setBackFlag = function() {
        $scope.hideLogic = false;
        $scope.enqueueHide = true;
    }

    // ac in the top of the sort array is removed once the user clicks on move AC from the airport
    //The shifted message is recorded and sent to the main view
    //The values are sorted before the shift happens
    $scope.dequeueFromTop = function() {
        $scope.shiftedValue = [];
        sortAC();

        if (consolidatedAndSortedPassengerAC.length !== 0) {
            //console.log("Dequeued Aircraft " + consolidatedAndSortedPassengerAC[0][0] + " " + consolidatedAndSortedPassengerAC[0][1] + " " + consolidatedAndSortedPassengerAC[0][2]);
            $scope.shiftedValue = consolidatedAndSortedPassengerAC.shift();
        } else if (consolidatedAndSortedCargoAC.length !== 0) {
            //console.log("Dequeued Aircraft " + consolidatedAndSortedCargoAC[0][0] + " " + consolidatedAndSortedCargoAC[0][1] + " " + consolidatedAndSortedCargoAC[0][2]);
            $scope.shiftedValue = consolidatedAndSortedCargoAC.shift();
        }
        if ($scope.shiftedValue[0] !== undefined) {
            console.log($scope.shiftedValue[0]);
            $scope.shiftedValue = "Aircraft " + $scope.shiftedValue[0] + " of type " + $scope.shiftedValue[1] + " having " + $scope.shiftedValue[2] + " capacity has left the airport";
        } else {
            $scope.shiftedValue = "No Aircraft to dequeue";
        }
    }
});