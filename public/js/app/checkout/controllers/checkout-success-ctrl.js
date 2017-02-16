/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.checkout')
/**
 * This is the controller for the checkout view, which includes the order form as well as a view of the cart.
 *
 * The scope provides access to the data models "order" and "cart", as well as some properties to control display
 * of errors.
 *
 * In the checkout HTML, the "steps" are created by using nested forms which can be individually validated.
 *
 * The wizard directive defined in mobileCheckoutWizard does not come into play in full screen mode.  Required fields
 * are checked and enforced when the user indicates "submit".
 *
 * The controller also includes logic to copy the bill-to address to the ship-to address if that's what the user has indicated.
 *
 * This version assumes that payment processing and pre-validation is done through Stripe.
 *
 * While the order is processing (both Stripe validation and order API call), the submit button is disabled.
 * On success, the order confirmation page is shown.  On failure, an error message is displayed and the submit button
 * is re-enabled so that the user can make changes and resubmit if needed.
 *
 * */
    .controller('CheckoutSuccessCtrl', ['$rootScope', '$scope', '$stateParams', '$location', '$anchorScroll', 'CheckoutSvc','cart', 'order', '$state', '$modal', 'AuthSvc', 'AccountSvc', 'AuthDialogManager', 'GlobalData',  'ShippingSvc', 'shippingZones', '$q', 'CartSvc', '$timeout', 'settings',
        function ($rootScope, $scope, $stateParams, $location, $anchorScroll, CheckoutSvc, cart, order, $state, $modal, AuthSvc, AccountSvc, AuthDialogManager, GlobalData,  ShippingSvc, shippingZones, $q, CartSvc, $timeout, settings) {

            $scope.user = GlobalData.user;
            order = sessionStorage.getItem("orderForPaypal");
            
            /** Show error message after failed checkout, re-enable the submit button and reset any wait cursor/splash screen.
             * @param error message*/

             var getAccount = function() {
                $scope.order.account = {};
                AccountSvc.account().then(function(account) {
                    $scope.order.account.email = account.contactEmail;
                    $scope.order.account.title = account.title;
                    $scope.order.account.firstName = account.firstName;
                    $scope.order.account.middleName = account.middleName;
                    $scope.order.account.lastName = account.lastName;
                });
            };

            function onCheckoutFailure (error) {
                $scope.message = error;
            }

            /** Advances the application state to the confirmation page. */
            var checkoutSuccessHandler = function goToConfirmationPage(order) {

                var piwikOrderDetails = {
                    orderId: order.id,
                    checkoutId: order.id,
                    cart: order.cart
                };
                /**
                 * It is possible for a checkout to go through, but the order placement itself will fail.  If this
                 * is the case we still want to show the user the confirmation page, but instead of displaying
                 * order details, it will let the user know that the checkout passed but the order was not placed.
                 */
                var entity = order.id ? 'order' : 'checkout';
                var id = order.id;// ? order.id : order.id;
                //Send data to piwik
                $rootScope.$emit('order:placed', piwikOrderDetails);

                //Reset cart
                CheckoutSvc.resetCart();

                //modal.close();
                $state.go('base.confirmation', {id: id, entity: entity});
            };

            /** Handles a failed "checkout"/order submission event. */
            var checkoutErrorHandler = function (error) {
                console.log("Errorrrr");
                console.log(error);
            };

            var placeOrderWithPaypal = function () {
                var order = sessionStorage.getItem("orderForPaypal");
                $scope.order = angular.fromJson(order);
                settings.hybrisUser = $scope.order.account.email;
                CheckoutSvc.complateOrderWithPaypal($scope.order, $stateParams.token).then(checkoutSuccessHandler, checkoutErrorHandler);
            };
            placeOrderWithPaypal();

            $timeout(function () {
                if (!angular.fromJson($scope.order).cart.id) {
                    $state.go(settings.allProductsState).then(function() {
                        $rootScope.showCart = true;
                    });
                }
            }, 1);

        }]);
