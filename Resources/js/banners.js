(function(module) {
    'use strict';
    module.config(function($stateProvider) {

        $stateProvider.state('zyncro.main.admin.banners', {
            url: '/banners',
            resolve: {},
            breadcrumb: {
                'class': 'active',
                stateName: 'zyncro.main.admin.banners',
                text: 'security'
            },
            views: {
                'admin-content@zyncro.main.admin': {
                    controller: 'zappBannersController as banner',
                    templateUrl: '/zyncroapps/assets/banners/tpl/banners.tpl.html'
                }
            },
            data: {
                pageTitle: 'Banners'
            }
        });
    });

    module.factory('zappBannersService', function(context, authorization) {

        var baseUrl = window.location.protocol + '//' + window.location.host + '/zyncroapps/banners',
            orgUrn = authorization.identity().organizationUrn;

        return {
            getUrl: baseUrl + '/getBanners/' + orgUrn + '/' + authorization.access_token(),
            saveUrl: baseUrl + '/saveBanner/' + orgUrn + '/' + authorization.access_token()
        };
    });

    module.controller('zappBannersController', function($scope, $q, $http, $translate, Notification, zappBannersService, $state) {

        $scope.model = {
            header: '',
            widget: ''
        };

        // GET BANNERS

        var getBanners = function() {
            $http.get(zappBannersService.getUrl)
                .then(function(response) {
                    switch ($scope.position) {
                        case 'header':
                            $scope.model.header = response.data.data[0].content;
                            break;
                        case 'widget':
                            $scope.model.widget = response.data.data[1].content;
                            break;
                    }
                });

        };

        // SAVE BANNERS
        $scope.save = function() {
            var services = [];
            var data = {
                url: zappBannersService.saveUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                method: 'POST'
            };

            // header
            data.params = {
                'position': 'HEADER',
                'content': $scope.model.header
            };
            services.push($http(data));

            // widget
            data.params = {
                'position': 'WIDGET',
                'content': $scope.model.widget
            };
            services.push($http(data));

            // sending data
            return $q.all(services)
                .then(function(response) {
                    Notification.success({
                        message: $translate.instant('admin.organization.banners.success')
                    });
                })
                .catch(function(response) {
                    Notification.error({
                        message: $translate.instant('admin.organization.banners.error')
                    });
                });
        };
    });


    module.directive('zappBanner', function($http, zappBannersService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                position: '@',
                source: '=?'
            },
            templateUrl: '/zyncroapps/assets/banners/tpl/bannerDirective.tpl.html',
            controller: function($scope) {
                $http.get(zappBannersService.getUrl)
                    .then(function(response) {
                        // poner el contenido del src en función de '$scope.position' (header|widget)
                        switch ($scope.position) {
                            case 'header':
                                $scope.source = response.data.data[0].content;
                                break;
                            case 'widget':
                                $scope.source = response.data.data[1].content;
                                break;
                        }
                    })
                    .catch(function(response) {});
            }
        };
    });


    module.directive('zappSidebarBanners', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: '/zyncroapps/assets/banners/tpl/widget.tpl.html'
        }
    });


    module.directive('zappHeaderBanners', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: '/zyncroapps/assets/banners/tpl/header.tpl.html'
        }
    });

    module.directive('bannerRender', function($sce, $state, $window, $document, $parse, $compile, $translate, usersService, $q, $filter) {
        return {
            restrict: 'A', // only activate on element attribute
            scope: {
                bannerRender: '='
            },
            link: function(scope, element, attrs) {
                var targetAttr = "";
                var text = scope.bannerRender;

                scope.translations = {
                    privatePublication: $translate.instant('mention.privatePublication')
                };

                /**
                 * URL REPLACES
                 */
                var mentionHashReplace = function(string) {
                    var patterns = {
                        hash: {
                            reg: /(^|\s)#([^#|^\s]*)/gim,
                            replace: '$1<a href class="hashtag-zyncro" ui-sref="zyncro.main.searchAll.messages({find: \'#$2\'})">#$2</a>'
                        },
                        url: {
                            reg: /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gim,
                            replace: '<a target="_blank" href="$1">$1</a> ',
                        },
                        image: {
                            reg: /(https?:\/\/.*\.(?:png|jpg))/gi,
                            replace: '<img src="$1">',
                        }

                    };

                    string = string
                        .replace(patterns.image.reg, patterns.image.replace)
                        .replace(patterns.hash.reg, patterns.hash.replace)
                        /*.replace(patterns.url.reg, patterns.url.replace)*/
                    ;

                    return string;
                };

                //Replace Mention & HashTag
                if (text) {
                    text = mentionHashReplace(text);
                }

                //Render Compile
                text = $sce.trustAsHtml(_.unescape(text));
                element.html(text);
                $compile(element.contents())(scope);

            }
        };
    });

    module.run(function(mainMenuAuxService) {

        // añade una opción al menu de administración
        mainMenuAuxService.addMenuOptions('admin', {
            title: 'zappBanners.admin.title',
            icon: 'fa fa-th fa-lg',
            href: 'zyncro.main.admin.banners',
            id: 'zyncro.main.admin.banners',
            system: true
        });
    });

}(angular.module('zyncro.zapps.banners', ['zyncro.helpers'])));
