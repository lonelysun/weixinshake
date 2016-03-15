// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module(
		'weixin',
		[ 'ionic', 'weixin.controllers', 'oc.lazyLoad', 'weixin.services',
				'monospaced.qrcode' ])

// add lzayload config
.constant(
		'JQ_CONFIG',
		{
			common : [ 'css/common.css?v=20151125',
					'css/model_common.css?v=20151124' ],
			home : [ 'css/home/customized.css?v=20151126',
					'lib/jquery/home/customized.js' ],
			phone : [ 'css/phone.css?v=20151219', ],
		})

.config(
		function($stateProvider, $urlRouterProvider, JQ_CONFIG) {
			$stateProvider.state('app', {
				url : '/app',
				abstract : true,
				template : '<ion-nav-view name="menuContent"></ion-nav-view>',
				controller : 'AppCtrl'
			})

			.state('app.home', {
				url : '/home',
				views : {
					'menuContent' : {
						templateUrl : 'templates/home.html',
					// controller: 'HomeCtrl'
					}
				},
				resolve : load([ 'common', 'home' ])

			}).state('app.phone', {
				url : '/phone',
				views : {
					'menuContent' : {
						templateUrl : 'templates/phone.html',
						controller : 'PhoneCtrl'
					}
				},
				resolve : load([ 'common', 'phone' ])

			}).state('app.card', {
				url : '/card/:cardId',
				views : {
					'menuContent' : {
						templateUrl : 'templates/card.html',
						controller : 'CardCtrl'
					}
				},
				resolve : load([ 'common', 'phone' ])

			}).state('app.cardDetail', {
				url : '/carddetail/:cardId',
				views : {
					'menuContent' : {
						templateUrl : 'templates/cardDetail.html',
						controller : 'CardCtrl'
					}
				},
				resolve : load([ 'common', 'phone' ])
			}).state('app.redPack', {
				url : '/redPack/:biz',
				views : {
					'menuContent' : {
						templateUrl : 'templates/redpack.html',
						controller : 'RedpackCtrl'
					}
				},
				resolve : load([ 'common' ])

			}).state('app.cardList', {
				url : '/cardlist',
				views : {
					'menuContent' : {
						templateUrl : 'templates/cardList.html',
						controller : 'CardListCtrl'
					}
				},
				resolve : load([ 'common', 'phone' ])

			}).state('app.cardQrcode', {
				url : '/cardqrcode/:cardId',
				views : {
					'menuContent' : {
						templateUrl : 'templates/cardQrcode.html',
						controller : 'CardCtrl'
					}
				},
				resolve : load([ 'common', 'phone' ])

			}).state('app.follow', {
				url : '/follow',
				views : {
					'menuContent' : {
						templateUrl : 'templates/followQrcode.html',
						controller : 'FollowCtrl'
					}
				},
				resolve : load([ 'common', 'phone' ])

			}).state('app.cardShare', {
				url : '/cardshare/:cardId',
				views : {
					'menuContent' : {
						templateUrl : 'templates/cardShare.html',
						controller : 'CardShareCtrl'
					}
				},
				resolve : load([ 'common', 'phone' ])

			})

			.state('app.single', {
				url : '/playlists/:playlistId',
				views : {
					'menuContent' : {
						templateUrl : 'templates/playlist.html',
						controller : 'PlaylistCtrl'
					}
				}
			});

			function getURLParameter(name) {
				return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(
						location.search) || [ , null ])[1]);
			}
			var ticket = getURLParameter('ticket');
			var shareId = getURLParameter('share_id');
			var aid = getURLParameter('aid');
			var biz = getURLParameter('biz');
			 
			if (ticket == 'null') {
				if (shareId != 'null') {
					$urlRouterProvider.otherwise('/app/cardshare/' + shareId);
				} else {
					 
					if(aid=='null' && biz=='null'){
						$urlRouterProvider.otherwise('/app/cardlist');
					}else if(biz!='null'){
						 
						$urlRouterProvider.otherwise('/app/redPack/'+biz);
					}else{
						$urlRouterProvider.otherwise('/app/home');	
					}
				}
			} else {
				// if none of the above states are matched, use this as the
				// fallback
				$urlRouterProvider.otherwise('/app/home');
			}

			function load(srcs, callback) {
				return {
					deps : [
							'$ocLazyLoad',
							'$q',
							function($ocLazyLoad, $q) {
								var deferred = $q.defer();
								var promise = false;
								srcs = angular.isArray(srcs) ? srcs : srcs
										.split(/\s+/);
								if (!promise) {
									promise = deferred.promise;
								}
								angular.forEach(srcs, function(src) {
									promise = promise.then(function() {
										if (JQ_CONFIG[src]) {
											return $ocLazyLoad
													.load(JQ_CONFIG[src]);
										}
										angular.forEach(MODULE_CONFIG,
												function(module) {
													if (module.name == src) {
														name = module.name;
													} else {
														name = src;
													}
												});
										return $ocLazyLoad.load(name);
									});
								});
								deferred.resolve();
								return callback ? promise.then(function() {
									return callback();
								}) : promise;
							} ]
				}
			}

		});
