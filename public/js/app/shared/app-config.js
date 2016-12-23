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

angular.module('ds.appconfig', [])

    /**
     *   Dynamic Build Configurations - for non-persistent, .gitignored application settings.
     *   to commit any changes to dynamic configurations - first remove it from .gitignore,
     *   then add it back to git ignore to avoid persisting build configurations in github.
     */

    .constant('appConfig', {

        dynamicDomain: function(){
            // Dynamic Domain is generated and replaced by build script, see gruntfile.
            return /*StartDynamicDomain*/ 'api.yaas.io' /*EndDynamicDomain*/;
        },

        storeTenant: function(){
            var tenantId = '';
            var pathLength = window.location.pathname.length;

            // Set tenant id from either single or multi tenant mode.
            if( pathLength > 1 ){
                tenantId = window.location.pathname.substring( 1, pathLength-1 );
            } else {
                // Dynamic ProjectId is configured and replaced by build script, see gruntfile.
                tenantId = /*StartProjectId*/ 'allforoneshop' /*EndProjectId*/;
            }
            return tenantId;
        },

        client: function() {
            // Dynamic ClientId is configured and replaced by build script, see gruntfile.
            return /*StartClient*/ 'allforoneshop.allforclient1' /*EndClient*/;
        },

        hybrisScopes: function() {
            // Dynamic ClientId is configured and replaced by build script, see gruntfile.
            return /*StartClient*/ 'hybris.order_read' /*EndClient*/;
        },

        clientId: function() {
            // Dynamic ClientId is configured and replaced by build script, see gruntfile.
            return /*StartClientId*/ 'UYJqQPwVVkNGDPIzl25CWYcTnelNvidA' /*EndClientId*/;
        },

        redirectURI: function() {
            // Dynamic RedirectURI is configured and replaced by build script, see gruntfile.
            return /*StartRedirectURI*/ 'https://api.eu.yaas.io/candemo/allforoneshopservice/v1' /*EndRedirectURI*/;
        }


    });
