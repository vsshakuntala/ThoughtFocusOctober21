var usermodule = angular.module('tf.homemodule.usermodule.viewusers', ['datatables']);

usermodule.constant('VIEWUSERCONSTANTS', {
    CONFIG: {
        STATE: 'home.user.viewusers',
        URL: '/viewusers',
        CONTROLLER: 'ViewUsersController',
        TEMPLATEURL: 'app/partials/home/useraccount/viewusers/viewusers.html',
    },
    CONTROLLER: {}
});

usermodule.config(
    ['$stateProvider',
        'VIEWUSERCONSTANTS',
        function ($stateProvider, VIEWUSERCONSTANTS) {
            $stateProvider.state(VIEWUSERCONSTANTS.CONFIG.STATE, {
                url: VIEWUSERCONSTANTS.CONFIG.URL,
                templateUrl: VIEWUSERCONSTANTS.CONFIG.TEMPLATEURL,
                controller: VIEWUSERCONSTANTS.CONFIG.CONTROLLER,
                data: {
                    requireLogin: false
                },
                resolve: {
                    divisionList: function ($rootScope, genericService) {
                        return genericService.getObjects($rootScope.baseUrl + 'userlists/getalldivisions');
                    }
                }
            });
        }
    ]);

usermodule.controller('ViewUsersController',
    ['$scope',
        '$state',
        '$rootScope',
        '$log',
        '$compile',
        '$filter',
        'divisionList',
        'DTOptionsBuilder',
        'DTColumnBuilder',
        'genericService',
        'applicationUtilityService',
        'viewUsersService',
        'VIEWUSERCONSTANTS',
        function ($scope, $state, $rootScope, $log, $compile, $filter, divisionList, DTOptionsBuilder,
            DTColumnBuilder, genericService, applicationUtilityService,
            viewUsersService, VIEWUSERCONSTANTS) {
            $scope.totalrows = 0;
            $scope.angular = angular;
            $scope.dataInTable = [];
            $scope.statuses = [{ status: 'Pending' }, { status: 'Approved' }, { status: 'Deleted' }];
            $scope.filteredObjects = {
                divisions: [],
                roles: [],
                status: ['Pending'],
                companyName: '',
                name: '',
                from_date: '',
                to_date: ''
            };
            $rootScope.filteredObjectsCopy = {
                divisions: [],
                roles: [],
                status: ['Pending'],
                companyName: '',
                name: '',
                from_date: '',
                to_date: ''
            };
            $scope.searchValue = '';
            /**
             * Start of datepicker related configuration and settings
             */
            $scope.end = new Date();
            $scope.maxEndDate = $scope.end;
            $scope.format = 'dd-MMM-yyyy';
            $scope.dateOptions = {
                fromDate: {
                    appendToBody: true,
                    startingDay: 1,
                    showWeeks: false
                },
                toDate: {
                    appendToBody: true,
                    startingDay: 1,
                    showWeeks: false
                }
            };
            $scope.fromDateopened = false;
            $scope.toDateopened = false;
            $scope.open = function (type) {
                if (angular.equals(type, 'fromDate')) {
                    $scope.fromDateopened = true;
                } else {
                    $scope.toDateopened = true;
                }
            };
            /**
              * End of datepicker related configuration and settings
              */

              
            /**
             * To get flags based on contact number.
             */
            $scope.getflagByCountryCode = function (userId) {
                if (userId !== null) {
                    var obj = $filter('filter')($scope.dataInTable, { userId: userId }, true);
                    if (obj.length) {
                        return obj[0].countryFlag;
                    }
                    return;
                }
            }

            $scope.drawCustomeFilteredDataTable = function () {
                $rootScope.filteredObjectsCopyInDivision = null;
                var obj = angular.copy($scope.filteredObjects);
                obj.search = {};
                obj.search.value = $scope.searchValue;
                $scope.filteredObjects = angular.copy(obj);
                $scope.drawDataTable();
                // $('#globsearch').val('');
                if (angular.equals($rootScope.filteredObjectsCopyInDivision, null)) {
                    $scope.filteredObjects.search = '';
                }
                //$scope.searchValue='';
            }

            $(function () {
                $("form input").keypress(function (e) {
                    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                        $scope.drawCustomeFilteredDataTable();
                        // $('button[type=submit] .default').click();
                        //return false;
                    }
                });
            });

            function MakefilteredObjectsCopy() {
                if ((angular.isUndefined($rootScope.filteredObjectsCopyInDivision) || angular.equals($rootScope.filteredObjectsCopyInDivision, null))) {
                    $rootScope.flag = 0;
                    $rootScope.filteredObjectsCopy = angular.copy($scope.filteredObjects);
                    if (!angular.equals($scope.searchValue, '')) {
                        $rootScope.filteredObjectsCopy.search = {};
                        $rootScope.filteredObjectsCopy.search.value = $scope.searchValue;
                        $rootScope.filteredObjectsCopyInDivision = null;
                    }
                }
                else {
                    $rootScope.filteredObjectsCopy = angular.copy($rootScope.filteredObjectsCopyInDivision);
                    if (!angular.isUndefined($rootScope.filteredObjectsCopyInDivision.search)) {
                        $rootScope.filteredObjectsCopy.search = {};
                        $rootScope.filteredObjectsCopy.search.value = $rootScope.filteredObjectsCopyInDivision.search.value;
                    }
                }
            }

            $('.statuscheckbox').click(function() {
                        $log.debug("!!filteredObjects.status :"+angular.toJson($scope.filteredObjects.status));
                       if($('.deleted').prop("checked") == true) {
                            $log.debug("deleted :"+angular.toJson($scope.filteredObjects.status));
                                $('.pending').attr('checked', false); 
                                $('.approved').attr('checked', false);
                                 $('.pending').attr('disabled', true);
                                 $('.approved').attr('disabled', true);
                                 $scope.filteredObjects.status=['Deleted'];
                        }else{
                            $('.pending').attr('disabled', false);
                                 $('.approved').attr('disabled', false);
                        }

                    });
            $scope.drawDataTable = function () {
                $log.debug("filteredObjects.status :"+angular.toJson($scope.filteredObjects.status));
                $log.debug("date " + $scope.maxEndDate);
                MakefilteredObjectsCopy();

                if ($rootScope.flag == 1) {
                    $scope.filteredObjects = angular.copy($rootScope.filteredObjectsCopyInDivision);
                    if (!angular.isUndefined($scope.filteredObjects.search)) {
                        $scope.searchValue = $scope.filteredObjects.search.value;
                    }
                    $rootScope.flag = 0;
                }
                else {
                    $rootScope.filteredObjectsCopyInDivision = null;
                    $rootScope.flag = 0;
                };
                if (($scope.filteredObjects.name != '' || $scope.filteredObjects.companyName != '') && !angular.equals($rootScope.filteredObjectsCopyInDivision, null)) {
                    $scope.totalrows = 0;

                }

                $(".searchbtn").click(function () {
                    $rootScope.filteredObjectsCopyInDivision = null;
                    $scope.filteredObjects.search = '';
                    $scope.searchValue = '';
                });

                 
                var index = -1;
                //$scope.totalrows = 0;
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        url: $rootScope.baseUrl + 'userlists/getfiltereduserlist',
                        type: 'GET',
                        data: applicationUtilityService.buildDataObjectForDataTable($scope.filteredObjects)
                    })
                    .withDataProp('data')
                    .withOption('processing', true)
                    .withOption('oLanguage', { sProcessing: '<div ><img src="app-content/img/blueimp/loading.gif" alt="nothing" class="loadposition"/></div>', sEmptyTable: "No matching results found for this search criteria" })
                    .withOption('serverSide', true)
                    .withOption('searching', false)
                    .withOption('bDestory', true)
                    .withPaginationType('full_numbers')
                    .withOption('bFilter', true)
                    .withOption('order', [3, 'desc'])
                    .withOption('rowCallback', rowCallback)
                    .withOption('createdRow', function (row, data, dataIndex) {
                        index++;
                        // Recompiling so we can bind Angular directive to the DT
                        $compile(angular.element(row).contents());
                    });
                   
                    
                    
                function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $scope.totalrows = this.fnSettings().fnRecordsTotal();
                    $scope.$apply();
                    $(nRow).mouseover(function (e) {
                        $(nRow).addClass('highlight');
                    })
                    $(nRow).mouseout(function (e) {
                        $(nRow).removeClass('highlight');
                    })
                    $('td', nRow).unbind('click');
                    $('td', nRow).bind('click', function () {
                        $scope.$apply(function () {
                            var obj = {
                                userId: aData.userId,
                                userName: aData.userName,
                                userLastActiveDate: aData.last_date,
                                userEmail: aData.email
                            }
                            $log.debug('division : ' + angular.toJson(obj));
                            $state.go('home.userassignment.division', { userDetails: obj }, { reload: true });
                        });



                    });
                    if (iDisplayIndex === index) {
                        onresize();
                        index = -1;
                    }
                    return nRow;
                }
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('userName').withTitle('User Name').withOption('name', 'userName'),
                    DTColumnBuilder.newColumn('firstName').withTitle('First Name').withOption('name', 'firstName').renderWith(function (data, type, full) {
                        if (!full.firstName)
                            full.firstName = '--';
                        return full.firstName;
                    }),
                    DTColumnBuilder.newColumn('lastName').withTitle('Last Name').withOption('name', 'lastName').renderWith(function (data, type, full) {
                        if (!full.lastName)
                            full.lastName = '--';
                        return full.lastName;
                    }),
                    DTColumnBuilder.newColumn('createdDate').withTitle('Registered Date').withOption('name', 'createdDate').renderWith(function (data, type, full) {
                        if (data === null) {
                            return null;
                        }
                        var date = new Date(data);
                        var month = date.getMonth() + 1;
                        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                        ];
                        return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
                    }),
                    DTColumnBuilder.newColumn('phoneNumber').withTitle('Phone').withOption('name', 'phoneNumber').renderWith(function (data, type, full) {
                        //return full.phoneNumber;
                        if (!full.phoneNumber)
                            full.phoneNumber = '--';
                        var flag = '' + full.countryFlag;
                        return '<td><span class="iti-flag-custom" ng-class="getflagByCountryCode(' + full.userId + ')"></span>' + full.phoneNumber + '</td>';
                    }),
                    DTColumnBuilder.newColumn('companyName').withTitle('Company Name').withOption('name', 'companyName'),
                    DTColumnBuilder.newColumn('null').withTitle('Status').withOption('name', 'null').withOption('sortable', false).renderWith(function (data, type, full) {
                        if (full.Approved == 0 && full.Pending == 0) {
                            return 'DELETED';
                        }
                        if (full.active === false) {
                            return 'DELETED';
                        }
                        else {
                            if (full.Pending == 0)
                                return 'APPROVED';
                            else
                                return 'PENDING';
                        }
                    }),
                    DTColumnBuilder.newColumn('Approved').withTitle('Approved').withOption('name', 'Approved').renderWith(function (data, type, full) {
                        if (full.Approved === 0 && full.Pending === 0) {
                            return '<td><span class="label label-danger custom-style">' + full.Approved + '</span></td>';

                        }
                        else if (full.Approved === 0 && full.Pending > 0) {
                            return '<td><span class="label custom-style" style="color:black">' + full.Approved + '</span></td>';
                        }
                        else if (full.Approved > 0) {
                            return '<td><span class="label label-success custom-style">' + full.Approved + '</span></td>';
                        }

                    }),

                    DTColumnBuilder.newColumn('Pending').withTitle('Pending').withOption('name', 'Pending').renderWith(function (data, type, full) {
                        if (full.Pending === 0 && full.Approved === 0) {
                            return '<td><span class="label label-danger custom-style">' + full.Pending + '</span></td>';

                        }
                        else if (full.Pending > 0) {
                            return '<td><span class="label pendingSpan custom-style">' + full.Pending + '</span></td>';
                        }
                        else if (full.Approved > 0 && full.Pending === 0) {
                            return '<td><span class="label custom-style" style="color:black">' + full.Pending + '</span></td>';

                        }
                    })
                ];

                $scope.dtInstanceCallback = function (dtInstance) {
                    $scope.dtInstance = dtInstance;
                    dtInstance.DataTable.on('draw.dt', function () {
                        $scope.dataInTable = [];
                        for (var i = 0; i < dtInstance.DataTable.context[0].aoData.length; i++) {
                            $scope.dataInTable.push(dtInstance.DataTable.context[0].aoData[i]._aData);
                        }
                        let elements = angular.element("#" + dtInstance.id + " .ng-scope");
                        angular.forEach(elements, function (element) {
                            $compile(element)($scope);
                        });
                        onresize();
                    });
                }
            }

            /**
             * function to get all divisions which was loaded before controller loaded
             * SEE CONFIG SECTION THIS MODULE
             */
            var getDivisions = function () {
                $scope.divisions = divisionList;
                $scope.filteredObjects.divisions = applicationUtilityService.checkAllObjectsInList($scope.divisions, 'organizationId');
                $scope.drawDataTable();
            };

            /**
             * function to get all roles
             */
            var getRoles = function () {
                genericService.getObjects($rootScope.baseUrl + 'userlists/getallroles').then(function (data) {
                    $scope.roles = data;
                }, function () {
                });
            };

            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }



            $scope.download = function () {
                var url = $rootScope.baseUrl + 'userlists/downloaddocument/';
                var obj = {};
                $log.info('$scope.data : ' + angular.toJson($scope.filteredObjects));
                obj = angular.copy($scope.filteredObjects);
                if (!angular.equals($scope.filteredObjects.from_date, '')) {
                    obj.from_date = formatDate($scope.filteredObjects.from_date);
                }
                if (!angular.equals($scope.filteredObjects.to_date, '')) {
                    obj.to_date = formatDate($scope.filteredObjects.to_date);
                }
                var data = applicationUtilityService.buildDataObjectForDataTable(obj);
                if (!angular.isUndefined($scope.filteredObjects) && !angular.equals($scope.totalrows, 0) && !angular.isUndefined($scope.totalrows)) {
                    genericService.downloadFile(url, data).then(function () {
                        $.toaster({ priority: 'success', message: downloadSuccesfull });
                    }, function () {
                        $.toaster({ priority: 'danger', message: downloadFailed });
                    });
                }
                else {
                    $.toaster({ priority: 'danger', message: noDataToDownload });
                }
            };

            /**
             * Tasks to be done on load of controller
             */
            var onLoadTasks = function () {
                getDivisions();
                getRoles();
                onresize();
            }
            onLoadTasks();
        }
    ]);

usermodule.factory('viewUsersService', ['VIEWUSERCONSTANTS',
    function (VIEWUSERCONSTANTS) {
        var factory = {};
        return factory;
    }
]);
