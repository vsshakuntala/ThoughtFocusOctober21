var addressmodule = angular.module('tf.homemodule.userassignmentmodule.addressmodule', []);

addressmodule.constant('ADDRESSCONSTANTS', {
    CONFIG: {
        STATE: 'home.userassignment.address',
        URL: '/address',
        CONTROLLER: 'AddressController',
        TEMPLATEURL: 'app/partials/home/userassignment/address/address.html',
    },
    CONTROLLER: {}
});
addressmodule.config(
    ['$stateProvider',
        'ADDRESSCONSTANTS',
        function ($stateProvider, ADDRESSCONSTANTS) {
            $stateProvider.state(ADDRESSCONSTANTS.CONFIG.STATE, {
                url: ADDRESSCONSTANTS.CONFIG.URL,
                templateUrl: ADDRESSCONSTANTS.CONFIG.TEMPLATEURL,
                controller: ADDRESSCONSTANTS.CONFIG.CONTROLLER,
                data: {
                    requireLogin: false
                }, params: {
                    userDetails: null,
                    organization: null
                }
            });
        }
    ]);

addressmodule.controller('AddressController',
    ['$scope',
        '$rootScope',
        '$log',
        '$filter',
        '$state',
        '$stateParams',
        'StorageService',
        'addressService',
        'genericService',
        'ADDRESSCONSTANTS',
        function ($scope, $rootScope, $log, $filter, $state, $stateParams, StorageService, addressService, genericService, ADDRESSCONSTANTS) {
            $log.debug("$stateParams.organization :" + angular.toJson($stateParams.organization));
            $scope.userDetails = {};
            $scope.organization = {};
            $scope.userOrganizationId = 0;
            $scope.defaultAddressIds = {};
            $scope.defaultAddressIdsCopy = {};
            $scope.salesAreaList = [];
            $scope.customerList = [];
            $scope.billingAddressList = [];
            $scope.shippingAddressList = [];
            var addressTypeForBillingAddress = 1;
            var addressTypeForShippingAddress = 2;
            $scope.selectedObject = {};
            $scope.addressForm = {};
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
            $log.debug("$stateParams.userDetails :" + $scope.userDetails.userName);
            if (angular.isDefined($stateParams.organization) && $stateParams.organization !== null) {
                $scope.organization = angular.copy($stateParams.organization);
                StorageService.set('organization', $scope.organization);
                $stateParams.oraganization = null;
            } else {
                var temp = StorageService.get('organization');
                console.log(angular.toJson(temp));
                if (temp !== null) {
                    $scope.organization = angular.copy(temp);
                    temp = null;
                } else {
                    //TODO: INVALID SESSION
                }
            }
            var getUserOrganizationId = function () {
                $log.debug('In getUserOrgId');
                var obj = {};
                obj.userId = $scope.userDetails.userId;
                obj.organizationId = $scope.organization.organizationId;
                genericService.addObject($rootScope.baseUrl + 'addassgn/getuserorgid', obj).then(function (response) {
                    $scope.userOrganizationId = response[0].userOrgMapId;
                    $scope.getDefaultAddress();
                }, function (response) {
                });
            }
            $scope.getDefaultAddress = function () {
                $log.debug("selected :" + angular.toJson($scope.selectedObjectName.billing) + "selectedObjectName.shipping :" + $scope.selectedObjectName.shipping);
                genericService.getObjects($rootScope.baseUrl + 'divisionAssignment/getDefaultAddressForUserOrg/' + $scope.userOrganizationId).then(function (response) {
                    $scope.defaultAddressIds = response;
                    $scope.defaultAddressIdsCopy = angular.copy(response);
                    $scope.getSalesAreaList();
                }, function (response) {
                });
            }
            var h = 0;
            var s = 0;
            var scrollheight = 0;
            $scope.updating = false;
            $scope.selectedObjectName = {};
            $scope.selectedObjectName.salesArea = '';
            $scope.selectedObjectName.customer = '';
            $scope.selectedObjectName.billing = '';
            $scope.selectedObjectName.shipping = '';
            $scope.selectedObject = {};
            $scope.selectedObject.salesAreaId = 0;
            $scope.selectedObject.customerId = 0;
            $scope.selectedObject.billToAddressId = 0;
            $scope.selectedObject.shipToAddressId = 0;
            //Since it has alredy with first page
            var pageNumberForSales = 1;
            var pageNumberForCustomer = 1;
            var countPerPage = 10;
            var queryString = null;
            var getPercentRemaining = function (ele) {
                h = ele[0].scrollHeight;
                s = ele[0].scrollHeight - ele.height();
                scrollheight = h - s;
                var scrolled = ele.scrollTop();
                var rem = h - (scrolled + scrollheight);
                return (rem * 100) / h;
            }
            var prepareApiObject = function (pageNumber, count, queryString) {
                var requestForScroll = {};
                requestForScroll.pageNumber = angular.copy(pageNumber);
                requestForScroll.count = angular.copy(count);
                requestForScroll.queryString = angular.copy(queryString);
                return requestForScroll;
            }
            /**
               * when scrolling send query param of searched text along with page number and count
               * 
               * when searching with search bar send query param of searched text with page number 
               * as 0 and what ever count needed
               */
            var scrollingInUiSelect = function (event) {
                var element = $(event.target);
                switch (true) {
                    case element.is('ul.sales'):
                        if (getPercentRemaining(element) < 20) {
                            $log.info('scrollingInUiSelect ul.sales' + getPercentRemaining(element));
                            element[0].removeEventListener('scroll', scrollingInUiSelect, true);
                            //preincrement pageNumber and append to url
                            var obj = prepareApiObject(pageNumberForSales, countPerPage, queryString);
                            var url = $rootScope.baseUrl + 'addassgn/getsalesarealist/' + $scope.organization.organizationId;
                            // var url = $rootScope.baseUrl + 'addassgn/getsalesarealist/3';
                            genericService.addObject(url, obj).then(function (data) {
                                data.data.map(function (item) {
                                    $scope.salesAreaList.push(item);
                                });
                                if (data.hasNext) {
                                    element[0].addEventListener('scroll', scrollingInUiSelect, true);
                                    pageNumberForSales++;
                                }
                            }, function () {
                                return null;
                            });
                        }
                        break;
                    case element.is('ul.customer'):
                        if (getPercentRemaining(element) < 20) {
                            $log.info('scrollingInUiSelect ul.customer' + getPercentRemaining(element));
                            element[0].removeEventListener('scroll', scrollingInUiSelect, true);
                            var url = null;
                            if ($scope.selectedObject.salesAreaId !== 0) {
                                url = $rootScope.baseUrl + 'addassgn/getCustomerBasedOnSalesAreaId/' + $scope.selectedObject.salesAreaId + '/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                            } else {
                                // url = $rootScope.baseUrl + 'addassgn/allcustomerlist/48111';
                                url = $rootScope.baseUrl + 'addassgn/allcustomerlist/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                            }
                            var obj = prepareApiObject(pageNumberForCustomer, countPerPage, queryString);
                            genericService.addObject(url, obj).then(function (data) {
                                data.data.map(function (item) {
                                    $scope.customerList.push(item);
                                });
                                if (data.hasNext) {
                                    element[0].addEventListener('scroll', scrollingInUiSelect, true);
                                }
                                pageNumberForCustomer++;
                            }, function () {
                                return null;
                            });
                        }
                        break;
                    default:
                        console.log('dont capture');
                        break;
                }
            }
            $scope.onOpenClose = function (isOpen, id) {
                queryString = null;
                if (isOpen) {
                    var ele = $("#" + id).find("ul.ui-select-choices");
                    ele.addClass(id);
                    $("#" + id).find("ul." + id)[0].addEventListener('scroll', scrollingInUiSelect, true);
                }
            }
            var customEventHandler = function (event, arg1) {
                $(document).off('myCustomEvent', customEventHandler);
                setTimeout(function () {
                    switch ($(arg1).closest(".ui-select-container").attr("id")) {
                        case 'sales':
                            pageNumberForSales = 1;
                            queryString = $(arg1).val();
                            var obj = prepareApiObject(pageNumberForSales, countPerPage, queryString);
                            var url = $rootScope.baseUrl + 'addassgn/getsalesarealist/' + $scope.organization.organizationId;
                            // var url = $rootScope.baseUrl + 'addassgn/getsalesarealist/3';
                            genericService.addObject(url, obj).then(function (data) {
                                $scope.salesAreaList = data.data;
                            }, function () {
                                return null;
                            });
                            break;
                        case 'customer':
                            pageNumberForCustomer = 1;
                            queryString = $(arg1).val();
                            var url = null;
                            if ($scope.selectedObject.salesAreaId !== 0) {
                                url = $rootScope.baseUrl + 'addassgn/getCustomerBasedOnSalesAreaId/' + $scope.selectedObject.salesAreaId + '/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                            } else {
                                url = $rootScope.baseUrl + 'addassgn/allcustomerlist/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                                // url = $rootScope.baseUrl + 'addassgn/allcustomerlist/48111';
                            }
                            var obj = prepareApiObject(pageNumberForCustomer, countPerPage, queryString);
                            genericService.addObject(url, obj).then(function (data) {
                                $scope.customerList = data.data;
                            }, function () {
                                return null;
                            });
                            break;
                        default:
                            break;
                    }
                    $(document).on('myCustomEvent', customEventHandler);
                }, 1000);
            }

            $(document).on("myCustomEvent", customEventHandler);
            $scope.getSalesAreaList = function () {
                $log.debug('getSalesAreaList :' + $scope.selectedObjectName.salesArea);
                var obj = prepareApiObject(pageNumberForSales, countPerPage, queryString);
                var url = $rootScope.baseUrl + 'addassgn/getsalesarealist/' + $scope.organization.organizationId;
                // var url = $rootScope.baseUrl + 'addassgn/getsalesarealist/3';
                genericService.addObject(url, obj).then(function (response) {
                    $scope.salesAreaList = response.data;
                    if ($scope.salesAreaList.length !== 0 && $scope.defaultAddressIds.salesAreaId) {
                        $scope.salesvalidationRequired = true;
                        var obj = $filter('filter')($scope.salesAreaList, { salesAreaId: $scope.defaultAddressIds.salesAreaId }, true);
                        if (obj.length) {
                            $scope.selectedObjectName.salesArea = obj[0];
                            $scope.selectedObject.salesAreaId = obj[0].salesAreaId;
                            pageNumberForSales++;
                            $scope.salesAreaSelected();
                        } else {
                            queryString = $scope.defaultAddressIds.salesAreaName;
                            var obj = prepareApiObject(pageNumberForSales, 1000, queryString);
                            var url = $rootScope.baseUrl + 'addassgn/getsalesarealist/' + $scope.organization.organizationId;
                            genericService.addObject(url, obj).then(function (data) {
                                var obj = $filter('filter')(data.data, { salesAreaId: $scope.defaultAddressIds.salesAreaId }, true);
                                $scope.salesAreaList.push(angular.copy(obj[0]));
                                $scope.selectedObjectName.salesArea = obj[0];
                                $scope.selectedObject.salesAreaId = obj[0].salesAreaId;
                                pageNumberForSales++;
                                $scope.salesAreaSelected();
                            }, function () {
                                return null;
                            });
                        }
                    } else {
                        if ($scope.salesAreaList.length) {
                            $scope.salesvalidationRequired = true;
                        } else {
                            $scope.salesvalidationRequired = false;
                        }
                        $scope.selectedObjectName.salesArea.salesAreaId = 0;
                        $scope.selectedObject.salesAreaId = 0;
                        // if (!$scope.defaultAddressIds.salesAreaId && $scope.defaultAddressIds.customerId) {
                        $scope.salesAreaSelected();
                        // }
                    }
                }, function (response) {
                });
            }

            $scope.salesAreaSelected = function () {
                $log.debug('$scope.selectedObjectName.salesArea : ' + angular.toJson($scope.selectedObjectName.salesArea));
                if (angular.isDefined($scope.selectedObjectName.salesArea.salesAreaId)) {
                    $scope.selectedObject.salesAreaId = $scope.selectedObjectName.salesArea.salesAreaId;
                }
                $scope.selectedObjectName.customer = '';
                $scope.selectedObjectName.billing = '';
                $scope.selectedObjectName.shipping = '';
                $scope.customerList = [];
                $scope.billingAddressList = [];
                $scope.shippingAddressList = [];
                pageNumberForCustomer = 1;
                if ($scope.selectedObject.salesAreaId !== 0) {
                    if ($scope.defaultAddressIdsCopy.salesAreaId !== $scope.selectedObject.salesAreaId) {
                        $scope.defaultAddressIds.salesAreaId = $scope.selectedObject.salesAreaId;
                        $scope.defaultAddressIds.customerId = 0;
                        $scope.defaultAddressIds.billToAddressId = 0;
                        $scope.defaultAddressIds.shipToAddressId = 0;
                    } else {
                        $scope.defaultAddressIds = angular.copy($scope.defaultAddressIdsCopy);
                    }
                    $scope.getCustomerListWithSalesAreaID();
                } else {
                    $scope.getCustomerListWithoutSalesAreaID();
                }
                if ($scope.salesvalidationRequired && $scope.addressForm.$submitted && $scope.selectedObject.salesAreaId === 0) {
                    delete $scope.addressForm.sales.$error.required;
                }
            }
            $scope.getCustomerListWithoutSalesAreaID = function () {
                $scope.customerList = [];
                queryString = null;
                var obj = prepareApiObject(pageNumberForCustomer, countPerPage, queryString);
                var url = $rootScope.baseUrl + 'addassgn/allcustomerlist/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                genericService.addObject(url, obj).then(function (data) {
                    $scope.customerList = data.data;
                    $log.debug("listtttt :" + angular.toJson($scope.customerList))
                    if ($scope.customerList.length !== 0 && $scope.defaultAddressIds.customerId) {
                        var obj = $filter('filter')($scope.customerList, { customerId: $scope.defaultAddressIds.customerId }, true);
                        if (obj.length) {
                            $log.debug('getCustomerListWithSalesAreaID if ddddd' + angular.toJson(obj));
                            $scope.selectedObjectName.customer = obj[0];
                            $scope.selectedObject.customerId = obj[0].customerId;
                            pageNumberForCustomer++;
                            $log.debug("cus :" + angular.toJson($scope.selectedObjectName.customer.customerName));
                            $scope.customerSelected();
                        } else {
                            $log.debug('getCustomerListWithoutSalesAreaID else');
                            queryString = $scope.defaultAddressIds.customerName;
                            var obj = prepareApiObject(pageNumberForCustomer, 1000, queryString);
                            url = $rootScope.baseUrl + 'addassgn/allcustomerlist/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                            genericService.addObject(url, obj).then(function (data) {
                                var obj = $filter('filter')(data.data, { customerId: $scope.defaultAddressIds.customerId }, true);
                                $scope.customerList.push(angular.copy(obj[0]));
                                $scope.selectedObjectName.customer = obj[0];
                                $scope.selectedObject.customerId = obj[0].customerId;
                                pageNumberForCustomer++;
                                $scope.customerSelected();
                            }, function () {
                                return null;
                            });
                        }
                    }
                }, function () {
                    $log.debug('getcustomerListWithoutSalesAreaID in fail:' + data);
                    return null;
                });
            }

            $scope.getCustomerListWithSalesAreaID = function () {
                $log.debug('getCustomerListWithSalesAreaID');
                // $scope.customerList = [];

                queryString = null;
                var obj = prepareApiObject(pageNumberForCustomer, countPerPage, queryString);
                var url = $rootScope.baseUrl + 'addassgn/getCustomerBasedOnSalesAreaId/' + $scope.selectedObject.salesAreaId + '/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                genericService.addObject(url, obj).then(function (data) {
                    $log.debug('getCustomerListWithSalesAreaID result :' + angular.toJson(data));
                    $scope.customerList = data.data;
                    $log.debug('1111 customerId: ' + $scope.defaultAddressIds.customerId);
                    if ($scope.customerList.length !== 0 && $scope.defaultAddressIds.customerId) {
                        $log.debug('getCustomerListWithSalesAreaID inside if');
                        var obj = $filter('filter')($scope.customerList, { customerId: $scope.defaultAddressIds.customerId }, true);
                        $log.debug('getCustomerListWithSalesAreaID if ddddd' + angular.toJson(obj));
                        if (obj.length) {

                            $scope.selectedObjectName.customer = obj[0];
                            $scope.selectedObject.customerId = obj[0].customerId;
                            pageNumberForCustomer++;
                            $scope.customerSelected();
                        } else {
                            $log.debug('getCustomerListWithSalesAreaID else');
                            queryString = $scope.defaultAddressIds.customerName;
                            var obj = prepareApiObject(pageNumberForCustomer, 1000, queryString);
                            url = $rootScope.baseUrl + 'addassgn/allcustomerlist/' + $scope.userDetails.userId + '/' + $scope.organization.organizationId;
                            genericService.addObject(url, obj).then(function (data) {
                                var obj = $filter('filter')(data.data, { customerId: $scope.defaultAddressIds.customerId }, true);
                                $scope.customerList.push(angular.copy(obj[0]));
                                $scope.selectedObjectName.customer = obj[0];
                                $scope.selectedObject.customerId = obj[0].customerId;
                                pageNumberForCustomer++;
                                $scope.customerSelected();
                            }, function () {
                                return null;
                            });
                        }
                    } else {
                        $log.debug('getCustomerListWithSalesAreaID inside else');
                    }
                }, function (response) {
                    $log.debug('getCustomerListWithSalesAreaID error');
                });
            }

            $scope.customerSelected = function () {
                $log.debug("customerSelected");
                $scope.selectedObject.customerId = $scope.selectedObjectName.customer.customerId;
                if ($scope.selectedObject.customerId !== 0) {
                    if ($scope.addressForm.$submitted && !$scope.addressForm.customer.$error.required) {
                        delete $scope.addressForm.customer.$error.required;
                    }
                    var obj = $filter('filter')($scope.customerList, { customerId: $scope.selectedObject.customerId }, true);
                    if (obj.length) {
                        // $scope.selectedObjectName.customer = obj[0].customerName;
                        $scope.selectedObjectName.customer = obj[0];
                    }
                    if ($scope.defaultAddressIdsCopy.customerId !== $scope.selectedObject.customerId) {
                        $scope.defaultAddressIds.customerId = $scope.selectedObject.customerId;
                        $scope.defaultAddressIds.billToAddressId = 0;
                        $scope.defaultAddressIds.shipToAddressId = 0;
                    }
                    $scope.selectedObject.billToAddressId = 0;
                    $scope.selectedObjectName.billing = '';
                    $scope.selectedObjectName.shipping = '';
                    $scope.billingAddressList = [];
                    $scope.shippingAddressList = [];
                    $log.debug("selected :" + angular.toJson($scope.selectedObjectName.billing) + "selectedObjectName.shipping :" + $scope.selectedObjectName.shipping);
                    $scope.getBillingAddress();
                }
            }
            $("#choicelist").mouseover(function (e) {
                $log.debug("jhjhj");
                $("#choicelist").addClass('highlight');
            })
            $("#choicelist").mouseout(function (e) {
                $("#choicelist").removeClass('highlight');
            })

            $scope.getBillingAddress = function () {
                $log.debug('getBillingAddress :' + $scope.selectedObject.billToAddressId + '$scope.selectedObjectName.billing :' + angular.toJson($scope.selectedObjectName.billing));

                genericService.getObjects($rootScope.baseUrl + 'addassgn/getbilladd/' + $scope.selectedObject.customerId + '/' + addressTypeForBillingAddress).then(function (response) {
                    if (response.length) {
                        $scope.billingAddressList = response;
                        var obj = $filter('filter')($scope.billingAddressList, { addressId: $scope.defaultAddressIds.billToAddressId }, true);
                        if (obj.length) {
                            $scope.selectedObject.billToAddressId = obj[0].addressId;
                            $scope.selectedObjectName.billing = obj[0];
                            $log.debug('$scope.selectedObject.billToAddressId :' + $scope.selectedObject.billToAddressId + '$scope.selectedObjectName.billing :' + angular.toJson($scope.selectedObjectName.billing));
                            $scope.billingAddressSelected();

                        }
                    } else {
                        $scope.billingAddressList = [];
                        $scope.shippingAddressList = [];
                        $log.debug("In getBillingAddress no lenght :" + angular.toJson($scope.selectedObjectName.billing));
                    }
                }, function (response) {
                    $scope.billingAddressList = [];
                    $scope.shippingAddressList = [];
                    $log.debug('getBillingAddress error ');
                    $scope.selectedObjectName.billing = '';
                    $scope.selectedObjectName.shipping = '';
                });
            }

            $scope.billingAddressSelected = function () {
                $log.debug("selected billingAddressSelected :" + angular.toJson($scope.selectedObjectName.billing));
                $scope.selectedObject.billToAddressId = $scope.selectedObjectName.billing.addressId;
                if ($scope.selectedObject.billToAddressId !== 0) {
                    if ($scope.addressForm.$submitted && !$scope.addressForm.billing.$error.required) {
                        delete $scope.addressForm.billing.$error.required;
                    }
                    $scope.selectedObjectName.shipping = '';
                    if ($scope.defaultAddressIdsCopy.billToAddressId !== $scope.selectedObject.billToAddressId) {
                        $scope.defaultAddressIds.billToAddressId = $scope.selectedObject.billToAddressId;
                        $scope.defaultAddressIds.shipToAddressId = 0;
                    }
                    $scope.getShippingAddress();
                }
            }

            $scope.getShippingAddress = function () {
                genericService.getObjects($rootScope.baseUrl + 'addassgn/getshipadd/' + $scope.selectedObject.customerId + '/' + addressTypeForShippingAddress).then(function (response) {
                    if (response.length) {
                        $scope.shippingAddressList = response;
                        var obj = $filter('filter')($scope.shippingAddressList, { addressId: $scope.defaultAddressIds.shipToAddressId }, true);
                        if (obj.length) {
                            $scope.selectedObject.shipToAddressId = obj[0].addressId;
                            $scope.selectedObjectName.shipping = obj[0];
                        }
                    } else {
                        $scope.shippingAddressList = [];
                    }
                }, function (response) {
                    $scope.shippingAddressList = [];
                });
            }

            $scope.shippingAddressSelected = function () {
                $scope.selectedObject.shipToAddressId = $scope.selectedObjectName.shipping.addressId;
                if ($scope.addressForm.$submitted && !$scope.addressForm.shipping.$error.required) {
                    delete $scope.addressForm.shipping.$error.required;
                }
                if ($scope.defaultAddressIdsCopy.billToAddressId !== $scope.selectedObject.billToAddressId) {
                    $scope.defaultAddressIds.shipToAddressId = $scope.selectedObject.billToAddressId;
                }
                $log.debug('shipping address selected');
            }

            $scope.saveDefaultAddress = function () {
                if ($scope.salesvalidationRequired && $scope.addressForm.$submitted && $scope.selectedObject.salesAreaId === 0) {
                    $scope.addressForm.sales.$error.required = true;
                    return;
                }
                if ($scope.addressForm.$submitted && ($scope.selectedObject.customerId === 0 || $scope.selectedObject.billToAddressId === 0 || $scope.selectedObject.shipToAddressId === 0)) {
                    if ($scope.selectedObject.customerId === 0) {
                        $scope.addressForm.customer.$error.required = true;
                    }
                    if ($scope.selectedObject.billToAddressId === 0) {
                        $scope.addressForm.billing.$error.required = true;
                    }
                    if ($scope.selectedObject.shipToAddressId === 0) {
                        $scope.addressForm.shipping.$error.required = true;
                    }
                } else {
                    var obj = angular.copy($scope.selectedObject);
                    obj.userId = $scope.userDetails.userId;
                    obj.adminId = $rootScope.adminId;
                    obj.organizationId = $scope.organization.organizationId;
                    obj.userOrgId = $scope.userOrganizationId;
                    obj.userOrgBillShipId = $scope.defaultAddressIds.userOrgBillShipId;
                    obj.userOrgBillShipId = $scope.defaultAddressIds.userOrgBillShipId;
                    obj.userOrgSalesAreaId = $scope.defaultAddressIds.userOrgSalesAreaId;
                    // genericService.addObject($rootScope.baseUrl + 'addassgn/getsalesareamap', obj).then(function (response) {
                    //     genericService.addObject($rootScope.baseUrl + 'addassgn/getbillshipmap', obj).then(function (response) {
                    //         $.toaster({ priority: 'success', message: defaultAddressSavedSucess });
                    //         $state.go('home.userassignment.division', {}, { reload: true });
                    //     }, function (response) {
                    //         $.toaster({ priority: 'danger', message: defaultAddressSavedFailed });
                    //     });
                    // }, function (response) {
                    //     $.toaster({ priority: 'danger', message: defaultAddressSavedFailed });
                    // });
                    genericService.addObject($rootScope.baseUrl + 'addassgn/saveOrUpdateDefaultAddress', obj).then(function (response) {
                        $.toaster({ priority: 'success', message: defaultAddressSavedSucess });
                        $state.go('home.userassignment.division', {}, { reload: true });
                    }, function (response) {
                        $.toaster({ priority: 'danger', message: defaultAddressSavedFailed });
                    });
                }
            }

            $scope.cancel = function () {
                StorageService.remove('organization');
                $state.go('home.userassignment.division', { userDetails: $scope.userDetails }, { reload: true });
            }

            var onLoadTasks = function () {
                getUserOrganizationId();
                onresize();
            }
            onLoadTasks();
        }
    ]);

addressmodule.factory('addressService', ['ADDRESSCONSTANTS',
    function (ADDRESSCONSTANTS) {
        var factory = {};
        return factory;
    }
]);


addressmodule.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
            var keys = Object.keys(props);
            items.forEach(function (item) {
                var itemMatches = false;
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});