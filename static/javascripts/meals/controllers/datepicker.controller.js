/**
 * Created by rogueleaderr on 6/22/15.
 */
(function(){
    angular.module('ui.bootstrap').controller('DatepickerDemoCtrl',  function ($scope, $timeout) {

        var vm = $scope.$parent;
        
        vm.today = function() {
            vm.dt = new Date();
        };
        vm.today();

        vm.showWeeks = true;
        vm.toggleWeeks = function () {
            vm.showWeeks = ! vm.showWeeks;
        };

        vm.clear = function () {
            vm.dt = null;
        };

        vm.toggleMin = function() {
            vm.minDate = ( vm.minDate ) ? null : new Date();
        };
        vm.toggleMin();

        vm.open = function() {
            $timeout(function() {
                vm.opened = true;
            });
        };

        vm.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        vm.save = function(){
            alert(vm.dt);
        }
    });
})();
