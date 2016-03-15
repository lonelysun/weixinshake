angular.module('weixin.services',['common.services'])
.factory('shake',['$http','$localstorage',function($http,$localstorage,$ionicLoading){

    return {
        load:function() {
        	
        	//create a new instance of shake.js.
		    var myShakeEvent = new Shake({
		        threshold: 15
		    });

		    // start listening to device motion
		    myShakeEvent.start();
		    
		    var shakevice=new Audio("lib/jquery/public/sound.mp3");//加载声音代码必须在事件监听后执行
			shakevice.loop = false;
			shakevice.preload="preload";
			
		    // register a shake event
		    window.addEventListener('shake', shakeEventDidOccur, false);
		    function pop(elem,multi){
		        var body=$('.pop').parent();
		        if(!multi)
		            $('.pop').addClass("none");
		            shake_flag = 1;
		            elem.removeClass("none");
		        elem.css({"left":($(document.body).width()-$(elem).width())/2+"px"});
		    }

		    //shake event callback
		    function shakeEventDidOccur () {
				
				shakevice.play();
				
				 function getURLParameter(name) {
		            return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
		         }

				var ticket = getURLParameter('ticket');
				$http.get('../index.php?option=com_admin&task=wechat.getUserCard&ticket='+ticket).success(function(data){
					
				
					$localstorage.setObject('userinfo',data);
					var userinfo = data;
					if(userinfo.error ==1){
					    $('#pop_2_message').text(userinfo.message);
					    pop($('.pop_2'));
					}else{
						
					    if(userinfo.data.cardInfo.square_image == '')
					    	$('#notice_img').attr('src',userinfo.data.cardInfo.image_url);
					    else
					    	$('#notice_img').attr('src',userinfo.data.cardInfo.square_image);
					    $('#notice_page').text(userinfo.data.cardInfo.product_name);
					    pop($(".pop_1"));
					}
				});
		    }
        },
        getTicket: function() {
            $localstorage.destroy('userinfo');
            function getURLParameter(name) {
            	return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
            }

			var ticket = getURLParameter('ticket');
			var code = getURLParameter('code');
			var aid = getURLParameter('aid');
			 
			if(aid!='null' && code!='null'){
				$http.get('../index.php?option=com_admin&task=wechat.authUser&code='+code)
				.success(function(data){
					if(data.error ==0){
						return $http.get('../index.php?option=com_admin&task=wechat.getUserByPage&aid='+aid).success(function(data){
							 
							$localstorage.setObject('userinfo',data);
						    return data;
						});
					}
				});
			}
			else{
				 
				return $http.get('../index.php?option=com_admin&task=wechat.getUser&ticket='+ticket).success(function(data){
					
					$localstorage.setObject('userinfo',data);
				    return data;
				});
			}

        },
     }
}]);
