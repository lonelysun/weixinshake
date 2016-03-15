angular.module('weixin.controllers', ['weixin.services'])
	.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state,$http,$localstorage) {

	// Form data for the login modal
	$scope.loginData = {};
	
	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
	    scope: $scope
	  	}).then(function(modal) {
	    $scope.modal = modal;
	});
	
	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
	    $scope.modal.hide();
	};
	
	// Open the login modal
	$scope.login = function() {
	    $scope.modal.show();
	};
	
	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
	
	
	// Simulate a login delay. Remove this and replace with your login
	// code if using a login system
	$timeout(function() {
	      $scope.closeLogin();
	    }, 1000);
	};
  
	$scope.weixinAPI = [];
	wx.hideOptionMenu();

	$http.get('../index.php?option=com_admin&task=wechat.getConfig&url='+encodeURIComponent(location.href.split('#')[0]))
      	.success(function(data){
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: data.appId, // 必填，公众号的唯一标识
			    timestamp:data.timestamp , // 必填，生成签名的时间戳
			    nonceStr: data.nonceStr, // 必填，生成签名的随机串
			    signature: data.signature,// 必填，签名，见附录1
			    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZonea'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			}); 
      	});
	})


	.controller('PlaylistsCtrl', function($scope) {
	  $scope.playlists = [
	    { title: 'Reggae', id: 1 },
	    { title: 'Chill', id: 2 },
	    { title: 'Dubstep', id: 3 },
	    { title: 'Indie', id: 4 },
	    { title: 'Rap', id: 5 },
	    { title: 'Cowbell', id: 6 }
	  ];
	})
	
	
	//获取卡列表
	.controller('CardListCtrl', function($scope,$http,$state,$ionicLoading) {
		$scope.list = []; 
		function getURLParameter(name) {
			return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1] );
		}
		var code = getURLParameter('code');
		var shareId = getURLParameter('share_id');
		$ionicLoading.show();
		if(code != 'null'&& shareId =='null')
		{
			$http.get('../index.php?option=com_admin&task=wechat.authUser&code='+code)
				.success(function(data){
      
				if(data.error ==0){
					$http.get('../index.php?option=com_admin&task=wechat.getCardList')
						.success(function(data){
							$ionicLoading.hide();
				        if(data.error == 0) 
				        	$scope.list = data.data;
				        else
				        	alert(data.message);
				    });
				}
			});

		}else{
			$http.get('../index.php?option=com_admin&task=wechat.getCardList')
				.success(function(data){
					$ionicLoading.hide();
		        if(data.error == 0) 
		        	$scope.list = data.data;
		        else
		        	alert(data.message);
				});
		}
    })
    
    //获取卡明细
	.controller('CardDetailCtrl', function($scope,$http,$stateParams) {
	    $scope.cardDetail = {};
	    $http.get('../index.php?option=com_admin&task=wechat.getCardDetail&cardId='+$stateParams.cardId)
	    .success(function(data){
	        if(data.error == 0)
	        $scope.cardDetail = data.data;
	        else
	        alert(data.message);
	    });
	 })

	 //电子卡操作
	 .controller('CardCtrl', function($scope,$http,$stateParams) {

		 $scope.cardDetail = {};
		 
		 var site_url ='http://wx.wevip.com/weixin';
		 
		 $http.get('../index.php?option=com_admin&task=wechat.getCardDetail&cardId='+$stateParams.cardId)
		 	.success(function(data){
		 		if(data.error == 0){
		 			$scope.cardDetail = data.data;
		 			var imgUrl = (data.data.square_image ==''?data.data.image_url:data.data.square_image);

		 			if(data.data.need_share!=2 && data.data.status<2){
		 				wx.showOptionMenu();
		 			}else{
		 				wx.hideOptionMenu();
		 			}
            
		 			wx.onMenuShareAppMessage({
		 				title: '送你一张'+data.data.company_name+'的优惠卡券', // 分享标题
		 				desc: '商户名称:'+data.data.company_name+' 卡券名称:'+data.data.product_name, // 分享描述
		 				link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx95568e4ce4c89455&redirect_uri='+site_url+'?share_id='+data.data.id+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect', // 分享链接
		 				imgUrl: imgUrl, // 分享图标
		 				type: '', // 分享类型,music、video或link，不填默认为link
		 				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		 				success: function () { 
		 					alert('发送成功');
		 					// 用户确认分享后执行的回调函数
		 				},
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
		 			});
        
		 			wx.onMenuShareTimeline({
		 				title: '送你一张'+data.data.company_name+'的优惠卡券,先抢先得哦', // 分享标题
		 				link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx95568e4ce4c89455&redirect_uri='+site_url+'?share_id='+data.data.id+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect', // 分享链接
		 				imgUrl: imgUrl, // 分享图标
					    success: function () { 
					        alert('转赠成功');
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
		 			});
		 		} else{
		 			alert(data.message);
		 		}
		 	});
			$scope.sendFriend = function(){
			    $('.pop-bg').show();
			}
			$('.pop-bg').on('click',function(){
			    $('.pop-bg').hide();
			});
	 })
 
 
	.controller('FollowCtrl', function($scope,$http,$stateParams) {
	  $scope.followDetail = {follow_url:'http://wevip.com/images/follow_wkml.jpg'};
	  //$scope.followDetail = {follow_url:'http://testwevip.com/images/follow_wkml.jpg'};
	})
	
	//识别二维码
	.controller('CardQrcodeCtrl', function($scope,$http,$stateParams) {
	    $scope.cardDetail = {};
	    $http.get('../index.php?option=com_admin&task=wechat.getCardDetail&cardId='+$stateParams.cardId)
	    .success(function(data){
	        if(data.error == 0)
	        $scope.cardDetail = data.data;
	        else
	        alert(data.message);
	    });
	 })

	 //领取卡券
	 .controller('PhoneCtrl', function($scope,$ionicLoading,$http,$state) {
		 
		 var phone='';
		 $http.get('../index.php?option=com_admin&task=wechat.getUserPhone')
			.success(function(data){
				
				if(data.error == 0)
					 $scope.jform.phone = data.data;
		 });
		 
		 $scope.jform ={
	        'phone':phone
		 }
		 $scope.getCard = function(){
            if($scope.jform.phone == undefined ||$scope.jform.phone ==0){
                alert('手机格式不对哦');
                return;
            }
            $ionicLoading.show();
            $http.get('../index.php?option=com_admin&task=wechat.setPhone&phone='+$scope.jform.phone).success(function(data){
            	$ionicLoading.hide();
	           if(data.error == 1){
	               alert(data.message);
	           }else{
	        	   
	               $state.go('app.card',{'cardId':data.data});
	           }
            });

		 }
	 })
	 
	 //红包
	.controller('RedpackCtrl', function($scope,$http,$stateParams,$state,$ionicLoading) {
	    $scope.cardDetail = {};
		function getURLParameter(name) {
		    return decodeURI(
		        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		    );
		}
		$scope.debug={};
		var code = getURLParameter('code');
		var biz = getURLParameter('biz');
		var sign =getURLParameter('sign');
		var post_data={code:code,biz:biz}
		$http.post('../index.php?option=com_admin&task=wechat.redPack',post_data).success(function(data){
        	 console.info(data);
        	 $scope.debug=data;
        });
		 
		  
	})
	
	 //分享
	.controller('CardShareCtrl', function($scope,$http,$stateParams,$state,$ionicLoading) {
	    $scope.cardDetail = {};
		function getURLParameter(name) {
		    return decodeURI(
		        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		    );
		}
		var code = getURLParameter('code');
		 
		$ionicLoading.show();
		if(code != 'null')
		{
		    $http.get('../index.php?option=com_admin&task=wechat.authUser&code='+code)
		    .success(function(data){
		    	 
		        $ionicLoading.hide();
		    });
		}
		
		$http.get('../index.php?option=com_admin&task=wechat.getCardDetail&cardId='+$stateParams.cardId)
			.success(function(data){
	        if(data.error == 0)
	        	$scope.cardDetail = data.data;
	        else
	        	alert(data.message);
		});

		$scope.jform ={
				'phone':''
		}
        $scope.getCard = function(){
            if($scope.jform.phone == undefined ||$scope.jform.phone ==0){
                alert('手机格式不对哦');
                return;
            }
            $ionicLoading.show();
            $http.get('../index.php?option=com_admin&task=wechat.setSharePhone&phone='+$scope.jform.phone+'&cardid='+$stateParams.cardId+'&code='+code).success(function(data){
            	$ionicLoading.hide();
            	if(data.error == 1){
            		alert(data.message);
            	}else{

	            	if(data.cardid>0){
	            		alert('恭喜！领取成功！')
	            		
	            		$state.go('app.card',{'cardId':data.cardid});
	            	}else{
	            		
	            		$state.go('app.card',{'cardId':$stateParams.cardId});
	            	}
            	}
            });
		}
	})

	//首页
	.controller('HomeCtrl',[ '$scope','$http','$stateParams','shake','$localstorage','$state',function($scope,$http,$stateParams,shake,$localstorage,$state){
		
		
		
		shake.getTicket();
		shake.load();
		$scope.userinfo = $localstorage.getObject('userinfo');

		//关闭
		$scope.close = function (str){
			$('.'+str).addClass('none');
			$('.pop_bg').remove();
		}
		//领取
		$scope.getPhone = function(){
			$state.go('app.phone');
			$('.pop_1').addClass('none');
			$('.pop_bg').remove();
		}
    
		//卡列表页面
		$scope.getMyCard = function(){
		   $state.go('app.cardList');  
		}

		function autoChange(maxWidth,originSize){
            var width=document.documentElement.clientWidth;
            var Standard=originSize/(maxWidth*1.0/width);
            document.querySelector("html").style.fontSize=Standard+"px";
            window.font_size=Standard;
            return;
        };
        autoChange(640,100);
        document.querySelector(".hand").style.webkitAnimation="shake .8s ease 1s 99999";

        window.onresize=function(){autoChange(640,100)};
      
        var height=document.documentElement.clientHeight;
        var imgheight=(height-614/554*$('.round').innerWidth())/2;
        var div=$('.center>div');
        $('.center').css({"margin-top":imgheight+"px"});
       
        $('.hb').css({"left":(div.innerWidth()-$('.hb').innerWidth())/2+"px"});

		div.css({"left":(document.querySelector(".center").clientWidth-div.innerWidth())/2+"px"});
		$('.hand').css({"left":(div.innerWidth() -139)/2.0+"px"});

  
		var cloud1=document.querySelector("cloud1");
            $('.cloud1').css({"top":(80/1136*document.documentElement.clientHeight)+"px","left":(35/640*document.documentElement.clientWidth)+"px"});
            $('.cloud2').css({"top":(30/1136*document.documentElement.clientHeight)+"px","left":(385/640*document.documentElement.clientWidth)+"px"});
            $('.cloud3').css({"top":(205/1136*document.documentElement.clientHeight)+"px","left":(120/640*document.documentElement.clientWidth)+"px"});
            $('.cloud4').css({"top":(140/1136*document.documentElement.clientHeight)+"px","left":(490/640*document.documentElement.clientWidth)+"px"});
            $('.bottom span').css({"left":($('.bottom').offset().width -75)/2.0+"px"});
        var div=$('.des');
        div.css({"left":($('.item-home').innerWidth()-div.innerWidth())/2.0+"px"});

        var width=window.font_size*.86;
        $('.logo').css({"left":(window.font_size*4.06-width)/2+"px"});
        document.querySelector(".cloud1").style.webkitAnimation="cloud1 10s linear 99999";
        document.querySelector(".cloud2").style.webkitAnimation="cloud1 12s linear 99999";
        document.querySelector(".cloud3").style.webkitAnimation="cloud1 10s linear 99999";
        document.querySelector(".cloud4").style.webkitAnimation="cloud1 9s linear 99999";
        document.querySelector(".hand").style.webkitAnimation="shake .8s ease 1s 99999";
        document.querySelector(".q").style.webkitAnimation="turn2 1.2s ease 1 forwards";
        document.querySelector(".lw").style.webkitAnimation="turn3 1.2s ease 1 forwards";
        document.querySelector(".yy").style.webkitAnimation="turn4 1.2s ease 1 forwards";
        document.querySelector(".dy").style.webkitAnimation="turn5 1.2s ease 1 forwards";
        document.querySelector(".hb").style.webkitAnimation="turn1 1.2s ease 1 forwards";

        $('.des').on('click',function(){
                       var bottom = $(this).css('bottom');
            if(bottom == '0px'){
                 $(this).css('bottom','181px');
                 $('.two').css('bottom','181px');
            }else{
                $(this).css('bottom','0px');
                $('.two').css('bottom','0px');
            }
        })

	}])

	.controller('PlaylistCtrl', function($scope, $stateParams) {
});
