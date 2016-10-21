var groupmodule = angular.module('tf.homemodule.userassignmentmodule.groupmodule', []);

groupmodule.constant('GROUPCONSTANTS', {
    CONFIG: {
        STATE: 'home.userassignment.group',
        URL: '/group',
        CONTROLLER: 'GroupController',
        TEMPLATEURL: 'app/partials/home/userassignment/group/group.html',
    },
    CONTROLLER: {}
});

groupmodule.config(
    ['$stateProvider',
        'GROUPCONSTANTS',
        function ($stateProvider, GROUPCONSTANTS) {
            $stateProvider.state(GROUPCONSTANTS.CONFIG.STATE, {
                url: GROUPCONSTANTS.CONFIG.URL,
                templateUrl: GROUPCONSTANTS.CONFIG.TEMPLATEURL,
                controller: GROUPCONSTANTS.CONFIG.CONTROLLER,
                data: {
                    requireLogin: false
                },
                params: {
                    userDetails: null,
                    organization: null
                }
            });
        }
    ]);

groupmodule.controller('GroupController',
    ['$scope',
        '$log',
        '$stateParams',
        'StorageService',
        'groupService',
        'GROUPCONSTANTS',
        'genericService',
        '$rootScope',
        '$state',
        function ($scope, $log, $stateParams, StorageService, groupService, GROUPCONSTANTS, genericService, $rootScope, $state) {

            $log.debug('state object :' + angular.toJson($stateParams.organization));
            if (angular.isDefined($stateParams.userDetails) && $stateParams.userDetails !== null) {
                $scope.userDetails = angular.copy($stateParams.userDetails);
                StorageService.set('userDetails', $scope.userDetails);
                $stateParams.userDetails = null;
            } else {
                var temp = StorageService.get('userDetails');
                if (temp !== null) {
                    $scope.userDetails = angular.copy(temp);
                    temp = null;
                } else {
                    //TODO: INVALID SESSION
                }
            }

            $scope.unAssignedCountForSaveGroup = 0;
            $scope.assignedCountForSaveGroup = 0;

            //check for organization object
            if (angular.isDefined($stateParams.organization) && $stateParams.organization !== null) {
                $scope.organization = angular.copy($stateParams.organization);
                StorageService.set('organization', $scope.organization);
                $stateParams.organization = null;
            } else {
                var temp = StorageService.get('organization');
                if (temp !== null) {
                    $scope.organization = angular.copy(temp);
                    temp = null;
                } else {
                    //TODO: INVALID SESSION
                }
            }

            //just to check functionality
            //$scope.userDetails.userId=155;
            //$scope.organization.organizationId=1;


            $scope.getAllGroup = function () {
                genericService.getObjects($rootScope.baseUrl + 'groupassignment/getgroup/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId + '/' + $rootScope.adminId).then(function (data) {
                    //genericService.getObjects($rootScope.baseUrl + 'groupassignment/getgroup/' + 155 + '/' + 1 + '/' + 2).then(function (data) {
                    $scope.groupList = data;
                    $scope.oldassignedgrouplist = angular.copy(data.assigned);
                    $scope.assignedgrplist = angular.copy(data.assigned);
                    $scope.unassignedgrplist = data.unAssigned;
                    //console.log($scope.groupList);
                    //console.log("Assigned " + angular.toJson($scope.assignedgrplist));
                    //console.log("un assigned " + angular.toJson($scope.unassignedgrplist));
                }, function (data) {
                    $log.error('getDivisionAssignments failed : ' + angular.toJson(data));
                    $.toaster({ priority: 'danger', message: registrationFailed });
                });
            }

            $scope.getAllGroup();
            $scope.unassignedSelectedGroup={};
            $scope.assignedSelectedGroup={};
            $scope.backToUserList = function () {
                $state.go('home.user.viewusers');
            }

            $scope.unassignedSelectedGroup = [];
            $scope.unAssignedCheck = 'uncheck';
            $scope.checkToggleUnAssigned = function (unAssignedCheck) {
                $scope.flag='checkUnAssigned';
                  $log.debug('assignall clicked ');
               $scope.unassignedSelectedGroup.groups = {};
                
               if ($('.selectallcheckboxunassigngroup').prop("checked") == true) {
                        $log.debug("selectallcheckboxassign is checked.");
                        $scope.unassignedSelectedGroup.groups = angular.copy($scope.unassignedgrplist);
                        $log.debug("SelectedAssignedRole :"+angular.toJson($scope.unassignedSelectedGroup.groups));
                    }
            }
            $scope.flag=null;
            $scope.assignedSelectedGroup = [];
            $scope.assignedCheck = 'uncheck';
            $scope.checkToggleAssigned = function (assignedCheck) {
                $scope.flag='checkAssigned';
                $log.debug('checkToggleAssigned clicked ');
                $scope.assignedSelectedGroup.groups = {};
                 //$scope.assignedgrplist = [];
                  if ($('.selectallcheckboxassigngroup').prop("checked") == true) {
                        $log.debug("selectallcheckboxassign is checked.");
                        $scope.assignedSelectedGroup.groups = angular.copy($scope.assignedgrplist);
                        $log.debug("SelectedAssignedRole :"+angular.toJson($scope.assignedSelectedGroup.groups));
                    }
                // if (assignedCheck.toString() === 'check') {
                   
                //         $scope.assignedSelectedGroup.groups = angular.copy($scope.assignedgrplist);
                    
                // }
            }


            //use to assign all group from unassign group
            $scope.assignall = function () {
              
                 // $scope.unassignedSelectedGroup.groups = {};
                angular.forEach($scope.unassignedgrplist, function (item) {
                    $scope.assignedgrplist.push(item);
                });
                $scope.unassignedgrplist = [];
               $scope.unassignedSelectedGroup.groups = {};
                $scope.unAssignedCheck = 'uncheck';
                $scope.assignedCheck = 'uncheck';
            };

            //use to unassign all group from assign group
            $scope.unassignall = function () {
                $log.debug('unassignall clicked ');
               
                  
                angular.forEach($scope.assignedgrplist, function (item) {
                    $scope.unassignedgrplist.push(item);
                });
                $scope.assignedgrplist = [];
               $scope.assignedSelectedGroup.groups = {};
                $scope.assignedCheck = 'uncheck';
                $scope.unAssignedCheck = 'uncheck';
                //console.log("$scope.assignedgrplist " + angular.toJson($scope.assignedgrplist));
            };

            //use to unassign group from selected assign group
            $scope.unassignitem = function (assignedSelectedGroup) {
                console.log("unassignitem : " + assignedSelectedGroup);
                $scope.assignedSelectedGroup.groups = {};
                if(angular.equals($scope.flag, 'checkAssigned')){
                    $scope.assignedgrplist = [];
                    $scope.flag=null;
                }
                if (angular.isUndefined(assignedSelectedGroup) || !assignedSelectedGroup.length) {
                    $.toaster({ priority: 'warning', message: "Please select atleast one group to un-assign " });
                    return;
                }
                var i;
                if (assignedSelectedGroup.length != 0) {

                    for (i = 0; i < assignedSelectedGroup.length; i++) {

                        var index = $scope.unassignedgrplist.indexOf(assignedSelectedGroup[i])
                        var index1 = $scope.assignedgrplist.indexOf(assignedSelectedGroup[i])
                        //console.log('Unassigned: ' + index);
                        if (index == -1) {
                            $scope.unassignedgrplist.push(assignedSelectedGroup[i]);

                        }

                        if (index1 != -1) {
                            //console.log('Index: ' + index);
                            $scope.assignedgrplist.splice(index1, 1);
                            //console.log('Lenght aft remove: ' + $scope.oldassignedgrouplist.length);

                        }
                    }
                    $scope.assignedCheck = 'uncheck';
                }
                $scope.assignedCountForSaveGroup = assignedSelectedGroup.length
                 $('.selectallcheckboxassigngroup').attr('checked', false);
            
            };

            //use to assign group from selected unassign group
            $scope.assignitem = function (unassignedSelectedGroup) {
                     $scope.unassignedSelectedGroup.groups = {};
                     if(angular.equals($scope.flag, 'checkUnAssigned')){
                    $scope.unassignedgrplist = [];
                    $scope.flag=null;
                }
                $log.debug('assignitem clicked ');
              //  $scope.unassignedSelectedGroup.groups = {};
                //console.log("unassignedgroup " + unassignedgroup);
                if (angular.isUndefined(unassignedSelectedGroup) || !unassignedSelectedGroup.length) {
                    $.toaster({ priority: 'warning', message: "Please select atleast one group to assign " });
                    return;
                }
                var i;
                if (unassignedSelectedGroup.length != 0) {

                    for (i = 0; i < unassignedSelectedGroup.length; i++) {
                        //console.log('before assigned: ' + $scope.assignedgrplist);
                        var index = $scope.assignedgrplist.indexOf(unassignedSelectedGroup[i])
                        var index1 = $scope.unassignedgrplist.indexOf(unassignedSelectedGroup[i])
                        //console.log('Unassigned: ' + index);
                        if (index == -1) {
                            $scope.assignedgrplist.push(unassignedSelectedGroup[i]);
                        }
                        if (index1 != -1) {
                            //console.log('Index: ' + index);
                            $scope.unassignedgrplist.splice(index1, 1);
                        }
                        //console.log('assigned: ' + $scope.assignedgrplist);
                    }
                    $scope.unAssignedCheck = 'uncheck';
                }
                $scope.unAssignedCountForSaveGroup = unassignedSelectedGroup.length
                 $('.selectallcheckboxunassigngroup').attr('checked', false);
          
            };

            $scope.savegroup = function () {
                if ((angular.isUndefined($scope.unAssignedCountForSaveGroup) || !$scope.unAssignedCountForSaveGroup) && (angular.isUndefined($scope.assignedCountForSaveGroup) || !$scope.assignedCountForSaveGroup)) {
                    $.toaster({ priority: 'warning', message: 'Select atleast One Group to Assign or unassign' });
                    return;
                }
                else {
                    //console.log("old list " + angular.toJson($scope.oldassignedgrouplist));
                    var jsonData = JSON.stringify({
                        params: {
                            assigned: $scope.oldassignedgrouplist,
                            unAssigned: $scope.assignedgrplist
                        }
                    });

                    var url = $rootScope.baseUrl + 'groupassignment/updategroup/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId + '/' + $rootScope.adminId;
                    $rootScope.startSpin();
                    genericService.addObject(url, jsonData).then(function (data) {
                        $.toaster({ priority: 'success', message: 'Group is successfully updated' });
                        $rootScope.stopSpin();
                        $scope.getAllGroup();
                        $scope.unAssignedCountForSaveGroup = 0;
                        $scope.assignedCountForSaveGroup = 0;
                        $state.go('home.userassignment.division', { userDetails: $scope.userDetails, organization: $scope.orgobj }, { reolad: true });
                    }, function (data) {
                        $rootScope.stopSpin();
                        $log.error('getDivisionAssignments failed : ' + angular.toJson(data));
                        $.toaster({ priority: 'danger', message: 'Updation Failed' });
                    });

                };

                onresize();
            }
        }
    ]);

groupmodule.factory('groupService', ['GROUPCONSTANTS',
    function (GROUPCONSTANTS) {
        var factory = {};
        return factory;
    }
]);