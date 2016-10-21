var rolemodule = angular.module('tf.homemodule.userassignmentmodule.rolemodule', []);

rolemodule.constant('ROLECONSTANTS', {
    CONFIG: {
        STATE: 'home.userassignment.role',
        URL: '/role',
        CONTROLLER: 'RoleController',
        TEMPLATEURL: 'app/partials/home/userassignment/role/role.html',
    },
    CONTROLLER: {}
});

rolemodule.config(
    ['$stateProvider',
        'ROLECONSTANTS',
        function ($stateProvider, ROLECONSTANTS) {
            $stateProvider.state(ROLECONSTANTS.CONFIG.STATE, {
                url: ROLECONSTANTS.CONFIG.URL,
                templateUrl: ROLECONSTANTS.CONFIG.TEMPLATEURL,
                controller: ROLECONSTANTS.CONFIG.CONTROLLER,
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

rolemodule.controller('RoleController',
    ['$scope',
        '$log',
        '$filter',
        '$rootScope',
        'genericService',
        '$stateParams',
        '$state',
        'StorageService',
        'roleService',
        'ROLECONSTANTS',
        function ($scope, $log, $filter, $rootScope, genericService, $stateParams, $state, StorageService, roleService, ROLECONSTANTS) {

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

            $scope.assignedSelectedRole = [];
            $scope.assignedCheck = 'uncheck';
            $scope.checkToggleAssigned = function (assignedCheck) {
                $scope.permissions = [];
                $scope.SelectedAssignedRole.roles = {};
                if ($('.selectallcheckboxassign').prop("checked") == true) {
                        $log.debug("selectallcheckboxassign is checked.");
                        $scope.SelectedAssignedRole.roles = angular.copy($scope.assignedRole);
                        $log.debug("SelectedAssignedRole :"+angular.toJson($scope.SelectedAssignedRole.roles));
                    }

            }
            $scope.unassignedSelectedRole = [];
            $scope.unAssignedCheck = 'uncheck';
            $scope.checkToggleUnAssigned = function (unAssignedCheck) {
                $log.debug("select all clicked");
                $scope.permissions = [];
                $scope.SelectedUnAssignedRole.roles = {};
                    if ($('.selectallcheckboxunassign').prop("checked") == true) {
                        $log.debug("selectallcheckboxunassign is checked.");
                        $scope.SelectedUnAssignedRole.roles = angular.copy($scope.unAssignedRole);
                        $log.debug("SelectedUnAssignedRole :"+angular.toJson($scope.SelectedUnAssignedRole.roles));
                    }

            }
            $scope.SelectedUnAssignedRole = {};
            $scope.SelectedAssignedRole = {};
            $scope.permissions = [];
            $scope.getPermissions = function (role) {
                $log.debug("role :" + angular.toJson(role));
                // $log.debug("assignedrole :"+angular.toJson($scope.assignedrole));
                // $log.debug("roleId :"+angular.toJson($scope.assignedrole.roles));
                //$scope.roleidlist=angular.copy(role[0].roleId);
                // $log.debug("roleidlist :"+angular.toJson($scope.roleidlist));
                if (role.length === 1) {
                    $log.debug("inside if roleidlist :" + angular.toJson(role));
                    var url = $rootScope.baseUrl + 'rolemgnt/rolePermissions/' + angular.toJson(role[0].roleId);
                    $log.debug("url inside if roleidlist :" + url);
                    genericService.getObjects(url).then(function (data) {
                        $log.debug("In rolePermissions api :" + angular.toJson(data));
                        $scope.permissions = angular.copy(data);
                    }, function (data) {
                        $log.debug("in failure");
                    });
                } else {
                    $log.debug("inside else roleidlist :" + angular.toJson($scope.roleidlist));
                    $scope.permissions = [];
                }
            }

            $scope.getUnassignedRoles = function () {
                var url = $rootScope.baseUrl + 'rolemgnt/roleUnAssignedlist/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                genericService.getObjects(url).then(function (data) {
                    $log.debug("In getAllUnassignedRoles api :" + angular.toJson(data));
                    $scope.unAssignedRole = angular.copy(data);
                }, function (data) {
                    $log.debug("in failure");
                });
            }
            $scope.getUnassignedRoles();


            $scope.getAssignedRoles = function () {
                var url = $rootScope.baseUrl + 'rolemgnt/roleAssignedlist/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                genericService.getObjects(url).then(function (data) {
                    $log.debug("In getAllassignedRoles api :" + angular.toJson(data));
                    $scope.assignedRole = angular.copy(data);
                }, function (data) {
                    $log.debug("in failure");
                });
            }
            $scope.getAssignedRoles();

            var findIndexOf = function (myArray, obj) {
                for (var i = 0; i < myArray.length; i++) {
                    if (angular.equals(myArray[i], obj)) {
                        return i;
                    }
                }
                return -1;
            }
            $scope.unAssignedCountForSave = 0;
            $scope.AssignedCountForSave = 0;
            $scope.saverole = function () {
                if ((angular.isUndefined($scope.unAssignedCountForSave) || !$scope.unAssignedCountForSave) && (angular.isUndefined($scope.AssignedCountForSave) || !$scope.AssignedCountForSave)) {
                    $.toaster({ priority: 'danger', message: 'Select atleast One Role to Assign or unassign' });
                    return;
                }
                else {
                    var url = $rootScope.baseUrl + 'rolemgnt/updaterole/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                    var obj = JSON.stringify({
                        params: {
                            assigned: $scope.assignedRole,
                            unAssigned: $scope.unAssignedRole
                        }
                    });
                    $rootScope.startSpin();
                    genericService.addObject(url, obj).then(function (data) {
                        $rootScope.stopSpin();
                        $.toaster({ priority: 'success', message: "role updated sucessfully" });
                        $scope.unAssignedCountForSave = 0;
                        $scope.AssignedCountForSave = 0;
                        $state.go('home.userassignment.division', { userDetails: $scope.userDetails, organization: $scope.orgobj }, { reolad: true });
                        $log.debug("In updaterole api :" + angular.toJson(data));
                    }, function (data) {
                        $log.debug("in failure");
                        $rootScope.stopSpin();
                    });
                }
            }

            $scope.moveToAssigned = function (unassignedSelectedRole) {
                if (angular.isUndefined(unassignedSelectedRole) || !unassignedSelectedRole.length) {
                    $.toaster({ priority: 'danger', message: 'Select atleast One Role to Assign' });
                    return;
                }
                angular.forEach(unassignedSelectedRole, function (value, key) {
                    $scope.assignedRole.push(angular.copy(value));
                });
                for (var i = 0; i < unassignedSelectedRole.length; i++) {
                    var index = findIndexOf($scope.unAssignedRole, unassignedSelectedRole[i]);
                    if (index !== -1) {
                        $scope.unAssignedRole.splice(index, 1);
                    }
                }
                newInput = [];
                $scope.unAssignedCountForSave = unassignedSelectedRole.length;
                $scope.SelectedUnAssignedRole = {};
                unassignedSelectedRole = [];
                $('.selectallcheckboxunassign').attr('checked', false);
            }
            $scope.moveToUnAssigned = function (assignedSelectedRole) {
                if (angular.isUndefined(assignedSelectedRole) || !assignedSelectedRole.length) {
                    $.toaster({ priority: 'danger', message: 'Select atleast One Role to UnAssign' });
                    return;
                }
                angular.forEach(assignedSelectedRole, function (value, key) {
                    $log.info('came :' + assignedSelectedRole);
                    $scope.unAssignedRole.push(angular.copy(value));
                });
                for (var i = 0; i < assignedSelectedRole.length; i++) {
                    var index = findIndexOf($scope.assignedRole, assignedSelectedRole[i]);
                    if (index !== -1) {
                        $scope.assignedRole.splice(index, 1);
                    }
                }
                newInput = [];
                $scope.AssignedCountForSave = assignedSelectedRole.length;
                $scope.SelectedAssignedRole = {};
                assignedSelectedRole = [];
                $('.selectallcheckboxassign').attr('checked', false);
            }

            $scope.updateDivisionAssignment = function () {
                var obj = {};
                obj.userId = $scope.userDetails.userId;
                obj.organizationIds = $scope.assignedDivision;
                obj.modifiedById = $rootScope.adminId;
                obj.addUserToOrg = true;
                if (!angular.isUndefined($scope.notes)) {
                    obj.note = $scope.user.notes;
                } else {
                    obj.note = '';
                }
                if (obj.organizationIds.length) {
                    genericService.addObject($rootScope.baseUrl + 'divisionAssignment/addOrAssignUserToOrg/', obj).then(function (data) {
                        $.toaster({ priority: 'success', message: divisionAddedSuccessfully });
                        $('#adddivision').trigger('click');
                    }, function (data) {
                    });
                } else {
                    $.toaster({ priority: 'danger', message: atleatOneDivisionAssign });
                }
            }
            onresize();
        }
    ]);

rolemodule.factory('roleService', ['ROLECONSTANTS',
    function (ROLECONSTANTS) {
        var factory = {};
        return factory;
    }
]);