'use strict';

angular.module('ds.wishlist')
    .factory('WishlistSvc', ['WishlistREST',
        function(WishlistREST){
            return {
                createWishlist: function (newWishlist) {
                    WishlistREST.Wishlist.all('wishlists').post(newWishlist);
                }
            };
        }]);